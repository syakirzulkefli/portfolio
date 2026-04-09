import { NextResponse } from "next/server";
import {
  ensureApprovedUser,
  getSupabaseConfig,
} from "../../shared";

export const runtime = "edge";

type VerifyBody = {
  email?: string;
  code?: string;
  next?: string;
};

const asNonEmpty = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "";

const sanitizeNext = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") ? value : "/notes";

const verifyWithType = async (
  supabaseUrl: string,
  anonKey: string,
  email: string,
  token: string,
  type: "signup" | "email"
) => {
  const response = await fetch(`${supabaseUrl}/auth/v1/verify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ type, email, token }),
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => ({}));
  return { response, payload };
};

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = asNonEmpty(body.email).toLowerCase();
  const code = asNonEmpty(body.code);
  const next = sanitizeNext(body.next);

  if (!email || !code) {
    return NextResponse.json(
      { ok: false, error: "missing_email_or_code" },
      { status: 400 }
    );
  }

  try {
    let attempt = await verifyWithType(
      config.supabaseUrl,
      config.anonKey,
      email,
      code,
      "signup"
    );

    if (!attempt.response.ok) {
      const fallback = await verifyWithType(
        config.supabaseUrl,
        config.anonKey,
        email,
        code,
        "email"
      );
      if (fallback.response.ok) {
        attempt = fallback;
      } else {
        return NextResponse.json(
          { ok: false, error: "invalid_verification_code" },
          { status: 400 }
        );
      }
    }

    const accessToken =
      typeof attempt.payload === "object" &&
      attempt.payload !== null &&
      typeof (attempt.payload as { access_token?: unknown }).access_token === "string"
        ? (attempt.payload as { access_token: string }).access_token
        : "";
    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "invalid_session" },
        { status: 500 }
      );
    }

    const approval = await ensureApprovedUser(config, accessToken);
    if (!approval.ok) {
      if (approval.error === "approval_required") {
        return NextResponse.json({ ok: true, approved: false, next });
      }
      return NextResponse.json({ ok: false, error: approval.error }, { status: 401 });
    }

    return NextResponse.json({ ok: true, approved: true, next });
  } catch {
    return NextResponse.json(
      { ok: false, error: "provider_unavailable" },
      { status: 503 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  ensureOwnerAccess,
  getSupabaseConfig,
} from "../../shared";
import { isNotesOwnerEmail } from "../../owner";

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

  if (!isNotesOwnerEmail(email)) {
    return NextResponse.json({ ok: false, error: "owner_only" }, { status: 403 });
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

    const access = await ensureOwnerAccess(config, accessToken);
    if (!access.ok) {
      const status = access.error === "unauthenticated" ? 401 : 403;
      return NextResponse.json({ ok: false, error: access.error }, { status });
    }

    return NextResponse.json({ ok: true, approved: true, next });
  } catch {
    return NextResponse.json(
      { ok: false, error: "provider_unavailable" },
      { status: 503 }
    );
  }
}

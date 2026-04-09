import { NextResponse } from "next/server";
import {
  ensureApprovedUser,
  getSupabaseConfig,
  setSessionCookies,
} from "../../shared";

export const runtime = "edge";

type SignInBody = {
  email?: string;
  password?: string;
  next?: string;
};

const sanitizeNext = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") ? value : "/notes";

const asNonEmpty = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "";

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  let body: SignInBody;
  try {
    body = (await request.json()) as SignInBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = asNonEmpty(body.email).toLowerCase();
  const password = asNonEmpty(body.password);
  const next = sanitizeNext(body.next);

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "missing_email_or_password" },
      { status: 400 }
    );
  }

  let payload: unknown;
  try {
    const response = await fetch(
      `${config.supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: config.anonKey,
          authorization: `Bearer ${config.anonKey}`,
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      }
    );

    payload = await response.json();
    if (!response.ok) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        typeof (payload as { msg?: unknown }).msg === "string"
          ? ((payload as { msg: string }).msg || "").toLowerCase()
          : "";

      if (message.includes("email not confirmed")) {
        return NextResponse.json(
          { ok: false, error: "email_not_verified" },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { ok: false, error: "invalid_credentials" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "provider_unavailable" },
      { status: 503 }
    );
  }

  const accessToken =
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { access_token?: unknown }).access_token === "string"
      ? (payload as { access_token: string }).access_token
      : "";
  const refreshToken =
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { refresh_token?: unknown }).refresh_token === "string"
      ? (payload as { refresh_token: string }).refresh_token
      : "";

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 500 });
  }

  const approval = await ensureApprovedUser(config, accessToken);
  if (!approval.ok) {
    const status = approval.error === "approval_required" ? 403 : 401;
    return NextResponse.json({ ok: false, error: approval.error }, { status });
  }

  const response = NextResponse.json({ ok: true, next });
  setSessionCookies(response, accessToken, refreshToken);
  return response;
}

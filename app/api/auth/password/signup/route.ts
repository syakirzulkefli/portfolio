import { NextResponse } from "next/server";
import { getSupabaseConfig } from "../../shared";

export const runtime = "edge";

type SignUpBody = {
  email?: string;
  password?: string;
};

const asNonEmpty = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : "";

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  let body: SignUpBody;
  try {
    body = (await request.json()) as SignUpBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = asNonEmpty(body.email).toLowerCase();
  const password = asNonEmpty(body.password);

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "missing_email_or_password" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${config.supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: config.anonKey,
        authorization: `Bearer ${config.anonKey}`,
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const payload: unknown = await response.json();
    if (!response.ok) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        typeof (payload as { msg?: unknown }).msg === "string"
          ? ((payload as { msg: string }).msg || "").toLowerCase()
          : "";

      if (message.includes("already registered")) {
        return NextResponse.json(
          { ok: false, error: "email_already_registered" },
          { status: 409 }
        );
      }
      if (message.includes("password")) {
        return NextResponse.json(
          { ok: false, error: "invalid_password" },
          { status: 400 }
        );
      }

      return NextResponse.json({ ok: false, error: "signup_failed" }, { status: 400 });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "provider_unavailable" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Sign-up received. Check your email for the verification code, then verify below. Access still requires owner approval.",
  });
}

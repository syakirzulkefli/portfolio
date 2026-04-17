import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  ensureOwnerAccess,
  getSupabaseConfig,
  setSessionCookies,
} from "../shared";

export const runtime = "edge";

type SessionBody = {
  access_token?: string;
  refresh_token?: string;
};

export async function POST(request: Request) {
  let body: SessionBody;
  try {
    body = (await request.json()) as SessionBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.access_token || !body.refresh_token) {
    return NextResponse.json({ ok: false, error: "missing_tokens" }, { status: 400 });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  const access = await ensureOwnerAccess(config, body.access_token);
  if (!access.ok) {
    const status = access.error === "unauthenticated" ? 401 : 403;
    return NextResponse.json({ ok: false, error: access.error }, { status });
  }

  const response = NextResponse.json({ ok: true });
  setSessionCookies(response, body.access_token, body.refresh_token);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
}

import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  ensureApprovedUser,
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

  const approval = await ensureApprovedUser(config, body.access_token);
  if (!approval.ok) {
    const status = approval.error === "approval_required" ? 403 : 401;
    return NextResponse.json({ ok: false, error: approval.error }, { status });
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

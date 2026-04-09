import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const expired = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
  };
  response.cookies.set("sb-access-token", "", expired);
  response.cookies.set("sb-refresh-token", "", expired);
  return response;
}

import { NextResponse } from "next/server";

export const runtime = "edge";

type TrackPayload = {
  path?: string;
  referrer?: string;
  screen?: string;
  language?: string;
  timezone?: string;
};

const getClientIp = (request: Request) => {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return null;
};

const hashValue = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const arr = Array.from(new Uint8Array(digest));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const normalizePath = (path: string | undefined) => {
  if (!path) return "/";
  if (!path.startsWith("/")) return `/${path}`;
  return path;
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ ok: true, skipped: "missing_env" }, { status: 202 });
  }

  let payload: TrackPayload = {};
  try {
    payload = (await request.json()) as TrackPayload;
  } catch {
    payload = {};
  }

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "";
  const path = normalizePath(payload.path);
  const referrer =
    payload.referrer ||
    request.headers.get("referer") ||
    request.headers.get("referrer") ||
    null;

  const ipHash = ip ? await hashValue(ip) : null;

  const row = {
    path,
    referrer,
    user_agent: userAgent || null,
    ip_hash: ipHash,
    country: request.headers.get("cf-ipcountry") || null,
    region: request.headers.get("x-vercel-ip-country-region") || null,
    city: request.headers.get("x-vercel-ip-city") || null,
    screen: payload.screen || null,
    language: payload.language || null,
    timezone: payload.timezone || null,
    source: "web",
    created_at: new Date().toISOString(),
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/visits`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { ok: false, error: "supabase_insert_failed", details: text.slice(0, 300) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}


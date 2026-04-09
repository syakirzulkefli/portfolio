import { NextResponse } from "next/server";

export const runtime = "edge";

const allowedProviders = new Set(["github", "google"]);

const normalizeEnvValue = (value: string | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const unwrapped = trimmed.slice(1, -1).trim();
    return unwrapped || null;
  }
  return trimmed;
};

const firstEnvValue = (...keys: string[]) => {
  for (const key of keys) {
    const value = normalizeEnvValue(process.env[key]);
    if (value) return value;
  }
  return null;
};

const canReachSupabaseAuth = async (supabaseUrl: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") || "";
  const next = url.searchParams.get("next") || "/notes";

  if (!allowedProviders.has(provider)) {
    return NextResponse.redirect(new URL("/login?error=provider", url));
  }

  const supabaseUrl = firstEnvValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL"
  );
  if (!supabaseUrl) {
    return NextResponse.redirect(new URL("/login?error=config", url));
  }

  if (!(await canReachSupabaseAuth(supabaseUrl))) {
    const loginUrl = new URL("/login", url);
    loginUrl.searchParams.set("error", "provider_unavailable");
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  const redirectTo = `${url.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  const signInUrl = new URL(`${supabaseUrl}/auth/v1/authorize`);
  signInUrl.searchParams.set("provider", provider);
  signInUrl.searchParams.set("redirect_to", redirectTo);

  return NextResponse.redirect(signInUrl.toString());
}

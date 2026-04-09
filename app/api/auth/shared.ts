import { NextResponse } from "next/server";

export type SupabaseConfig = {
  supabaseUrl: string;
  anonKey: string;
};

export type AuthUser = {
  id: string;
  email: string | null;
};

export type ApprovalResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: "unauthenticated" | "approval_required" };

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

export const getSupabaseConfig = (): SupabaseConfig | null => {
  const supabaseUrl = firstEnvValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL"
  );
  const anonKey = firstEnvValue(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY"
  );
  if (!supabaseUrl || !anonKey) return null;
  return { supabaseUrl, anonKey };
};

const getAuthUser = async (
  config: SupabaseConfig,
  accessToken: string
): Promise<AuthUser | null> => {
  try {
    const response = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: config.anonKey,
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof (payload as { id?: unknown }).id !== "string"
    ) {
      return null;
    }
    const emailRaw = (payload as { email?: unknown }).email;
    return {
      id: (payload as { id: string }).id,
      email: typeof emailRaw === "string" ? emailRaw : null,
    };
  } catch {
    return null;
  }
};

const isApprovedUser = async (
  config: SupabaseConfig,
  accessToken: string,
  userId: string
) => {
  try {
    const query = new URLSearchParams({
      select: "user_id",
      user_id: `eq.${userId}`,
      limit: "1",
    });
    const response = await fetch(
      `${config.supabaseUrl}/rest/v1/admins?${query.toString()}`,
      {
        headers: {
          apikey: config.anonKey,
          authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    if (!response.ok) return false;
    const payload: unknown = await response.json();
    return Array.isArray(payload) && payload.length > 0;
  } catch {
    return false;
  }
};

export const ensureApprovedUser = async (
  config: SupabaseConfig,
  accessToken: string
): Promise<ApprovalResult> => {
  const user = await getAuthUser(config, accessToken);
  if (!user) return { ok: false, error: "unauthenticated" };

  const approved = await isApprovedUser(config, accessToken, user.id);
  if (!approved) return { ok: false, error: "approval_required" };

  return { ok: true, user };
};

const cookieOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
};

export const setSessionCookies = (
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) => {
  response.cookies.set("sb-access-token", accessToken, cookieOptions);
  response.cookies.set("sb-refresh-token", refreshToken, cookieOptions);
};

export const clearSessionCookies = (response: NextResponse) => {
  response.cookies.set("sb-access-token", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("sb-refresh-token", "", { ...cookieOptions, maxAge: 0 });
};

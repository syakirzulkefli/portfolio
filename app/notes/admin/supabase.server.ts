import "server-only";

import { cookies } from "next/headers";

export type SupabaseConfig = {
  supabaseUrl: string;
  anonKey: string;
};

export type AuthUser = {
  id: string;
  email?: string | null;
};

export type AdminSession =
  | { ok: true; config: SupabaseConfig; accessToken: string; user: AuthUser }
  | { ok: false; reason: "missing_config" | "unauthenticated" | "forbidden" };

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
    const userId =
      typeof payload === "object" &&
      payload !== null &&
      "id" in payload &&
      typeof (payload as { id?: unknown }).id === "string"
        ? (payload as { id: string }).id
        : null;
    if (!userId) return null;
    const email =
      typeof payload === "object" &&
      payload !== null &&
      "email" in payload &&
      (typeof (payload as { email?: unknown }).email === "string" ||
        (payload as { email?: unknown }).email === null)
        ? ((payload as { email?: string | null }).email ?? null)
        : null;
    return { id: userId, email };
  } catch {
    return null;
  }
};

const isAdmin = async (
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

export const getAdminSession = async (): Promise<AdminSession> => {
  const config = getSupabaseConfig();
  if (!config) return { ok: false, reason: "missing_config" };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  if (!accessToken) return { ok: false, reason: "unauthenticated" };

  const user = await getAuthUser(config, accessToken);
  if (!user) return { ok: false, reason: "unauthenticated" };

  const admin = await isAdmin(config, accessToken, user.id);
  if (!admin) return { ok: false, reason: "forbidden" };

  return { ok: true, config, accessToken, user };
};

type RestRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: URLSearchParams;
  body?: unknown;
};

export const supabaseAdminRestRequest = async <T>(
  session: { config: SupabaseConfig; accessToken: string },
  tablePath: string,
  options: RestRequestOptions = {}
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> => {
  const method = options.method ?? "GET";
  const query = options.query ? `?${options.query.toString()}` : "";
  try {
    const response = await fetch(
      `${session.config.supabaseUrl}/rest/v1/${tablePath}${query}`,
      {
        method,
        headers: {
          "content-type": "application/json",
          apikey: session.config.anonKey,
          authorization: `Bearer ${session.accessToken}`,
          prefer: "return=representation",
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        cache: "no-store",
      }
    );

    const text = await response.text();
    if (!response.ok) {
      return { ok: false, status: response.status, error: text.slice(0, 500) };
    }
    const data = text ? (JSON.parse(text) as T) : ([] as unknown as T);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : "request_failed",
    };
  }
};

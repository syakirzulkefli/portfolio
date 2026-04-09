import LoginClient from "./LoginClient";

type SearchParams = Record<string, string | string[] | undefined>;

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

const canReachSupabaseAuth = async () => {
  const supabaseUrl = firstEnvValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL"
  );
  if (!supabaseUrl) return false;

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

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const nextParam = typeof params.next === "string" ? params.next : "/notes";
  const next = nextParam.startsWith("/") ? nextParam : "/notes";
  const isAdminLogin = next.startsWith("/notes/admin");
  const error = typeof params.error === "string" ? params.error : null;
  const initialAuthAvailable = await canReachSupabaseAuth();

  return (
    <LoginClient
      next={next}
      isAdminLogin={isAdminLogin}
      initialError={error}
      initialAuthAvailable={initialAuthAvailable}
    />
  );
}

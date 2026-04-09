import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getNotesSnapshot } from "../../../notes/store";
import { getAdminSession } from "../../../notes/admin/supabase.server";

export const runtime = "edge";

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

const isAuthenticated = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  const supabaseUrl = firstEnvValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL"
  );
  const anonKey = firstEnvValue(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY"
  );
  if (!token || !supabaseUrl || !anonKey) return false;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
};

const normalizeForSearch = (input: string) =>
  input
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const snippetFor = (source: string, hitIndex: number) => {
  const start = Math.max(0, hitIndex - 60);
  const end = Math.min(source.length, start + 200);
  let snippet = source.slice(start, end).trim();
  if (start > 0) snippet = `…${snippet}`;
  if (end < source.length) snippet = `${snippet}…`;
  return snippet.replace(/\s+/g, " ");
};

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value ?? null;
  const adminSession = await getAdminSession();
  const isAdmin = adminSession.ok;
  const authed =
    adminSession.ok || adminSession.reason === "forbidden"
      ? true
      : await isAuthenticated();
  const snapshot = await getNotesSnapshot({
    accessToken: authed ? token : null,
  });
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const domainParam = searchParams.get("domain");
  const normalizedTerms = normalizeForSearch(q).split(" ").filter(Boolean);

  if (normalizedTerms.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const domain =
    domainParam === "software" ||
    domainParam === "trading" ||
    domainParam === "motivation"
      ? domainParam
      : null;

  const candidates = snapshot.notes
    .filter((note) => {
      if (!isAdmin && note.domain === "trading") return false;
      if (domain && note.domain !== domain) return false;
      return true;
    })
    .map((note) => note.id);

  const results: { id: string; snippets: string[]; matchesCount: number }[] = [];
  for (const id of candidates) {
    const src = snapshot.sourceById[id];
    if (!src) continue;
    const haystack = src.toLowerCase();
    if (normalizedTerms.every((term) => haystack.includes(term))) {
      const primaryTerm = normalizedTerms[0] ?? "";
      const snippets: string[] = [];
      if (primaryTerm) {
        let idx = haystack.indexOf(primaryTerm);
        let safety = 0;
        while (idx !== -1 && snippets.length < 5 && safety < 1000) {
          snippets.push(snippetFor(src, idx));
          idx = haystack.indexOf(primaryTerm, idx + primaryTerm.length);
          safety += 1;
        }
      }
      const matchesCount = snippets.length || 1;
      results.push({
        id,
        snippets: snippets.length > 0 ? snippets : [snippetFor(src, 0)],
        matchesCount,
      });
    }
  }

  return NextResponse.json({ results });
}

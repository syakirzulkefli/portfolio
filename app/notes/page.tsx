import type { Metadata } from "next";
import NotesClient from "./NotesClient";
import MdxContent from "./mdx/MdxContent";
import { getNotesSnapshot } from "./store";
import { cookies } from "next/headers";
import { getAdminSession } from "./admin/supabase.server";
import {
  firstSectionForDomain,
  isSectionInDomain,
  type SectionId,
} from "./data";
import { requiresNotesOwnerAccess } from "./access";

type SearchParams = Record<string, string | string[] | undefined>;

export const runtime = "edge";
export const metadata: Metadata = {
  title: "Syakir | Notes",
};

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

const noteRequiresOwnerAccess = (
  noteId: string,
  isAdmin: boolean,
  notes: Awaited<ReturnType<typeof getNotesSnapshot>>["notes"]
) => {
  if (isAdmin) return false;
  const note = notes.find((item) => item.id === noteId);
  return note ? requiresNotesOwnerAccess(note.domain) : false;
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

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value ?? null;

  const adminSession = await getAdminSession();
  const isAdmin = adminSession.ok;
  const canViewNotes = isAdmin;
  const authed =
    adminSession.ok || adminSession.reason === "forbidden"
      ? true
      : await isAuthenticated();

  const snapshot = await getNotesSnapshot({
    accessToken: canViewNotes ? token : null,
  });
  const notes = canViewNotes ? snapshot.notes : [];
  const nodes = canViewNotes ? snapshot.nodes : [];
  const requestedDomainParam =
    typeof resolvedSearchParams.domain === "string"
      ? resolvedSearchParams.domain
      : null;
  const requestedDomain =
    requestedDomainParam === "software" ||
    requestedDomainParam === "trading" ||
    requestedDomainParam === "motivation"
      ? requestedDomainParam
      : "software";
  const requestedSectionParam =
    typeof resolvedSearchParams.section === "string"
      ? resolvedSearchParams.section
      : null;
  const requestedId =
    typeof resolvedSearchParams.note === "string"
      ? resolvedSearchParams.note
      : null;
  const requestedNoteCandidate =
    requestedId ? notes.find((note) => note.id === requestedId) ?? null : null;
  const requestedNote =
    requestedNoteCandidate &&
    (!requestedDomainParam || requestedNoteCandidate.domain === requestedDomain)
      ? requestedNoteCandidate
      : null;
  const initialDomain =
    requestedNote?.domain ??
    requestedDomain;
  const requestedSection =
    requestedSectionParam &&
    isSectionInDomain(initialDomain, requestedSectionParam as SectionId)
      ? (requestedSectionParam as SectionId)
      : null;
  const initialSection =
    requestedNote?.section ??
    requestedSection ??
    notes.find((note) => note.domain === initialDomain)?.section ??
    nodes.find((node) => node.domain === initialDomain)?.section ??
    firstSectionForDomain(initialDomain);
  const keepSectionWithoutFallback =
    requestedNote === null && requestedSection !== null;
  const activeNoteId =
    requestedNote?.id ??
    notes.find(
      (note) =>
        note.domain === initialDomain && note.section === initialSection
    )?.id ??
    (keepSectionWithoutFallback
      ? null
      : notes.find((note) => note.domain === initialDomain)?.id ?? null);
  const locked = activeNoteId
    ? noteRequiresOwnerAccess(activeNoteId, isAdmin, notes)
    : false;
  const source = activeNoteId
    ? (locked || !canViewNotes ? "" : snapshot.sourceById[activeNoteId] ?? "")
    : "";
  const initialDataNotice =
    canViewNotes && snapshot.sourceType === "legacy-fallback"
      ? snapshot.fallbackReason === "missing_config"
        ? "Supabase is not configured. Notes stay locked until the env values are fixed."
        : snapshot.fallbackReason === "request_failed"
          ? "Supabase is unreachable. Notes stay locked until the Supabase project URL works again."
          : "Supabase returned no notes."
      : null;
  const initialAuthAvailable =
    snapshot.fallbackReason === null || snapshot.fallbackReason === "empty_database";

  return (
    <NotesClient
      initialNotes={notes}
      initialNodes={nodes}
      initialDomain={initialDomain}
      initialSection={initialSection}
      initialActiveNoteId={activeNoteId}
      initialIsAuthenticated={authed}
      initialIsAdmin={isAdmin}
      initialDataNotice={initialDataNotice}
      initialAuthAvailable={initialAuthAvailable}
    >
      {source ? <MdxContent source={source} suppressFirstHeading /> : null}
    </NotesClient>
  );
}

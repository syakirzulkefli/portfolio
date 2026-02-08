import { NextResponse } from "next/server";

import { noteSourceById } from "../../../notes/generated/notes.generated";
import { notesOutline } from "../../../notes/outline";

export const runtime = "edge";

const normalizeForSearch = (input: string) =>
  input
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const noteIdsByDomain = (() => {
  const software: string[] = [];
  const trading: string[] = [];
  for (const group of notesOutline) {
    for (const item of group.items) {
      if (item.domain === "trading") trading.push(item.id);
      else software.push(item.id);
    }
  }
  return { software, trading } as const;
})();

const snippetFor = (source: string, hitIndex: number) => {
  const start = Math.max(0, hitIndex - 60);
  const end = Math.min(source.length, start + 200);
  let snippet = source.slice(start, end).trim();
  if (start > 0) snippet = `…${snippet}`;
  if (end < source.length) snippet = `${snippet}…`;
  return snippet.replace(/\s+/g, " ");
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const domainParam = searchParams.get("domain");
  const normalizedTerms = normalizeForSearch(q).split(" ").filter(Boolean);

  if (normalizedTerms.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const domain =
    domainParam === "software" || domainParam === "trading"
      ? domainParam
      : null;

  const candidates = domain
    ? noteIdsByDomain[domain]
    : Object.keys(noteSourceById);

  const results: { id: string; snippets: string[]; matchesCount: number }[] = [];
  for (const id of candidates) {
    const src = noteSourceById[id as keyof typeof noteSourceById];
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

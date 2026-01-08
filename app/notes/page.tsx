import fs from "node:fs";
import path from "node:path";

import NotesClient from "./NotesClient";
import { getNotesIndex, markdownPathForNoteId } from "./catalog";
import MdxContent from "./mdx/MdxContent";
import { notesOutline } from "./outline";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const notes = getNotesIndex();
  const requestedId =
    typeof resolvedSearchParams.note === "string"
      ? resolvedSearchParams.note
      : null;
  const activeNoteId =
    (requestedId && notes.some((n) => n.id === requestedId) && requestedId) ||
    notes[0]?.id ||
    null;
  const markdownPath = activeNoteId ? markdownPathForNoteId(activeNoteId) : null;
  const source = markdownPath
    ? fs.readFileSync(path.join(process.cwd(), markdownPath), "utf8").trim()
    : "";

  return (
    <NotesClient
      initialNotes={notes}
      outline={notesOutline}
      initialActiveNoteId={activeNoteId}
    >
      {markdownPath ? <MdxContent source={source} /> : null}
    </NotesClient>
  );
}

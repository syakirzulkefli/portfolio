import "server-only";

import type { Note } from "./data";
import { notesOutline } from "./outline";
import { noteUpdatedAtById } from "./generated/notes.generated";

const updatedAtForId = (id: string) =>
  noteUpdatedAtById[id as keyof typeof noteUpdatedAtById] ??
  new Date().toISOString().slice(0, 10);

export const getNotesIndex = (): Note[] =>
  notesOutline.flatMap((group) =>
    group.items.map(
      (item) =>
        ({
          id: item.id,
          domain: item.domain,
          title: item.title,
          section: item.section,
          chapterId: item.chapterId,
          chapterTitle: item.chapterTitle,
          level: item.level,
          summary: item.summary,
          tags: item.tags,
          updatedAt: updatedAtForId(item.id),
          pinned: item.pinned,
        }) satisfies Note
    )
  );

export const markdownPathForNoteId = (noteId: string): string | null => {
  for (const group of notesOutline) {
    const match = group.items.find((it) => it.id === noteId);
    if (match) return match.markdownPath;
  }
  return null;
};

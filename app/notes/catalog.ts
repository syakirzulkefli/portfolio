import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { Note } from "./data";
import { notesOutline } from "./outline";

const updatedAtFor = (relativePath: string) => {
  try {
    const stat = fs.statSync(path.join(process.cwd(), relativePath));
    return new Date(stat.mtime).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

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
          updatedAt: updatedAtFor(item.markdownPath),
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

import "server-only";

import { noteSourceById, noteUpdatedAtById } from "./generated/notes.generated";
import { notesOutline } from "./outline";
import type { DomainId, Note, NoteNode } from "./data";

type LegacyFallbackSnapshot = {
  notes: Note[];
  nodes: NoteNode[];
  sourceById: Record<string, string>;
};

const domainRank: Record<DomainId, number> = {
  software: 0,
  trading: 1,
  motivation: 2,
};

const compareNodesForFallback = (a: NoteNode, b: NoteNode) => {
  const domainDiff = domainRank[a.domain] - domainRank[b.domain];
  if (domainDiff !== 0) return domainDiff;

  const sectionDiff = a.section.localeCompare(b.section);
  if (sectionDiff !== 0) return sectionDiff;

  const aParent = a.parentId ?? "";
  const bParent = b.parentId ?? "";
  const parentDiff = aParent.localeCompare(bParent);
  if (parentDiff !== 0) return parentDiff;

  const aOrder = Number.isFinite(a.sortOrder)
    ? (a.sortOrder as number)
    : Number.MAX_SAFE_INTEGER;
  const bOrder = Number.isFinite(b.sortOrder)
    ? (b.sortOrder as number)
    : Number.MAX_SAFE_INTEGER;
  if (aOrder !== bOrder) return aOrder - bOrder;

  if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;

  return a.title.localeCompare(b.title);
};

export const getLegacyFallbackSnapshot = (): LegacyFallbackSnapshot => {
  const today = new Date().toISOString().slice(0, 10);
  const nodes: NoteNode[] = [];
  const notes: Note[] = [];
  const sourceById: Record<string, string> = {};

  notesOutline.forEach((group, groupIndex) => {
    const folderNode: NoteNode = {
      id: group.id,
      kind: "folder",
      domain: group.domain,
      title: group.label,
      section: group.items[0]?.section ?? "other",
      parentId: null,
      chapterId: group.id,
      chapterTitle: group.label,
      level: "intro",
      summary: "",
      tags: [],
      updatedAt: today,
      pinned: false,
      sortOrder: groupIndex + 1,
      isPublished: true,
    };

    nodes.push(folderNode);

    group.items.forEach((item, itemIndex) => {
      const note: Note = {
        id: item.id,
        kind: "note",
        domain: item.domain,
        title: item.title,
        section: item.section,
        parentId: group.id,
        chapterId: item.chapterId || group.id,
        chapterTitle: item.chapterTitle || group.label,
        level: item.level,
        summary: item.summary,
        tags: item.tags,
        updatedAt:
          noteUpdatedAtById[item.id as keyof typeof noteUpdatedAtById] ?? today,
        pinned: item.pinned,
        sortOrder: itemIndex + 1,
        isPublished: item.isPublished ?? true,
      };

      notes.push(note);
      nodes.push(note);
      sourceById[item.id] =
        noteSourceById[item.id as keyof typeof noteSourceById] ?? "";
    });
  });

  nodes.sort(compareNodesForFallback);
  notes.sort(compareNodesForFallback);

  return { notes, nodes, sourceById };
};

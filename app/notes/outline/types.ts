import type { DomainId, Level, SectionId } from "../data";

export type NotesOutlineItem = {
  id: string;
  label: string;
  title: string;
  summary: string;
  domain: DomainId;
  section: SectionId;
  chapterId: string;
  chapterTitle: string;
  level: Level;
  tags: string[];
  markdownPath: string;
  pinned?: boolean;
};

export type NotesOutlineGroup = {
  id: string;
  label: string;
  domain: DomainId;
  items: NotesOutlineItem[];
};


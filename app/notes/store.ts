import {
  firstSectionForDomain,
  isSectionInDomain,
  type DomainId,
  type Level,
  type Note,
  type NoteKind,
  type NoteNode,
  type SectionId,
} from "./data";
import { getLegacyFallbackSnapshot } from "./legacy-fallback";

export type NotesSnapshot = {
  notes: Note[];
  nodes: NoteNode[];
  sourceById: Record<string, string>;
  sourceType: "database" | "legacy-fallback";
  fallbackReason: "missing_config" | "request_failed" | "empty_database" | null;
};

export type NotesSnapshotOptions = {
  accessToken?: string | null;
  includeDeleted?: boolean;
};

type SupabaseRuntimeConfig = {
  supabaseUrl: string;
  anonKey: string;
};

type DatabaseNoteRow = {
  id?: unknown;
  domain?: unknown;
  section?: unknown;
  parent_id?: unknown;
  kind?: unknown;
  chapter_id?: unknown;
  chapter_title?: unknown;
  title?: unknown;
  label?: unknown;
  summary?: unknown;
  level?: unknown;
  tags?: unknown;
  pinned?: unknown;
  updated_at?: unknown;
  content?: unknown;
  sort_order?: unknown;
  is_published?: unknown;
  deleted_at?: unknown;
};

type FetchedRows =
  | { shape: "tree"; rows: DatabaseNoteRow[] }
  | { shape: "legacy"; rows: DatabaseNoteRow[] };

const LEVELS = new Set<Level>(["intro", "beginner", "intermediate", "advanced"]);
const KINDS = new Set<NoteKind>(["folder", "note"]);
const SECTIONS = new Set<SectionId>([
  "java",
  "javascript",
  "typescript",
  "react",
  "node",
  "css",
  "tooling",
  "algorithms",
  "designPatterns",
  "nextjs",
  "docker",
  "git",
  "tradingFundamentals",
  "tradingTechnical",
  "pastWinner",
  "currentCounter",
  "fcpo",
  "mindset",
  "discipline",
  "habits",
  "focus",
  "growth",
  "other",
]);

const domainRank: Record<DomainId, number> = {
  software: 0,
  trading: 1,
  motivation: 2,
};

const toSortRank = (value: number | undefined) => {
  if (!Number.isFinite(value)) return Number.MAX_SAFE_INTEGER;
  const normalized = Math.trunc(value as number);
  return normalized > 0 ? normalized : Number.MAX_SAFE_INTEGER;
};

const toIsoDate = (value: string | number | Date) =>
  new Date(value).toISOString().slice(0, 10);

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

const getSupabaseRuntimeConfig = (): SupabaseRuntimeConfig | null => {
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

const asNonEmptyString = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const asBoolean = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const asInteger = (value: unknown, fallback = Number.MAX_SAFE_INTEGER) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = Math.trunc(value);
    return parsed > 0 ? parsed : fallback;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return fallback;
};

const asDomain = (value: unknown): DomainId => {
  if (value === "trading") return "trading";
  if (value === "motivation") return "motivation";
  return "software";
};

const asLevel = (value: unknown): Level =>
  typeof value === "string" && LEVELS.has(value as Level)
    ? (value as Level)
    : "intro";

const asKind = (value: unknown): NoteKind =>
  typeof value === "string" && KINDS.has(value as NoteKind)
    ? (value as NoteKind)
    : "note";

const asSection = (value: unknown): SectionId =>
  typeof value === "string" && SECTIONS.has(value as SectionId)
    ? (value as SectionId)
    : "other";

const asTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string");
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const asUpdatedAt = (value: unknown, fallback: string) => {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return toIsoDate(date);
};

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"`]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const legacyFolderId = (
  domain: DomainId,
  section: SectionId,
  chapterId: string
) => {
  const fragment = slugify(chapterId) || "group";
  return `legacy-folder-${domain}-${section}-${fragment}`.slice(0, 121);
};

const compareNodesForSnapshot = (a: NoteNode, b: NoteNode) => {
  const domainDiff = domainRank[a.domain] - domainRank[b.domain];
  if (domainDiff !== 0) return domainDiff;

  const sectionDiff = a.section.localeCompare(b.section);
  if (sectionDiff !== 0) return sectionDiff;

  const aParent = a.parentId ?? "";
  const bParent = b.parentId ?? "";
  const parentDiff = aParent.localeCompare(bParent);
  if (parentDiff !== 0) return parentDiff;

  const aOrder = toSortRank(a.sortOrder);
  const bOrder = toSortRank(b.sortOrder);
  if (aOrder !== bOrder) return aOrder - bOrder;

  if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;

  return a.title.localeCompare(b.title);
};

const fetchRows = async ({
  select,
  order,
  options,
  config,
}: {
  select: string[];
  order: string[];
  options: NotesSnapshotOptions;
  config: SupabaseRuntimeConfig;
}): Promise<DatabaseNoteRow[] | null> => {
  const { supabaseUrl, anonKey } = config;

  const accessToken =
    typeof options.accessToken === "string" && options.accessToken.trim()
      ? options.accessToken.trim()
      : null;
  const includeDeleted = options.includeDeleted === true;

  const query = new URLSearchParams();
  query.set("select", select.join(","));
  if (!includeDeleted) {
    query.set("deleted_at", "is.null");
  }
  for (const item of order) {
    query.append("order", item);
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/notes?${query.toString()}`, {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${accessToken ?? anonKey}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return null;
    return payload as DatabaseNoteRow[];
  } catch {
    return null;
  }
};

const fetchDatabaseRows = async (
  config: SupabaseRuntimeConfig,
  options: NotesSnapshotOptions = {}
): Promise<FetchedRows | null> => {
  const treeRows = await fetchRows({
    select: [
      "id",
      "domain",
      "section",
      "parent_id",
      "kind",
      "chapter_id",
      "chapter_title",
      "title",
      "label",
      "summary",
      "level",
      "tags",
      "pinned",
      "updated_at",
      "content",
      "sort_order",
      "is_published",
      "deleted_at",
    ],
    order: [
      "domain.asc",
      "section.asc",
      "parent_id.asc.nullsfirst",
      "sort_order.asc.nullslast",
      "title.asc",
    ],
    options,
    config,
  });

  if (treeRows) {
    return { shape: "tree", rows: treeRows };
  }

  const legacyRows = await fetchRows({
    select: [
      "id",
      "domain",
      "section",
      "chapter_id",
      "chapter_title",
      "title",
      "label",
      "summary",
      "level",
      "tags",
      "pinned",
      "updated_at",
      "content",
      "sort_order",
      "is_published",
      "deleted_at",
    ],
    order: [
      "domain.asc",
      "section.asc",
      "chapter_id.asc",
      "sort_order.asc.nullslast",
      "title.asc",
    ],
    options,
    config,
  });

  if (!legacyRows) return null;
  return { shape: "legacy", rows: legacyRows };
};

type NotesSnapshotData = Omit<NotesSnapshot, "sourceType" | "fallbackReason">;

const normalizePlaceholderSource = (source: string) =>
  source
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/^#{1,6}\s.*$/gm, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const isPlaceholderSource = (source: string) => {
  if (!source.trim()) return true;
  const normalized = normalizePlaceholderSource(source);
  if (!normalized) return true;
  return (
    normalized === "coming soon" ||
    normalized === "coming soon." ||
    normalized === "coming soon!" ||
    normalized === "notes coming soon" ||
    normalized === "notes coming soon."
  );
};

const prunePlaceholderNotes = (snapshot: NotesSnapshotData): NotesSnapshotData => {
  const visibleNoteIds = new Set<string>();
  for (const note of snapshot.notes) {
    const source = snapshot.sourceById[note.id] ?? "";
    if (!isPlaceholderSource(source)) {
      visibleNoteIds.add(note.id);
    }
  }

  if (visibleNoteIds.size === snapshot.notes.length) return snapshot;

  const nodeById = new Map(snapshot.nodes.map((node) => [node.id, node]));
  const keepNodeIds = new Set<string>(visibleNoteIds);

  for (const noteId of visibleNoteIds) {
    let cursorParentId = nodeById.get(noteId)?.parentId ?? null;
    let safety = 0;
    while (cursorParentId && safety < 100) {
      keepNodeIds.add(cursorParentId);
      cursorParentId = nodeById.get(cursorParentId)?.parentId ?? null;
      safety += 1;
    }
  }

  const notes = snapshot.notes.filter((note) => keepNodeIds.has(note.id));
  const nodes = snapshot.nodes.filter((node) => keepNodeIds.has(node.id));
  const sourceById: Record<string, string> = {};
  for (const note of notes) {
    sourceById[note.id] = snapshot.sourceById[note.id] ?? "";
  }

  return {
    notes,
    nodes,
    sourceById,
  };
};

const buildTreeSnapshot = (rows: DatabaseNoteRow[]): NotesSnapshotData => {
  const nodes: NoteNode[] = [];
  const notes: Note[] = [];
  const sourceById: Record<string, string> = {};
  const today = toIsoDate(new Date());

  for (const row of rows) {
    const id = asNonEmptyString(row.id);
    if (!id) continue;

    const domain = asDomain(row.domain);
    const parsedSection = asSection(row.section);
    const section = isSectionInDomain(domain, parsedSection)
      ? parsedSection
      : firstSectionForDomain(domain);
    const kind = asKind(row.kind);
    const title = asNonEmptyString(row.title, id);
    const summary = asNonEmptyString(row.summary);
    const level = asLevel(row.level);
    const tags = asTags(row.tags);
    const pinned = asBoolean(row.pinned);
    const sortOrder = asInteger(row.sort_order);
    const isPublished = asBoolean(row.is_published, true);
    const updatedAt = asUpdatedAt(row.updated_at, today);
    const parentId = asNonEmptyString(row.parent_id) || null;

    const node: NoteNode = {
      id,
      kind,
      domain,
      title,
      section,
      parentId,
      chapterId: parentId,
      level,
      summary,
      tags,
      updatedAt,
      pinned,
      sortOrder,
      isPublished,
    };

    nodes.push(node);

    if (kind === "note") {
      notes.push(node as Note);
      sourceById[id] = typeof row.content === "string" ? row.content : "";
    }
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  for (const note of notes) {
    note.chapterTitle = note.parentId ? nodeById.get(note.parentId)?.title ?? null : null;
  }

  nodes.sort(compareNodesForSnapshot);
  notes.sort(compareNodesForSnapshot);

  return {
    notes,
    nodes,
    sourceById,
  };
};

const buildLegacySnapshot = (rows: DatabaseNoteRow[]): NotesSnapshotData => {
  const folders = new Map<string, NoteNode>();
  const notes: Note[] = [];
  const sourceById: Record<string, string> = {};
  const today = toIsoDate(new Date());

  for (const row of rows) {
    const id = asNonEmptyString(row.id);
    if (!id) continue;

    const domain = asDomain(row.domain);
    const parsedSection = asSection(row.section);
    const section = isSectionInDomain(domain, parsedSection)
      ? parsedSection
      : firstSectionForDomain(domain);
    const title = asNonEmptyString(row.title, id);
    const summary = asNonEmptyString(row.summary);
    const level = asLevel(row.level);
    const tags = asTags(row.tags);
    const pinned = asBoolean(row.pinned);
    const sortOrder = asInteger(row.sort_order);
    const isPublished = asBoolean(row.is_published, true);
    const updatedAt = asUpdatedAt(row.updated_at, today);
    const legacyChapterId = asNonEmptyString(row.chapter_id);
    const legacyChapterTitle = asNonEmptyString(row.chapter_title);

    let parentId: string | null = null;

    if (legacyChapterId && legacyChapterTitle) {
      const folderId = legacyFolderId(domain, section, legacyChapterId);
      const existingFolder = folders.get(folderId);
      if (!existingFolder) {
        folders.set(folderId, {
          id: folderId,
          kind: "folder",
          domain,
          title: legacyChapterTitle,
          section,
          parentId: null,
          level: "intro",
          summary: "",
          tags: [],
          updatedAt,
          pinned: false,
          sortOrder,
          isPublished,
        });
      } else {
        existingFolder.sortOrder = Math.min(
          existingFolder.sortOrder ?? sortOrder,
          sortOrder
        );
        existingFolder.isPublished = existingFolder.isPublished || isPublished;
      }
      parentId = folderId;
    }

    notes.push({
      id,
      kind: "note",
      domain,
      title,
      section,
      parentId,
      chapterId: parentId,
      chapterTitle: parentId ? legacyChapterTitle || null : null,
      level,
      summary,
      tags,
      updatedAt,
      pinned,
      sortOrder,
      isPublished,
    });

    sourceById[id] = typeof row.content === "string" ? row.content : "";
  }

  const nodes = [...folders.values(), ...notes].sort(compareNodesForSnapshot);
  notes.sort(compareNodesForSnapshot);

  return {
    notes,
    nodes,
    sourceById,
  };
};

export const getNotesSnapshot = async (
  options: NotesSnapshotOptions = {}
): Promise<NotesSnapshot> => {
  const config = getSupabaseRuntimeConfig();
  if (!config) {
    const fallback = prunePlaceholderNotes(getLegacyFallbackSnapshot());
    return {
      ...fallback,
      sourceType: "legacy-fallback",
      fallbackReason: "missing_config",
    };
  }

  const result = await fetchDatabaseRows(config, options);
  if (!result) {
    const fallback = prunePlaceholderNotes(getLegacyFallbackSnapshot());
    return {
      ...fallback,
      sourceType: "legacy-fallback",
      fallbackReason: "request_failed",
    };
  }

  const snapshot = prunePlaceholderNotes(
    result.shape === "tree"
      ? buildTreeSnapshot(result.rows)
      : buildLegacySnapshot(result.rows)
  );

  if (snapshot.notes.length === 0 && snapshot.nodes.length === 0) {
    const fallback = prunePlaceholderNotes(getLegacyFallbackSnapshot());
    if (fallback.notes.length > 0) {
      return {
        ...fallback,
        sourceType: "legacy-fallback",
        fallbackReason: "empty_database",
      };
    }
  }

  return {
    ...snapshot,
    sourceType: "database",
    fallbackReason: null,
  };
};

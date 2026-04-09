import {
  isSectionInDomain,
  type DomainId,
  type Level,
  type NoteKind,
  type SectionId,
} from "../../../../notes/data";

export type AdminNoteRecord = {
  id: string;
  kind: NoteKind;
  domain: DomainId;
  section: SectionId;
  parent_id: string | null;
  title: string;
  label: string;
  summary: string;
  level: Level;
  tags: string[];
  pinned: boolean;
  sort_order: number;
  is_published: boolean;
  content: string;
  chapter_id?: string;
  chapter_title?: string;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
};

const sectionIds = new Set<SectionId>([
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

const levelIds = new Set<Level>([
  "intro",
  "beginner",
  "intermediate",
  "advanced",
]);

const kindIds = new Set<NoteKind>(["folder", "note"]);
const domainIds = new Set<DomainId>(["software", "trading", "motivation"]);

const asString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const asNullableString = (value: unknown) => {
  const text = asString(value);
  return text || null;
};

const asStringOr = (value: unknown, fallback: string) => {
  const text = asString(value);
  return text || fallback;
};

const asTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const asInteger = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

export const isValidNoteId = (value: string) =>
  /^[a-z0-9][a-z0-9_-]{1,120}$/.test(value);

export const normalizeCreatePayload = (
  payload: unknown
): { ok: true; value: AdminNoteRecord } | { ok: false; error: string } => {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "invalid_payload" };
  }

  const row = payload as Record<string, unknown>;

  const id = asString(row.id);
  if (!id || !isValidNoteId(id)) {
    return { ok: false, error: "invalid_id" };
  }

  const kind = asString(row.kind) as NoteKind;
  if (!kindIds.has(kind)) {
    return { ok: false, error: "invalid_kind" };
  }

  const domain = asString(row.domain) as DomainId;
  if (!domainIds.has(domain)) {
    return { ok: false, error: "invalid_domain" };
  }

  const section = asString(row.section) as SectionId;
  if (!sectionIds.has(section) || !isSectionInDomain(domain, section)) {
    return { ok: false, error: "invalid_section" };
  }

  const level = asString(row.level) as Level;
  if (!levelIds.has(level)) {
    return { ok: false, error: "invalid_level" };
  }

  const title = asString(row.title);
  if (!title) return { ok: false, error: "missing_title" };

  const label = asStringOr(row.label, title);
  const parentId = asNullableString(row.parent_id);
  const summary = asStringOr(row.summary, "");
  const tags = asTags(row.tags);
  const pinned = asBoolean(row.pinned, false);
  const sortOrder = asInteger(row.sort_order, 0);
  const isPublished = asBoolean(row.is_published, false);
  const content = kind === "folder" ? "" : asStringOr(row.content, "");

  return {
    ok: true,
    value: {
      id,
      kind,
      domain,
      section,
      parent_id: parentId,
      title,
      label,
      summary,
      level,
      tags,
      pinned,
      sort_order: sortOrder,
      is_published: isPublished,
      content,
      chapter_id: "",
      chapter_title: "",
    },
  };
};

export const normalizeUpdatePayload = (
  payload: unknown
): { ok: true; value: Omit<AdminNoteRecord, "id"> } | { ok: false; error: string } => {
  const normalized = normalizeCreatePayload({
    ...(typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {}),
    id: "temp_id",
  });

  if (!normalized.ok) {
    return { ok: false, error: normalized.error };
  }

  const value = Object.fromEntries(
    Object.entries(normalized.value).filter(([key]) => key !== "id")
  ) as Omit<AdminNoteRecord, "id">;
  return { ok: true, value };
};

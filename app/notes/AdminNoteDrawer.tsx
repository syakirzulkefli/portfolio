"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import MdxPreviewClient from "./mdx/MdxPreviewClient";
import {
  firstSectionForDomain,
  isSectionInDomain,
  sectionLabelForId,
  sectionOptionsForDomain,
  type DomainId,
  type Level,
  type NoteKind,
  type NoteNode,
  type SectionId,
} from "./data";

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
  updated_at?: string;
  created_at?: string;
};

type FormState = {
  id: string;
  title: string;
  label: string;
  kind: NoteKind;
  domain: DomainId;
  section: SectionId;
  parent_id: string | null;
  level: Level;
  summary: string;
  tagsInput: string;
  pinned: boolean;
  sort_order: number;
  is_published: boolean;
  content: string;
};

const emptyForm: FormState = {
  id: "",
  title: "",
  label: "",
  kind: "note",
  domain: "software",
  section: firstSectionForDomain("software"),
  parent_id: null,
  level: "intro",
  summary: "",
  tagsInput: "",
  pinned: false,
  sort_order: 0,
  is_published: false,
  content: "",
};

const noteToForm = (note: AdminNoteRecord): FormState => ({
  id: note.id,
  title: note.title,
  label: note.label,
  kind: note.kind,
  domain: note.domain,
  section: note.section,
  parent_id: note.parent_id ?? null,
  level: note.level,
  summary: note.summary,
  tagsInput: note.tags.join(", "),
  pinned: note.pinned,
  sort_order: note.sort_order,
  is_published: note.is_published,
  content: note.content,
});

const NOTE_ID_RE = /^[a-z0-9][a-z0-9_-]{1,120}$/;

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"`]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const stripMarkdown = (source: string) =>
  source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const deriveSummary = (source: string) => {
  const text = stripMarkdown(source);
  if (!text) return "";
  return text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text;
};

const normalizeNoteId = (explicit: string, title: string) => {
  const raw = explicit.trim() || slugify(title);
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const truncated = cleaned.slice(0, 121);
  return NOTE_ID_RE.test(truncated) ? truncated : "";
};

const resolveSectionForDomain = (domain: DomainId, section: SectionId) =>
  isSectionInDomain(domain, section) ? section : firstSectionForDomain(domain);

const toSortRank = (value: number | undefined) => {
  if (!Number.isFinite(value)) return Number.MAX_SAFE_INTEGER;
  const normalized = Math.trunc(value as number);
  return normalized > 0 ? normalized : Number.MAX_SAFE_INTEGER;
};

const buildEmptyForm = ({
  domain,
  section,
  parentId,
}: {
  domain: DomainId;
  section: SectionId;
  parentId: string | null;
}): FormState => ({
  ...emptyForm,
  domain,
  section: resolveSectionForDomain(domain, section),
  parent_id: parentId,
});

const collectDescendantIds = (nodes: NoteNode[], rootId: string) => {
  const childrenByParentId = new Map<string, string[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const children = childrenByParentId.get(node.parentId) ?? [];
    children.push(node.id);
    childrenByParentId.set(node.parentId, children);
  }

  const ids = new Set<string>([rootId]);
  const stack = [rootId];
  while (stack.length > 0) {
    const current = stack.pop() ?? "";
    const children = childrenByParentId.get(current) ?? [];
    for (const childId of children) {
      if (ids.has(childId)) continue;
      ids.add(childId);
      stack.push(childId);
    }
  }
  return ids;
};

const formToPayload = (form: FormState) => {
  const title = form.title.trim();
  const id = normalizeNoteId(form.id, title);
  const section = resolveSectionForDomain(form.domain, form.section);
  const content = form.kind === "folder" ? "" : form.content ?? "";
  const summary =
    form.kind === "folder" ? form.summary.trim() : form.summary.trim() || deriveSummary(content);

  return {
    id,
    title,
    label: title,
    kind: form.kind,
    domain: form.domain,
    section,
    parent_id: form.parent_id,
    chapter_id: "",
    chapter_title: "",
    level: form.level,
    summary,
    tags: form.tagsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    pinned: form.pinned,
    sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    is_published: form.is_published,
    content,
  };
};

const payloadKey = (payload: ReturnType<typeof formToPayload>) =>
  JSON.stringify(payload);

type DrawerMode = "new" | "edit";
type SaveTrigger = "manual" | "autosave";
type AutosaveState = "idle" | "saving" | "saved" | "failed";

const AUTOSAVE_DEBOUNCE_MS = 2000;
const AUTOSAVE_RETRY_MS = 4000;

export default function AdminNoteDrawer({
  open,
  mode,
  noteId,
  nodes,
  defaultDomain,
  defaultSection,
  defaultParentId,
  isDark,
  mdxVars,
  onClose,
  onSaved,
  onPersisted,
  onDeleted,
}: {
  open: boolean;
  mode: DrawerMode;
  noteId: string | null;
  nodes: NoteNode[];
  defaultDomain: DomainId;
  defaultSection: SectionId;
  defaultParentId: string | null;
  isDark: boolean;
  mdxVars: CSSProperties;
  onClose: () => void;
  onSaved: (note: AdminNoteRecord) => void;
  onPersisted?: (note: AdminNoteRecord) => void;
  onDeleted: (noteId: string) => void;
}) {
  const [form, setForm] = useState<FormState>(
    buildEmptyForm({
      domain: defaultDomain,
      section: defaultSection,
      parentId: defaultParentId,
    })
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [persistedMode, setPersistedMode] = useState<DrawerMode>(mode);
  const [persistedNoteId, setPersistedNoteId] = useState<string | null>(noteId);
  const [autosaveState, setAutosaveState] = useState<AutosaveState>("idle");
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [linkPickerOpen, setLinkPickerOpen] = useState(false);
  const [linkPickerLoading, setLinkPickerLoading] = useState(false);
  const [linkPickerQuery, setLinkPickerQuery] = useState("");
  const [linkPickerNotes, setLinkPickerNotes] = useState<
    Array<{
      id: string;
      domain: DomainId;
      section: SectionId;
      title: string;
      tags: string[];
      updated_at?: string | null;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<FormState>(
    buildEmptyForm({
      domain: defaultDomain,
      section: defaultSection,
      parentId: defaultParentId,
    })
  );
  const lastSavedPayloadKeyRef = useRef<string | null>(null);
  const persistedModeRef = useRef<DrawerMode>(mode);
  const persistedNoteIdRef = useRef<string | null>(noteId);
  const inFlightSaveRef = useRef(false);
  const queuedSaveRef = useRef(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const title =
    persistedMode === "new"
      ? form.kind === "folder"
        ? "New Folder"
        : "New Note"
      : form.kind === "folder"
        ? "Edit Folder"
        : "Edit Note";
  const canDelete = persistedMode === "edit" && !!persistedNoteId;
  const sectionOptions = useMemo(
    () => sectionOptionsForDomain(form.domain),
    [form.domain]
  );
  const parentOptions = useMemo(() => {
    const descendants =
      persistedMode === "edit" && persistedNoteId ? collectDescendantIds(nodes, persistedNoteId) : null;
    const scoped = nodes.filter(
      (node) =>
        node.kind === "folder" &&
        node.domain === form.domain &&
        node.section === form.section &&
        (!descendants || !descendants.has(node.id))
    );
    const nodeById = new Map(scoped.map((node) => [node.id, node]));
    const depthForNode = (nodeId: string) => {
      let depth = 0;
      let cursor = nodeById.get(nodeId) ?? null;
      let safety = 0;
      while (cursor?.parentId && safety < 50) {
        depth += 1;
        cursor = nodeById.get(cursor.parentId) ?? null;
        safety += 1;
      }
      return depth;
    };

    return scoped
      .sort((a, b) => {
        const aOrder = toSortRank(a.sortOrder);
        const bOrder = toSortRank(b.sortOrder);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.title.localeCompare(b.title);
      })
      .map((node) => ({
        value: node.id,
        label: `${"  ".repeat(depthForNode(node.id))}${node.title}`,
      }));
  }, [form.domain, form.section, nodes, persistedMode, persistedNoteId]);
  const canEditContent = form.kind === "note";
  const autosaveLabel =
    autosaveState === "saving"
      ? "Saving..."
      : autosaveState === "failed"
      ? "Failed (retry pending/manual save)"
      : null;

  const surface = isDark
    ? "border-slate-800/70 bg-slate-950/95 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const input = isDark
    ? "border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring focus:ring-sky-500/20"
    : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring focus:ring-sky-500/20";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const hover = isDark ? "hover:bg-slate-800" : "hover:bg-slate-100";
  const pill =
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition duration-150 ease-out gap-2";
  const focus =
    "focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-0";

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setDomainField = (domain: DomainId) => {
    setForm((prev) => ({
      ...prev,
      domain,
      section: resolveSectionForDomain(domain, prev.section),
      parent_id: null,
    }));
  };

  const clearAutosaveTimer = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
  };

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    persistedModeRef.current = persistedMode;
  }, [persistedMode]);

  useEffect(() => {
    persistedNoteIdRef.current = persistedNoteId;
  }, [persistedNoteId]);

  useEffect(() => {
    if (!isSectionInDomain(form.domain, form.section)) {
      setForm((prev) => ({
        ...prev,
        section: resolveSectionForDomain(prev.domain, prev.section),
        parent_id: null,
      }));
    }
  }, [form.domain, form.section]);

  useEffect(() => {
    if (!form.parent_id) return;
    const parent = nodes.find((node) => node.id === form.parent_id) ?? null;
    if (
      parent &&
      parent.kind === "folder" &&
      parent.domain === form.domain &&
      parent.section === form.section
    ) {
      return;
    }
    setForm((prev) => ({ ...prev, parent_id: null }));
  }, [form.domain, form.parent_id, form.section, nodes]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void requestClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, saving, deleting, uploading]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setMessage(null);
    setAutosaveState("idle");
    setPreviewMode("edit");
    setShowAdvanced(false);
    setLinkPickerOpen(false);
    setLinkPickerQuery("");
    setPersistedMode(mode);
    setPersistedNoteId(noteId);
    persistedModeRef.current = mode;
    persistedNoteIdRef.current = noteId;
    inFlightSaveRef.current = false;
    queuedSaveRef.current = false;
    clearAutosaveTimer();
    clearRetryTimer();
    lastSavedPayloadKeyRef.current = null;

    if (mode === "new") {
      const nextForm = buildEmptyForm({
        domain: defaultDomain,
        section: defaultSection,
        parentId: defaultParentId,
      });
      setLoading(false);
      setForm(nextForm);
      formRef.current = nextForm;
      persistedModeRef.current = "new";
      persistedNoteIdRef.current = null;
      return;
    }

    if (!noteId) return;

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const response = await fetch(
          `/api/notes/admin/notes/${encodeURIComponent(noteId)}`,
          { cache: "no-store" }
        );
        const payload = (await response.json()) as {
          ok?: boolean;
          note?: AdminNoteRecord | null;
          error?: string;
        };
        if (cancelled) return;
        if (!response.ok || !payload.ok || !payload.note) {
          setError(payload.error || "Failed to load note.");
          return;
        }
        const nextForm = noteToForm(payload.note);
        setForm(nextForm);
        formRef.current = nextForm;
        persistedModeRef.current = "edit";
        persistedNoteIdRef.current = payload.note.id;
        setPersistedMode("edit");
        setPersistedNoteId(payload.note.id);
        lastSavedPayloadKeyRef.current = payloadKey(formToPayload(nextForm));
      } catch {
        if (!cancelled) setError("Failed to load note.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      clearAutosaveTimer();
      clearRetryTimer();
    };
  }, [defaultDomain, defaultParentId, defaultSection, open, mode, noteId]);

  const insertAtCursor = (text: string) => {
    const textarea = contentRef.current;
    const content = form.content;
    if (!textarea) {
      setField("content", `${content}${text}`);
      return;
    }

    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;
    const nextContent = `${content.slice(0, start)}${text}${content.slice(end)}`;
    setField("content", nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/notes/admin/uploads", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        url?: string;
        error?: string;
        details?: string;
      };
      if (!response.ok || !payload.ok || !payload.url) {
        setError(payload.error || "Upload failed.");
        return;
      }
      const alt = file.name ? file.name.replace(/\.[^/.]+$/, "") : "image";
      insertAtCursor(`\n![${alt}](${payload.url})\n`);
      setMessage("Image uploaded.");
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    if (!linkPickerOpen) return;
    if (linkPickerNotes.length > 0) return;

    let cancelled = false;
    setLinkPickerLoading(true);

    void (async () => {
      try {
        const response = await fetch("/api/notes/admin/notes?view=links&kind=note", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          ok?: boolean;
          notes?: unknown;
          error?: string;
        };
        if (cancelled) return;
        if (!response.ok || !payload.ok || !Array.isArray(payload.notes)) {
          setError(payload.error || "Failed to load note links.");
          return;
        }
        setLinkPickerNotes(
          payload.notes.filter(
            (n): n is (typeof linkPickerNotes)[number] =>
              typeof n === "object" &&
              n !== null &&
              "id" in n &&
              typeof (n as { id?: unknown }).id === "string"
          )
        );
      } catch {
        if (!cancelled) setError("Failed to load note links.");
      } finally {
        if (!cancelled) setLinkPickerLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [linkPickerNotes.length, linkPickerOpen, open]);

  const filteredLinkNotes = useMemo(() => {
    const normalize = (input: string) =>
      input
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const terms = normalize(linkPickerQuery).split(" ").filter(Boolean);
    if (terms.length === 0) return linkPickerNotes;
    return linkPickerNotes.filter((note) => {
      const haystack = normalize(
        [note.id, note.title, note.tags.join(" ")].join(" ")
      );
      return terms.every((t) => haystack.includes(t));
    });
  }, [linkPickerNotes, linkPickerQuery]);

  const formValidError = useMemo(() => {
    const title = form.title.trim();
    if (!title) return "Title is required.";
    if (!isSectionInDomain(form.domain, form.section)) {
      return "Topic must match the selected domain.";
    }
    if (form.parent_id) {
      const parent = nodes.find((node) => node.id === form.parent_id) ?? null;
      if (!parent || parent.kind !== "folder") {
        return "Parent must be a folder.";
      }
      if (parent.domain !== form.domain || parent.section !== form.section) {
        return "Parent must stay inside the selected topic.";
      }
    }

    const id = normalizeNoteId(form.id, title);
    if (!id) {
      return persistedMode === "new"
        ? "Slug could not be generated. Add a longer title or set a custom slug."
        : "Invalid slug.";
    }
    return null;
  }, [form.domain, form.id, form.parent_id, form.section, form.title, nodes, persistedMode]);

  const hasAutosaveMinimumFields = (current: FormState) =>
    current.title.trim().length > 0 && isSectionInDomain(current.domain, current.section);

  const buildSavePayload = (current: FormState) => {
    const title = current.title.trim();
    if (!title) {
      return { ok: false as const, error: "Title is required." };
    }
    if (!isSectionInDomain(current.domain, current.section)) {
      return { ok: false as const, error: "Topic must match the selected domain." };
    }
    if (current.parent_id) {
      const parent = nodes.find((node) => node.id === current.parent_id) ?? null;
      if (!parent || parent.kind !== "folder") {
        return { ok: false as const, error: "Parent must be a folder." };
      }
      if (parent.domain !== current.domain || parent.section !== current.section) {
        return { ok: false as const, error: "Parent must stay inside the selected topic." };
      }
    }

    const payload = formToPayload(current);
    if (!payload.id) {
      return {
        ok: false as const,
        error:
          persistedModeRef.current === "new"
            ? "Slug could not be generated. Add a longer title or set a custom slug."
            : "Invalid slug.",
      };
    }

    return {
      ok: true as const,
      payload,
      key: payloadKey(payload),
    };
  };

  const persistChanges = async ({
    trigger,
    force = false,
    reportValidation = trigger === "manual",
  }: {
    trigger: SaveTrigger;
    force?: boolean;
    reportValidation?: boolean;
  }) => {
    if (loading || deleting || uploading) return false;

    const current = formRef.current;
    if (trigger === "autosave" && !hasAutosaveMinimumFields(current)) {
      if (autosaveState !== "failed") setAutosaveState("idle");
      return false;
    }

    const built = buildSavePayload(current);
    if (!built.ok) {
      if (reportValidation) setError(built.error);
      if (trigger === "autosave") setAutosaveState("idle");
      return false;
    }

    if (!force && built.key === lastSavedPayloadKeyRef.current) {
      if (trigger === "autosave") setAutosaveState("saved");
      return true;
    }

    if (inFlightSaveRef.current) {
      queuedSaveRef.current = true;
      return false;
    }

    inFlightSaveRef.current = true;
    clearRetryTimer();
    setAutosaveState("saving");
    if (trigger === "manual") {
      setSaving(true);
      setError(null);
      setMessage(null);
    }

    try {
      const payload = built.payload;
      const isCreate = persistedModeRef.current === "new" || !persistedNoteIdRef.current;
      const response = isCreate
        ? await fetch("/api/notes/admin/notes", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(
            `/api/notes/admin/notes/${encodeURIComponent(persistedNoteIdRef.current ?? "")}`,
            {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(
                Object.fromEntries(
                  Object.entries(payload).filter(([key]) => key !== "id")
                )
              ),
            }
          );

      const data = (await response.json()) as {
        ok?: boolean;
        note?: AdminNoteRecord | null;
        error?: string;
        details?: string;
      };

      if (!response.ok || !data.ok || !data.note) {
        setAutosaveState("failed");
        if (reportValidation) setError(data.error || "Save failed.");
        if (trigger === "autosave") {
          retryTimerRef.current = setTimeout(() => {
            void persistChanges({ trigger: "autosave", force: true, reportValidation: false });
          }, AUTOSAVE_RETRY_MS);
        }
        return false;
      }

      const savedId = data.note.id;
      const savedPayload = savedId === payload.id ? payload : { ...payload, id: savedId };
      lastSavedPayloadKeyRef.current = payloadKey(savedPayload);
      setAutosaveState("saved");

      if (isCreate || !persistedNoteIdRef.current) {
        persistedModeRef.current = "edit";
        persistedNoteIdRef.current = savedId;
        setPersistedMode("edit");
        setPersistedNoteId(savedId);
      }

      if (savedId && formRef.current.id !== savedId) {
        setForm((prev) => {
          const next = { ...prev, id: savedId };
          formRef.current = next;
          return next;
        });
      }

      onPersisted?.(data.note);

      if (trigger === "manual") {
        setMessage("Saved.");
        onSaved(data.note);
      }

      return true;
    } catch {
      setAutosaveState("failed");
      if (reportValidation) setError("Save failed.");
      if (trigger === "autosave") {
        retryTimerRef.current = setTimeout(() => {
          void persistChanges({ trigger: "autosave", force: true, reportValidation: false });
        }, AUTOSAVE_RETRY_MS);
      }
      return false;
    } finally {
      inFlightSaveRef.current = false;
      if (trigger === "manual") setSaving(false);
      if (queuedSaveRef.current) {
        queuedSaveRef.current = false;
        void persistChanges({ trigger: "autosave", reportValidation: false });
      }
    }
  };

  const flushAutosave = async () => {
    clearAutosaveTimer();
    clearRetryTimer();
    await persistChanges({ trigger: "autosave", force: true, reportValidation: false });
  };

  const requestClose = async () => {
    if (saving || deleting || uploading) return;
    await flushAutosave();
    let safety = 0;
    while (inFlightSaveRef.current && safety < 40) {
      // Wait briefly for in-flight save/queue to settle before closing.
      await new Promise((resolve) => setTimeout(resolve, 50));
      safety += 1;
    }
    onClose();
  };

  const handleSave = async () => {
    if (saving || deleting || uploading) return;
    if (formValidError) {
      setError(formValidError);
      return;
    }
    await persistChanges({ trigger: "manual", force: true, reportValidation: true });
  };

  useEffect(() => {
    if (!open || loading || deleting || uploading) return;

    clearAutosaveTimer();
    clearRetryTimer();

    const current = formRef.current;
    if (!hasAutosaveMinimumFields(current)) {
      if (autosaveState !== "failed") setAutosaveState("idle");
      return;
    }

    const built = buildSavePayload(current);
    if (!built.ok) {
      if (autosaveState !== "failed") setAutosaveState("idle");
      return;
    }

    if (built.key === lastSavedPayloadKeyRef.current) return;

    autosaveTimerRef.current = setTimeout(() => {
      void persistChanges({ trigger: "autosave", reportValidation: false });
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      clearAutosaveTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loading, deleting, uploading, form, autosaveState]);

  useEffect(() => {
    if (!open) return;
    const handleWindowBlur = () => {
      void flushAutosave();
    };
    window.addEventListener("blur", handleWindowBlur);
    return () => window.removeEventListener("blur", handleWindowBlur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    return () => {
      clearAutosaveTimer();
      clearRetryTimer();
      void persistChanges({ trigger: "autosave", force: true, reportValidation: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDelete = async () => {
    if (!canDelete) return;
    if (saving || deleting || uploading) return;
    if (inFlightSaveRef.current) return;

    if (!window.confirm(`Move note "${form.title || form.id}" to Trash?`)) return;

    clearAutosaveTimer();
    clearRetryTimer();
    setDeleting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/notes/admin/notes/${encodeURIComponent(persistedNoteId ?? "")}`,
        { method: "DELETE" }
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setError(data.error || "Delete failed.");
        return;
      }
      onDeleted(persistedNoteId ?? "");
    } catch {
      setError("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close editor"
        onClick={requestClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <div
        className={[
          "relative ml-auto flex h-full w-full max-w-[720px] flex-col border-l shadow-2xl",
          surface,
        ].join(" ")}
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            {autosaveLabel ? (
              <p className={`mt-1 text-xs ${muted}`}>Autosave: {autosaveLabel}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {canDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving || uploading}
                className={[
                  pill,
                  focus,
                  isDark
                    ? "border-red-500/40 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                    : "border-red-500/40 bg-red-50 text-red-700 hover:bg-red-100",
                ].join(" ")}
              >
                {deleting ? "Moving..." : "Move to Trash"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting || uploading || autosaveState === "saving"}
              className={[
                pill,
                focus,
                isDark
                  ? "border-sky-500/40 bg-sky-500/15 text-sky-100 hover:bg-sky-500/20"
                  : "border-sky-500/40 bg-sky-50 text-sky-700 hover:bg-sky-100",
              ].join(" ")}
            >
              {saving || autosaveState === "saving" ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={requestClose}
              disabled={saving || deleting || uploading}
              className={[
                pill,
                focus,
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              Close
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {error ? (
            <p className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {message}
            </p>
          ) : null}

          {loading ? (
            <p className={`rounded-xl border px-3 py-2 text-sm ${muted} ${surface}`}>
              Loading...
            </p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                    Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                    placeholder="Java: Introduction"
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                    Domain
                  </label>
                  <select
                    value={form.domain}
                    onChange={(e) => setDomainField(e.target.value as DomainId)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                  >
                    <option value="software">Software Programming</option>
                    <option value="trading">Stock Trading</option>
                    <option value="motivation">Motivation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                    Topic
                  </label>
                  <select
                    value={form.section}
                    onChange={(e) => setField("section", e.target.value as SectionId)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                  >
                    {sectionOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                    Item Type
                  </label>
                  <select
                    value={form.kind}
                    onChange={(e) => setField("kind", e.target.value as NoteKind)}
                    disabled={persistedMode === "edit"}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                  >
                    <option value="note">Note</option>
                    <option value="folder">Folder</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                    Parent Folder
                  </label>
                  <select
                    value={form.parent_id ?? ""}
                    onChange={(e) =>
                      setField("parent_id", e.target.value ? e.target.value : null)
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                  >
                    <option value="">Top level of this topic</option>
                    {parentOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                    Tags (comma-separated)
                  </label>
                  <input
                    value={form.tagsInput}
                    onChange={(e) => setField("tagsInput", e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                    placeholder="java, basics"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setField("is_published", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-400"
                    />
                    Published
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className={[
                      pill,
                      focus,
                      isDark
                        ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                      "h-9 px-3 py-1",
                    ].join(" ")}
                  >
                    {showAdvanced ? "Hide advanced" : "Advanced"}
                  </button>
                </div>

                {showAdvanced ? (
                  <div className="space-y-1 sm:col-span-2">
                    <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                      Slug (URL)
                    </label>
                    <input
                      value={form.id}
                      onChange={(e) => setField("id", e.target.value)}
                      disabled={persistedMode === "edit"}
                      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                      placeholder="leave blank to auto-generate"
                    />
                    <p className={`text-xs ${muted}`}>
                      Used in the URL as `?note=...`. Leave blank to generate from the title (conflicts auto-resolve with `-2`, `-3`, ...).
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
                    {canEditContent ? "Content (Markdown)" : "Folder"}
                  </label>
                  {canEditContent ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("edit")}
                        className={[
                          pill,
                          focus,
                          previewMode === "edit"
                            ? isDark
                              ? "border-sky-500/40 bg-sky-500/15 text-sky-100"
                              : "border-sky-500/40 bg-sky-50 text-sky-700"
                            : isDark
                              ? "border-slate-800 bg-slate-900 text-slate-200"
                              : "border-slate-200 bg-white text-slate-700",
                          "h-9 px-3 py-1",
                        ].join(" ")}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("preview")}
                        className={[
                          pill,
                          focus,
                          previewMode === "preview"
                            ? isDark
                              ? "border-sky-500/40 bg-sky-500/15 text-sky-100"
                              : "border-sky-500/40 bg-sky-50 text-sky-700"
                            : isDark
                              ? "border-slate-800 bg-slate-900 text-slate-200"
                              : "border-slate-200 bg-white text-slate-700",
                          "h-9 px-3 py-1",
                        ].join(" ")}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkPickerOpen((prev) => !prev)}
                        className={[
                          pill,
                          focus,
                          isDark
                            ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                          "h-9 px-3 py-1",
                        ].join(" ")}
                      >
                        {linkPickerOpen ? "Close links" : "Insert link"}
                      </button>
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className={[
                          pill,
                          focus,
                          isDark
                            ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                          "h-9 px-3 py-1",
                          hover,
                        ].join(" ")}
                      >
                        {uploading ? "Uploading..." : "Upload image"}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelected}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <p className={`text-xs ${muted}`}>
                      Folders only expand/collapse in the tree and do not store markdown.
                    </p>
                  )}
                </div>

                {canEditContent && linkPickerOpen ? (
                  <div
                    className={[
                      "rounded-2xl border p-3",
                      isDark
                        ? "border-slate-800 bg-slate-950/60"
                        : "border-slate-200 bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <input
                        value={linkPickerQuery}
                        onChange={(e) => setLinkPickerQuery(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
                        placeholder="Search notes to link..."
                      />
                    </div>
                    <div className="mt-2 max-h-56 overflow-y-auto">
                      {linkPickerLoading ? (
                        <p className={`px-2 py-2 text-sm ${muted}`}>Loading links...</p>
                      ) : filteredLinkNotes.length === 0 ? (
                        <p className={`px-2 py-2 text-sm ${muted}`}>No matching notes.</p>
                      ) : (
                        <div className="space-y-1">
                          {filteredLinkNotes.slice(0, 40).map((note) => (
                            <button
                              key={`${note.domain}:${note.id}`}
                              type="button"
                              onClick={() => {
                                const href = `/notes?domain=${note.domain}&note=${note.id}`;
                                insertAtCursor(`[${note.title}](${href})`);
                                setLinkPickerOpen(false);
                                setLinkPickerQuery("");
                              }}
                              className={[
                                "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                                isDark
                                  ? "border-slate-800 bg-slate-900/60 hover:bg-slate-900"
                                  : "border-slate-200 bg-white hover:bg-slate-100",
                              ].join(" ")}
                            >
                              <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-400">
                                <span>{note.domain}</span>
                                <span className={muted}>•</span>
                                <span>{sectionLabelForId(note.section)}</span>
                              </div>
                              <div className="mt-1 truncate font-semibold">{note.title}</div>
                              <div className={`mt-1 truncate text-xs ${muted}`}>
                                {note.id}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {!canEditContent ? (
                  <div
                    className={[
                      "rounded-2xl border px-4 py-4 text-sm",
                      isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50",
                    ].join(" ")}
                  >
                    This item is a folder. Save it to use it as a parent branch in the left tree.
                  </div>
                ) : previewMode === "edit" ? (
                  <textarea
                    ref={contentRef}
                    value={form.content}
                    onChange={(e) => setField("content", e.target.value)}
                    rows={18}
                    className={`w-full resize-y rounded-2xl border px-4 py-3 font-mono text-[13px] leading-[1.6] outline-none ${input}`}
                  />
                ) : (
                  <div
                    className={[
                      "rounded-2xl border p-4",
                      isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50",
                    ].join(" ")}
                    style={mdxVars}
                  >
                    <div className="prose prose-invert max-w-none">
                      <MdxPreviewClient source={form.content} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

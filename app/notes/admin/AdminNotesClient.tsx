"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

import AdminNoteDrawer, { type AdminNoteRecord } from "../AdminNoteDrawer";
import NoteContent from "../NoteContent";
import {
  domains,
  firstSectionForDomain,
  sectionLabelForId,
  type DomainId,
  type NoteNode,
  type SectionId,
} from "../data";

type AdminListRecord = AdminNoteRecord & {
  deleted_at?: string | null;
};

type DrawerDefaults = {
  domain: DomainId;
  section: SectionId;
  parentId: string | null;
};

const domainLabel = (domain: DomainId) =>
  domains.find((item) => item.id === domain)?.label ?? domain;

const toSortRank = (value: number | undefined) => {
  if (!Number.isFinite(value)) return Number.MAX_SAFE_INTEGER;
  const normalized = Math.trunc(value as number);
  return normalized > 0 ? normalized : Number.MAX_SAFE_INTEGER;
};

const toNode = (item: AdminListRecord): NoteNode => ({
  id: item.id,
  kind: item.kind,
  domain: item.domain,
  title: item.title,
  section: item.section,
  parentId: item.parent_id ?? null,
  chapterId: item.parent_id ?? null,
  chapterTitle: null,
  level: item.level,
  summary: item.summary,
  tags: Array.isArray(item.tags) ? item.tags : [],
  updatedAt: item.updated_at ?? new Date().toISOString(),
  pinned: item.pinned,
  sortOrder: item.sort_order,
  isPublished: item.is_published,
});

const buildPathTitles = (
  nodeId: string,
  nodeById: Map<string, NoteNode>
) => {
  const titles: string[] = [];
  let cursor = nodeById.get(nodeId) ?? null;
  let safety = 0;
  while (cursor?.parentId && safety < 100) {
    const parent = nodeById.get(cursor.parentId) ?? null;
    if (!parent) break;
    titles.unshift(parent.title);
    cursor = parent;
    safety += 1;
  }
  return titles;
};

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

const formatUpdatedAt = (value?: string) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const mdxVars = {
  "--note-heading-text": "rgb(248, 250, 252)",
  "--note-inline-code-bg": "rgba(2, 6, 23, 0.6)",
  "--note-inline-code-border": "rgba(30, 41, 59, 0.8)",
  "--note-inline-code-text": "rgb(241, 245, 249)",
  "--note-code-bg": "rgba(2, 6, 23, 0.6)",
  "--note-code-border": "rgba(30, 41, 59, 1)",
  "--note-code-text": "rgb(241, 245, 249)",
  "--note-syntax-comment": "rgb(148, 163, 184)",
  "--note-syntax-string": "rgb(134, 239, 172)",
  "--note-syntax-keyword": "rgb(125, 211, 252)",
  "--note-syntax-number": "rgb(240, 171, 252)",
  "--note-syntax-type": "rgb(253, 230, 138)",
  "--note-syntax-function": "rgb(56, 189, 248)",
  "--note-blockquote-border": "rgba(56, 189, 248, 0.5)",
  "--note-blockquote-text": "rgb(226, 232, 240)",
  "--note-img-border": "rgba(30, 41, 59, 0.7)",
  "--note-hr": "rgba(30, 41, 59, 0.7)",
} as CSSProperties;

export default function AdminNotesClient({
  adminEmail,
  adminUserId,
}: {
  adminEmail: string;
  adminUserId: string;
}) {
  const [rows, setRows] = useState<AdminListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<DomainId | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"new" | "edit">("edit");
  const [drawerNoteId, setDrawerNoteId] = useState<string | null>(null);
  const [drawerSessionKey, setDrawerSessionKey] = useState(0);
  const [drawerDefaults, setDrawerDefaults] = useState<DrawerDefaults>({
    domain: "software",
    section: firstSectionForDomain("software"),
    parentId: null,
  });

  const loadNotes = async (nextSelectedId?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notes/admin/notes?deleted=all", {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        notes?: AdminListRecord[];
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        setError(payload.error || "Failed to load notes.");
        return;
      }

      const nextRows = Array.isArray(payload.notes) ? payload.notes : [];
      setRows(nextRows);

      const preferredId = nextSelectedId ?? selectedId;
      if (preferredId && nextRows.some((row) => row.id === preferredId && !row.deleted_at)) {
        setSelectedId(preferredId);
        return;
      }

      const firstActive = nextRows.find((row) => !row.deleted_at) ?? null;
      setSelectedId(firstActive?.id ?? null);
    } catch {
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeRows = useMemo(
    () => rows.filter((row) => !row.deleted_at),
    [rows]
  );
  const deletedCount = rows.length - activeRows.length;

  const activeNodes = useMemo(
    () => activeRows.map(toNode),
    [activeRows]
  );
  const nodeById = useMemo(
    () => new Map(activeNodes.map((node) => [node.id, node])),
    [activeNodes]
  );

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...activeRows]
      .filter((row) => {
        if (domainFilter !== "all" && row.domain !== domainFilter) return false;
        if (!normalized) return true;

        const parents = buildPathTitles(row.id, nodeById).join(" ");
        const haystack = [
          row.id,
          row.title,
          row.summary,
          row.kind,
          row.domain,
          row.section,
          parents,
          row.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalized);
      })
      .sort((a, b) => {
        const domainDiff = a.domain.localeCompare(b.domain);
        if (domainDiff !== 0) return domainDiff;

        const sectionDiff = a.section.localeCompare(b.section);
        if (sectionDiff !== 0) return sectionDiff;

        const aPath = buildPathTitles(a.id, nodeById).join("/");
        const bPath = buildPathTitles(b.id, nodeById).join("/");
        const pathDiff = aPath.localeCompare(bPath);
        if (pathDiff !== 0) return pathDiff;

        const aOrder = toSortRank(a.sort_order);
        const bOrder = toSortRank(b.sort_order);
        if (aOrder !== bOrder) return aOrder - bOrder;

        if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
        return a.title.localeCompare(b.title);
      });
  }, [activeRows, domainFilter, nodeById, query]);

  useEffect(() => {
    const pool = filteredRows.length > 0 ? filteredRows : activeRows;
    if (selectedId && pool.some((row) => row.id === selectedId)) return;
    setSelectedId(pool[0]?.id ?? null);
  }, [activeRows, filteredRows, selectedId]);

  const selected = activeRows.find((row) => row.id === selectedId) ?? null;
  const selectedPath = selected ? buildPathTitles(selected.id, nodeById) : [];
  const selectedChildren = selected
    ? activeRows.filter((row) => row.parent_id === selected.id)
    : [];

  const publishedCount = activeRows.filter((row) => row.is_published).length;
  const folderCount = activeRows.filter((row) => row.kind === "folder").length;
  const noteCount = activeRows.length - folderCount;

  const openNew = () => {
    const fallbackDomain = selected?.domain ?? "software";
    const fallbackSection =
      selected?.section ?? firstSectionForDomain(fallbackDomain);
    const fallbackParentId = selected
      ? selected.kind === "folder"
        ? selected.id
        : selected.parent_id ?? null
      : null;

    setMessage(null);
    setError(null);
    setDrawerDefaults({
      domain: fallbackDomain,
      section: fallbackSection,
      parentId: fallbackParentId,
    });
    setDrawerMode("new");
    setDrawerNoteId(null);
    setDrawerSessionKey((prev) => prev + 1);
    setDrawerOpen(true);
  };

  const openEdit = (noteId: string) => {
    const row = activeRows.find((item) => item.id === noteId) ?? null;
    if (!row) return;

    setMessage(null);
    setError(null);
    setSelectedId(noteId);
    setDrawerDefaults({
      domain: row.domain,
      section: row.section,
      parentId: row.kind === "folder" ? row.id : row.parent_id ?? null,
    });
    setDrawerMode("edit");
    setDrawerNoteId(noteId);
    setDrawerSessionKey((prev) => prev + 1);
    setDrawerOpen(true);
  };

  const upsertRow = (note: AdminNoteRecord) => {
    setRows((prev) => {
      const next = [...prev];
      const normalized: AdminListRecord = { ...note, deleted_at: null };
      const index = next.findIndex((row) => row.id === normalized.id);
      if (index >= 0) {
        next[index] = { ...next[index], ...normalized };
      } else {
        next.push(normalized);
      }
      return next;
    });
    setSelectedId(note.id);
  };

  const handleSaved = (note: AdminNoteRecord) => {
    upsertRow(note);
    setMessage(note.kind === "folder" ? "Folder saved." : "Note saved.");
    setError(null);
    setDrawerOpen(false);
  };

  const handlePersisted = (note: AdminNoteRecord) => {
    upsertRow(note);
    setError(null);
  };

  const handleDeleted = (noteId: string) => {
    const ids = collectDescendantIds(activeNodes, noteId);
    setRows((prev) => prev.filter((row) => !ids.has(row.id)));
    setSelectedId((prev) => (prev && ids.has(prev) ? null : prev));
    setMessage("Moved to Trash.");
    setError(null);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold">Notes Admin</h1>
            <p className="mt-1 text-xs text-white/60">
              Signed in as {adminEmail} ({adminUserId})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/notes"
              className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] hover:bg-white/10"
            >
              View Notes
            </Link>
            <button
              type="button"
              onClick={openNew}
              className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 hover:bg-sky-400"
            >
              New
            </button>
            <button
              type="button"
              onClick={() => void loadNotes(selectedId)}
              className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] hover:bg-white/10"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-6 py-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="rounded-lg border border-white/10 bg-black/40 p-2">
              <div className="text-white">{activeRows.length}</div>
              <div className="text-white/60">Active</div>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-2">
              <div className="text-emerald-200">{publishedCount}</div>
              <div className="text-emerald-200/70">Published</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/40 p-2">
              <div className="text-white">{folderCount}</div>
              <div className="text-white/60">Folders</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/40 p-2">
              <div className="text-white">{noteCount}</div>
              <div className="text-white/60">Notes</div>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search folders and notes..."
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-500 focus:outline-none"
            />
            <select
              value={domainFilter}
              onChange={(event) =>
                setDomainFilter(event.target.value as DomainId | "all")
              }
              className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.label}
                </option>
              ))}
            </select>
          </div>

          {deletedCount > 0 ? (
            <p className="mb-3 rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              {deletedCount} item{deletedCount === 1 ? "" : "s"} currently in trash.
              Use the main notes page to restore or hard-delete them.
            </p>
          ) : null}

          <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <p className="text-sm text-white/60">Loading notes...</p>
            ) : filteredRows.length === 0 ? (
              <p className="text-sm text-white/60">No active items found.</p>
            ) : (
              filteredRows.map((row) => {
                const parents = buildPathTitles(row.id, nodeById);
                const active = row.id === selectedId;

                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className={[
                      "w-full rounded-lg border px-3 py-2 text-left transition",
                      active
                        ? "border-sky-400/60 bg-sky-500/15"
                        : "border-white/10 bg-black/40 hover:border-white/30",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{row.title}</span>
                      <span
                        className={[
                          "rounded px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em]",
                          row.kind === "folder"
                            ? "bg-slate-700/60 text-slate-100"
                            : row.is_published
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-amber-500/20 text-amber-200",
                        ].join(" ")}
                      >
                        {row.kind === "folder"
                          ? "Folder"
                          : row.is_published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-white/50">
                      {domainLabel(row.domain)} • {sectionLabelForId(row.section)}
                    </div>
                    {parents.length > 0 ? (
                      <div className="mt-1 truncate text-xs text-white/35">
                        {parents.join(" / ")}
                      </div>
                    ) : null}
                    <div className="mt-1 text-[11px] text-white/35">{row.id}</div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {selected ? selected.title : "No active selection"}
              </h2>
              {selected ? (
                <p className="mt-1 text-sm text-white/55">
                  {domainLabel(selected.domain)} / {sectionLabelForId(selected.section)}
                  {selectedPath.length > 0 ? ` / ${selectedPath.join(" / ")}` : ""}
                </p>
              ) : (
                <p className="mt-1 text-sm text-white/55">
                  Create a folder or note to start building the tree.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openNew}
                className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] hover:bg-white/10"
              >
                New Here
              </button>
              <button
                type="button"
                onClick={() => selected && openEdit(selected.id)}
                disabled={!selected}
                className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] hover:bg-white/10 disabled:opacity-50"
              >
                Edit
              </button>
            </div>
          </div>

          {error ? (
            <p className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {message}
            </p>
          ) : null}

          {selected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-white/45">
                    Type
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {selected.kind === "folder" ? "Folder" : "Note"}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-white/45">
                    Parent
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {selectedPath.at(-1) ?? "Root"}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-white/45">
                    Children
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {selectedChildren.length}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-white/45">
                    Updated
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {formatUpdatedAt(selected.updated_at)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/45">
                  <span>{selected.id}</span>
                  <span>•</span>
                  <span>{selected.level}</span>
                  {selected.tags.length > 0 ? (
                    <>
                      <span>•</span>
                      <span>{selected.tags.join(", ")}</span>
                    </>
                  ) : null}
                </div>

                {selected.summary ? (
                  <p className="mb-4 text-sm leading-7 text-white/70">
                    {selected.summary}
                  </p>
                ) : null}

                {selected.kind === "folder" ? (
                  <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm text-white/60">
                    Folder nodes do not contain note content. Expand this branch from the
                    main notes UI or create a child item under this folder.
                  </div>
                ) : selected.content.trim() ? (
                  <div
                    className="rounded-xl border border-white/10 bg-slate-950/70 p-5"
                    style={mdxVars}
                  >
                    <NoteContent source={selected.content} />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm text-white/60">
                    This note has no content yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-5 py-8 text-sm text-white/60">
              No active folder or note is available for this filter.
            </div>
          )}
        </section>
      </main>

      <AdminNoteDrawer
        key={drawerSessionKey}
        open={drawerOpen}
        mode={drawerMode}
        noteId={drawerNoteId}
        nodes={activeNodes}
        defaultDomain={drawerDefaults.domain}
        defaultSection={drawerDefaults.section}
        defaultParentId={drawerDefaults.parentId}
        isDark
        mdxVars={mdxVars}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
        onPersisted={handlePersisted}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

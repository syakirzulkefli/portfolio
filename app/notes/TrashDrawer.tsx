"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { sectionLabelForId, type DomainId, type NoteKind, type SectionId } from "./data";
import type { AdminNoteRecord } from "./AdminNoteDrawer";

type TrashNote = {
  id: string;
  kind: NoteKind;
  domain: DomainId;
  section: SectionId;
  title: string;
  tags: string[];
  deleted_at?: string | null;
  updated_at?: string | null;
};

const normalizeForSearch = (input: string) =>
  input
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function TrashDrawer({
  open,
  isDark,
  onClose,
  onRestored,
  onHardDeleted,
}: {
  open: boolean;
  isDark: boolean;
  onClose: () => void;
  onRestored: (note: AdminNoteRecord) => void;
  onHardDeleted: (noteId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<TrashNote[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const surface = isDark
    ? "border-slate-800/70 bg-slate-950/95 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const input = isDark
    ? "border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring focus:ring-sky-500/20"
    : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring focus:ring-sky-500/20";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const pill =
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition duration-150 ease-out gap-2";
  const focus =
    "focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-0";
  const destructiveButton = isDark
    ? "border-red-500/40 bg-red-500/10 text-red-100 hover:bg-red-500/20"
    : "border-red-500/40 bg-red-50 text-red-700 hover:bg-red-100";
  const disabled = loading || !!busyId || bulkDeleting;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        "/api/notes/admin/notes?deleted=true&view=links",
        { cache: "no-store" }
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        notes?: TrashNote[];
        error?: string;
      };
      if (!response.ok || !payload.ok || !Array.isArray(payload.notes)) {
        setError(payload.error || "Failed to load trash.");
        setNotes([]);
        setSelectedIds(new Set());
        return;
      }
      setNotes(payload.notes);
    } catch {
      setError("Failed to load trash.");
      setNotes([]);
      setSelectedIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    void load();
  }, [open, load]);

  const filtered = useMemo(() => {
    const terms = normalizeForSearch(query).split(" ").filter(Boolean);
    if (!terms.length) return notes;
    return notes.filter((note) => {
      const haystack = normalizeForSearch(
        [note.id, note.title, note.section, note.kind, note.tags.join(" ")].join(" ")
      );
      return terms.every((t) => haystack.includes(t));
    });
  }, [notes, query]);

  const filteredIds = useMemo(() => filtered.map((note) => note.id), [filtered]);
  const selectedCount = selectedIds.size;
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  useEffect(() => {
    setSelectedIds((prev) => {
      const availableIds = new Set(notes.map((note) => note.id));
      const next = new Set([...prev].filter((id) => availableIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [notes]);

  const toggleSelected = (noteId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  };

  const toggleFilteredSelection = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleRestore = async (noteId: string) => {
    if (disabled) return;
    setBusyId(noteId);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/notes/admin/notes/${encodeURIComponent(noteId)}/restore`,
        { method: "POST" }
      );
      const payload = (await response.json()) as {
        ok?: boolean;
        note?: AdminNoteRecord | null;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.note) {
        setError(payload.error || "Restore failed.");
        return;
      }
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      onRestored(payload.note);
      setMessage("Restored.");
    } catch {
      setError("Restore failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleHardDelete = async (noteId: string) => {
    if (disabled) return;
    const note = notes.find((n) => n.id === noteId);
    const label = note?.title || noteId;
    if (!window.confirm(`Delete "${label}" forever? This cannot be undone.`)) return;

    setBusyId(noteId);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/notes/admin/notes/${encodeURIComponent(noteId)}?hard=true`,
        { method: "DELETE" }
      );
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error || "Delete failed.");
        return;
      }
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
      onHardDeleted(noteId);
      setMessage("Deleted forever.");
    } catch {
      setError("Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleBulkHardDelete = async (mode: "selected" | "all") => {
    if (disabled) return;

    const ids = mode === "selected" ? [...selectedIds] : notes.map((note) => note.id);
    if (ids.length === 0) return;

    const label =
      mode === "all"
        ? `all ${ids.length} notes in Trash`
        : `${ids.length} selected note${ids.length === 1 ? "" : "s"}`;
    if (!window.confirm(`Delete ${label} forever? This cannot be undone.`)) return;

    setBulkDeleting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/notes/admin/notes/bulk-delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mode === "all" ? { all: true } : { ids }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        deletedIds?: string[];
        error?: string;
      };
      if (!response.ok || !payload.ok || !Array.isArray(payload.deletedIds)) {
        setError(payload.error || "Delete failed.");
        return;
      }

      const deletedIds = new Set(payload.deletedIds);
      setNotes((prev) => prev.filter((note) => !deletedIds.has(note.id)));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        deletedIds.forEach((id) => next.delete(id));
        return next;
      });
      payload.deletedIds.forEach(onHardDeleted);
      setMessage(
        `Deleted ${payload.deletedIds.length} note${
          payload.deletedIds.length === 1 ? "" : "s"
        } forever.`
      );
    } catch {
      setError("Delete failed.");
    } finally {
      setBulkDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close trash"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <div
        className={[
          "relative ml-auto flex h-full w-full max-w-[560px] flex-col border-l shadow-2xl",
          surface,
        ].join(" ")}
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Trash</h2>
            <p className={`mt-1 text-xs ${muted}`}>
              Restore notes or delete them forever.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={disabled}
              className={[
                pill,
                focus,
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={disabled}
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

          <div className="mb-4 space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>
              Search
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${input}`}
              placeholder="Search deleted notes..."
            />
          </div>

          {notes.length > 0 ? (
            <div
              className={[
                "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-3",
                isDark
                  ? "border-slate-800 bg-slate-950/60"
                  : "border-slate-200 bg-slate-50",
              ].join(" ")}
            >
              <label className="flex min-w-0 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleFilteredSelection}
                  disabled={disabled || filteredIds.length === 0}
                  className="h-4 w-4 rounded border-slate-500 accent-sky-500"
                />
                <span className={muted}>
                  {selectedCount > 0
                    ? `${selectedCount} selected`
                    : `Select visible${filteredIds.length ? ` (${filteredIds.length})` : ""}`}
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleBulkHardDelete("selected")}
                  disabled={disabled || selectedCount === 0}
                  className={[pill, focus, destructiveButton].join(" ")}
                >
                  {bulkDeleting && selectedCount > 0 ? "Deleting..." : "Delete selected"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleBulkHardDelete("all")}
                  disabled={disabled || notes.length === 0}
                  className={[pill, focus, destructiveButton].join(" ")}
                >
                  {bulkDeleting ? "Deleting..." : "Delete all"}
                </button>
              </div>
            </div>
          ) : null}

          {loading ? (
            <p className={`rounded-xl border px-3 py-2 text-sm ${muted} ${surface}`}>
              Loading...
            </p>
          ) : filtered.length === 0 ? (
            <p className={`rounded-xl border px-3 py-3 text-sm ${muted} ${surface}`}>
              Trash is empty.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((note) => (
                <div
                  key={note.id}
                  className={[
                    "rounded-2xl border px-3 py-3",
                    isDark
                      ? "border-slate-800 bg-slate-950/60"
                      : "border-slate-200 bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${note.title || note.id}`}
                        checked={selectedIds.has(note.id)}
                        onChange={() => toggleSelected(note.id)}
                        disabled={disabled}
                        className="mt-1 h-4 w-4 rounded border-slate-500 accent-sky-500"
                      />
                      <div className="min-w-0">
                        <div className={`text-xs uppercase tracking-[0.14em] ${muted}`}>
                          {note.domain} • {sectionLabelForId(note.section)} • {note.kind}
                        </div>
                        <div className="mt-1 truncate text-sm font-semibold">
                          {note.title || note.id}
                        </div>
                        <div className={`mt-1 text-xs ${muted}`}>
                          {note.deleted_at ? `Deleted ${new Date(note.deleted_at).toLocaleString()}` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRestore(note.id)}
                        disabled={disabled}
                        className={[
                          pill,
                          focus,
                          isDark
                            ? "border-sky-500/40 bg-sky-500/15 text-sky-100 hover:bg-sky-500/20"
                            : "border-sky-500/40 bg-sky-50 text-sky-700 hover:bg-sky-100",
                        ].join(" ")}
                      >
                        {busyId === note.id ? "Working..." : "Restore"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHardDelete(note.id)}
                        disabled={disabled}
                        className={[
                          pill,
                          focus,
                          destructiveButton,
                        ].join(" ")}
                      >
                        {busyId === note.id ? "Working..." : "Delete forever"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

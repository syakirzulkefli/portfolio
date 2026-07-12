import { NextResponse } from "next/server";

import {
  getAdminSession,
  supabaseAdminRestRequest,
} from "../../../../../notes/admin/supabase.server";
import { type AdminNoteRecord, isValidNoteId } from "../note-shared";
import { fetchNoteIndex } from "../tree-shared";

export const runtime = "edge";

type BulkDeletePayload = {
  all?: boolean;
  ids?: unknown;
};

type TrashIndexRow = {
  id: string;
  kind: AdminNoteRecord["kind"];
  parent_id: string | null;
  deleted_at?: string | null;
};

const buildErrorStatus = (reason: "missing_config" | "unauthenticated" | "forbidden") =>
  reason === "missing_config" ? 500 : reason === "unauthenticated" ? 401 : 403;

const quotedIdList = (ids: string[]) =>
  ids.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(",");

const normalizePayload = (
  payload: unknown
): { ok: true; all: boolean; ids: string[] } | { ok: false; error: string } => {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "invalid_payload" };
  }

  const body = payload as BulkDeletePayload;
  const all = body.all === true;
  const ids = Array.isArray(body.ids)
    ? Array.from(
        new Set(
          body.ids
            .filter((id): id is string => typeof id === "string")
            .map((id) => id.trim())
            .filter(Boolean)
        )
      )
    : [];

  if (!all && ids.length === 0) {
    return { ok: false, error: "missing_ids" };
  }
  if (ids.some((id) => !isValidNoteId(id))) {
    return { ok: false, error: "invalid_id" };
  }

  return { ok: true, all, ids };
};

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json(
      { ok: false, error: session.reason },
      { status: buildErrorStatus(session.reason) }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  const normalized = normalizePayload(body);
  if (!normalized.ok) {
    return NextResponse.json(
      { ok: false, error: normalized.error },
      { status: 400 }
    );
  }

  const query = new URLSearchParams({
    select: "id,kind,parent_id,deleted_at",
    deleted_at: "not.is.null",
  });
  if (!normalized.all) {
    query.set("id", `in.(${quotedIdList(normalized.ids)})`);
  }

  const trashedResult = await supabaseAdminRestRequest<TrashIndexRow[]>(
    session,
    "notes",
    { method: "GET", query }
  );

  if (!trashedResult.ok) {
    return NextResponse.json(
      { ok: false, error: "notes_query_failed", details: trashedResult.error },
      { status: trashedResult.status }
    );
  }

  const targets = Array.isArray(trashedResult.data) ? trashedResult.data : [];
  if (!targets.length) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  if (!normalized.all && targets.length !== normalized.ids.length) {
    return NextResponse.json(
      { ok: false, error: "notes_not_found_or_not_trashed" },
      { status: 404 }
    );
  }

  const targetIds = new Set(targets.map((row) => row.id));
  const noteIndex = await fetchNoteIndex(session);
  if (!noteIndex.ok) {
    return NextResponse.json(
      { ok: false, error: "note_index_failed", details: noteIndex.error },
      { status: noteIndex.status }
    );
  }

  const rowById = new Map(noteIndex.data.map((row) => [row.id, row]));
  const reparentGroups = new Map<string, string[]>();
  for (const row of noteIndex.data) {
    if (!row.parent_id || !targetIds.has(row.parent_id) || targetIds.has(row.id)) {
      continue;
    }

    let nextParentId: string | null = row.parent_id;
    while (nextParentId && targetIds.has(nextParentId)) {
      nextParentId = rowById.get(nextParentId)?.parent_id ?? null;
    }

    const key = nextParentId ?? "";
    reparentGroups.set(key, [...(reparentGroups.get(key) ?? []), row.id]);
  }

  for (const [parentId, childIds] of reparentGroups) {
    const reparentQuery = new URLSearchParams({
      id: `in.(${quotedIdList(childIds)})`,
    });
    const reparentResult = await supabaseAdminRestRequest<AdminNoteRecord[]>(
      session,
      "notes",
      {
        method: "PATCH",
        query: reparentQuery,
        body: { parent_id: parentId || null },
      }
    );

    if (!reparentResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "folder_reparent_failed",
          details: reparentResult.error,
        },
        { status: reparentResult.status }
      );
    }
  }

  const deleteQuery = new URLSearchParams({
    id: `in.(${quotedIdList([...targetIds])})`,
  });
  const deleteResult = await supabaseAdminRestRequest<AdminNoteRecord[]>(
    session,
    "notes",
    { method: "DELETE", query: deleteQuery }
  );

  if (!deleteResult.ok) {
    return NextResponse.json(
      { ok: false, error: "notes_delete_failed", details: deleteResult.error },
      { status: deleteResult.status }
    );
  }

  return NextResponse.json({
    ok: true,
    deletedIds: Array.isArray(deleteResult.data)
      ? deleteResult.data.map((note) => note.id)
      : [...targetIds],
  });
}

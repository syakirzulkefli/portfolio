import { NextResponse } from "next/server";

import {
  getAdminSession,
  supabaseAdminRestRequest,
} from "../../../../../notes/admin/supabase.server";
import {
  type AdminNoteRecord,
  isValidNoteId,
  normalizeUpdatePayload,
} from "../note-shared";
import {
  fetchNoteIndex,
  validateParentSelection,
} from "../tree-shared";

export const runtime = "edge";

type RouteParams = {
  id: string;
};

const buildErrorStatus = (reason: "missing_config" | "unauthenticated" | "forbidden") =>
  reason === "missing_config" ? 500 : reason === "unauthenticated" ? 401 : 403;

export async function GET(
  _request: Request,
  context: { params: Promise<RouteParams> }
) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json(
      { ok: false, error: session.reason },
      { status: buildErrorStatus(session.reason) }
    );
  }

  const params = await context.params;
  const noteId = typeof params.id === "string" ? params.id : "";
  if (!isValidNoteId(noteId)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const query = new URLSearchParams({
    select: [
      "id",
      "kind",
      "domain",
      "section",
      "parent_id",
      "chapter_id",
      "chapter_title",
      "title",
      "label",
      "summary",
      "level",
      "tags",
      "pinned",
      "sort_order",
      "is_published",
      "content",
      "deleted_at",
      "updated_at",
      "created_at",
    ].join(","),
    id: `eq.${noteId}`,
    limit: "1",
  });

  const result = await supabaseAdminRestRequest<AdminNoteRecord[]>(
    session,
    "notes",
    { method: "GET", query }
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "note_query_failed", details: result.error },
      { status: result.status }
    );
  }

  const note = Array.isArray(result.data) ? (result.data[0] ?? null) : null;
  if (!note) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, note });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json(
      { ok: false, error: session.reason },
      { status: buildErrorStatus(session.reason) }
    );
  }

  const params = await context.params;
  const noteId = typeof params.id === "string" ? params.id : "";
  if (!isValidNoteId(noteId)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
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

  const normalized = normalizeUpdatePayload(body);
  if (!normalized.ok) {
    return NextResponse.json(
      { ok: false, error: normalized.error },
      { status: 400 }
    );
  }

  const noteIndex = await fetchNoteIndex(session);
  if (!noteIndex.ok) {
    return NextResponse.json(
      { ok: false, error: "note_index_failed", details: noteIndex.error },
      { status: noteIndex.status }
    );
  }
  const parentError = validateParentSelection({
    rows: noteIndex.data,
    parentId: normalized.value.parent_id ?? null,
    domain: normalized.value.domain,
    section: normalized.value.section,
    selfId: noteId,
  });
  if (parentError) {
    return NextResponse.json({ ok: false, error: parentError }, { status: 400 });
  }

  const query = new URLSearchParams({
    id: `eq.${noteId}`,
  });

  const result = await supabaseAdminRestRequest<AdminNoteRecord[]>(
    session,
    "notes",
    {
      method: "PATCH",
      query,
      body: normalized.value,
    }
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "note_update_failed", details: result.error },
      { status: result.status }
    );
  }

  if (!Array.isArray(result.data) || result.data.length === 0) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, note: result.data[0] });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<RouteParams> }
) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json(
      { ok: false, error: session.reason },
      { status: buildErrorStatus(session.reason) }
    );
  }

  const params = await context.params;
  const noteId = typeof params.id === "string" ? params.id : "";
  if (!isValidNoteId(noteId)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const hard = new URL(request.url).searchParams.get("hard") === "true";
  const noteIndex = await fetchNoteIndex(session);
  if (!noteIndex.ok) {
    return NextResponse.json(
      { ok: false, error: "note_index_failed", details: noteIndex.error },
      { status: noteIndex.status }
    );
  }

  const target = noteIndex.data.find((row) => row.id === noteId) ?? null;
  if (!target) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  if (target.kind === "folder") {
    const directChildren = noteIndex.data.filter((row) => row.parent_id === noteId);
    if (directChildren.length > 0) {
      const reparentQuery = new URLSearchParams({
        id: `in.(${directChildren.map((row) => `"${row.id}"`).join(",")})`,
      });

      const reparentResult = await supabaseAdminRestRequest<AdminNoteRecord[]>(
        session,
        "notes",
        {
          method: "PATCH",
          query: reparentQuery,
          body: { parent_id: target.parent_id ?? null },
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
  }

  const deleteQuery = new URLSearchParams({
    id: `eq.${noteId}`,
  });

  const result = await supabaseAdminRestRequest<AdminNoteRecord[]>(
    session,
    "notes",
    hard
      ? {
          method: "DELETE",
          query: deleteQuery,
        }
      : {
          method: "PATCH",
          query: deleteQuery,
          body: { deleted_at: new Date().toISOString() },
        }
  );

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: hard ? "note_delete_failed" : "note_trash_failed",
        details: result.error,
      },
      { status: result.status }
    );
  }

  if (!Array.isArray(result.data) || result.data.length === 0) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, note: result.data[0] });
}

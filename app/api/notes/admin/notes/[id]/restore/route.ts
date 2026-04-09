import { NextResponse } from "next/server";

import {
  getAdminSession,
  supabaseAdminRestRequest,
} from "../../../../../../notes/admin/supabase.server";
import { isValidNoteId, type AdminNoteRecord } from "../../note-shared";
import { collectDescendantIds, fetchNoteIndex } from "../../tree-shared";

export const runtime = "edge";

type RouteParams = {
  id: string;
};

const buildErrorStatus = (
  reason: "missing_config" | "unauthenticated" | "forbidden"
) => (reason === "missing_config" ? 500 : reason === "unauthenticated" ? 401 : 403);

export async function POST(
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

  const noteIndex = await fetchNoteIndex(session);
  if (!noteIndex.ok) {
    return NextResponse.json(
      { ok: false, error: "note_index_failed", details: noteIndex.error },
      { status: noteIndex.status }
    );
  }

  const restoredIds = collectDescendantIds(noteIndex.data, noteId);
  const query = new URLSearchParams({
    id: `in.(${[...restoredIds].map((id) => `"${id}"`).join(",")})`,
  });
  const result = await supabaseAdminRestRequest<AdminNoteRecord[]>(
    session,
    "notes",
    { method: "PATCH", query, body: { deleted_at: null } }
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "note_restore_failed", details: result.error },
      { status: result.status }
    );
  }

  const note = Array.isArray(result.data) ? (result.data[0] ?? null) : null;
  if (!note) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, note });
}

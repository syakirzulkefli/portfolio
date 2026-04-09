import { NextResponse } from "next/server";

import {
  getAdminSession,
  supabaseAdminRestRequest,
} from "../../../../notes/admin/supabase.server";
import {
  type AdminNoteRecord,
  isValidNoteId,
  normalizeCreatePayload,
} from "./note-shared";
import { fetchNoteIndex, validateParentSelection } from "./tree-shared";

export const runtime = "edge";

const MAX_NOTE_ID_LEN = 121; // matches validation regex in note-shared.ts

const parseSlugSuffix = (id: string) => {
  const match = id.match(/^(.*?)-(\d+)$/);
  if (!match) return { root: id, next: 2 };
  const root = match[1];
  const parsed = Number.parseInt(match[2] ?? "", 10);
  if (!Number.isFinite(parsed)) return { root: id, next: 2 };
  return { root, next: Math.max(2, parsed + 1) };
};

const suffixedId = (root: string, n: number) => {
  const suffix = `-${n}`;
  const allowed = MAX_NOTE_ID_LEN - suffix.length;
  const trimmedRoot = root.slice(0, Math.max(1, allowed)).replace(/-+$/g, "");
  const candidate = `${trimmedRoot}${suffix}`;
  return isValidNoteId(candidate) ? candidate : null;
};

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    const status =
      session.reason === "missing_config"
        ? 500
        : session.reason === "unauthenticated"
        ? 401
        : 403;
    return NextResponse.json({ ok: false, error: session.reason }, { status });
  }

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view");
  const select =
    view === "links"
      ? [
          "id",
          "kind",
          "domain",
          "section",
          "parent_id",
          "title",
          "tags",
          "deleted_at",
          "updated_at",
        ]
      : [
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
        ];

  const query = new URLSearchParams({ select: select.join(",") });

  const domain = searchParams.get("domain");
  if (domain === "software" || domain === "trading" || domain === "motivation") {
    query.set("domain", `eq.${domain}`);
  }

  const kind = searchParams.get("kind");
  if (kind === "folder" || kind === "note") {
    query.set("kind", `eq.${kind}`);
  }

  const deleted = searchParams.get("deleted");
  if (deleted === "true") {
    query.set("deleted_at", "not.is.null");
  } else if (deleted === "all") {
    // no filter
  } else {
    query.set("deleted_at", "is.null");
  }

  const published = searchParams.get("published");
  if (published === "true" || published === "false") {
    query.set("is_published", `eq.${published}`);
  }

  if (deleted === "true") {
    query.append("order", "deleted_at.desc.nullslast");
    query.append("order", "updated_at.desc.nullslast");
    query.append("order", "title.asc");
  } else {
    query.append("order", "domain.asc");
    query.append("order", "section.asc");
    query.append("order", "parent_id.asc.nullsfirst");
    query.append("order", "sort_order.asc.nullslast");
    query.append("order", "title.asc");
  }

  const result = await supabaseAdminRestRequest<AdminNoteRecord[]>(
    session,
    "notes",
    { method: "GET", query }
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "notes_query_failed", details: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({ ok: true, notes: result.data });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    const status =
      session.reason === "missing_config"
        ? 500
        : session.reason === "unauthenticated"
        ? 401
        : 403;
    return NextResponse.json({ ok: false, error: session.reason }, { status });
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

  const normalized = normalizeCreatePayload(body);
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
    parentId: normalized.value.parent_id,
    domain: normalized.value.domain,
    section: normalized.value.section,
  });
  if (parentError) {
    return NextResponse.json({ ok: false, error: parentError }, { status: 400 });
  }

  const attemptInsert = async (value: AdminNoteRecord) =>
    supabaseAdminRestRequest<AdminNoteRecord[]>(session, "notes", {
      method: "POST",
      body: [value],
    });

  let value = normalized.value;
  let result = await attemptInsert(value);

  if (!result.ok && result.status === 409) {
    // Auto-resolve slug conflicts: foo -> foo-2 -> foo-3 ...
    const { root, next } = parseSlugSuffix(value.id);
    for (let n = next; n < next + 25; n += 1) {
      const candidate = suffixedId(root, n);
      if (!candidate) continue;
      value = { ...value, id: candidate };
      result = await attemptInsert(value);
      if (result.ok) break;
      if (result.status !== 409) break;
    }
  }

  if (!result.ok) {
    const status = result.status === 409 ? 409 : result.status;
    return NextResponse.json(
      {
        ok: false,
        error: status === 409 ? "note_id_conflict" : "note_create_failed",
        details: result.error,
      },
      { status }
    );
  }

  return NextResponse.json({ ok: true, note: result.data[0] ?? null }, { status: 201 });
}

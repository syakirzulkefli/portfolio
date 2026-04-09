import {
  type DomainId,
  type NoteKind,
  type SectionId,
} from "../../../../notes/data";
import { supabaseAdminRestRequest, type SupabaseConfig } from "../../../../notes/admin/supabase.server";

type SessionLike = {
  config: SupabaseConfig;
  accessToken: string;
};

export type NoteIndexRow = {
  id: string;
  kind: NoteKind;
  parent_id: string | null;
  domain: DomainId;
  section: SectionId;
};

export const fetchNoteIndex = async (session: SessionLike) => {
  const query = new URLSearchParams({
    select: "id,kind,parent_id,domain,section",
  });

  return supabaseAdminRestRequest<NoteIndexRow[]>(session, "notes", {
    method: "GET",
    query,
  });
};

export const collectDescendantIds = (rows: NoteIndexRow[], rootId: string) => {
  const childrenByParentId = new Map<string, string[]>();
  for (const row of rows) {
    if (!row.parent_id) continue;
    const children = childrenByParentId.get(row.parent_id) ?? [];
    children.push(row.id);
    childrenByParentId.set(row.parent_id, children);
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

export const validateParentSelection = ({
  rows,
  parentId,
  domain,
  section,
  selfId,
}: {
  rows: NoteIndexRow[];
  parentId: string | null;
  domain: DomainId;
  section: SectionId;
  selfId?: string | null;
}): string | null => {
  if (!parentId) return null;
  const parent = rows.find((row) => row.id === parentId) ?? null;
  if (!parent) return "parent_not_found";
  if (parent.kind !== "folder") return "parent_must_be_folder";
  if (parent.domain !== domain || parent.section !== section) {
    return "parent_must_match_topic";
  }
  if (selfId && collectDescendantIds(rows, selfId).has(parentId)) {
    return "parent_cycle";
  }
  return null;
};

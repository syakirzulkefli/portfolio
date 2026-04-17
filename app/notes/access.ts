import type { DomainId } from "./data";

export const isPublicNotesDomain = (domain: DomainId) => domain === "software";

export const requiresNotesOwnerAccess = (domain: DomainId) =>
  !isPublicNotesDomain(domain);

import type { DomainId } from "./data";

export const isPublicNotesDomain = (domain: DomainId) => {
  void domain;
  return false;
};

export const requiresNotesOwnerAccess = (domain: DomainId) => !isPublicNotesDomain(domain);

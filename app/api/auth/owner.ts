const DEFAULT_NOTES_OWNER_EMAILS = ["msyakirzulkefli@gmail.com"];

const normalizeEnvValue = (value: string | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const unwrapped = trimmed.slice(1, -1).trim();
    return unwrapped || null;
  }
  return trimmed;
};

const collectEmails = (...keys: string[]) => {
  const emails = new Set<string>();

  for (const key of keys) {
    const value = normalizeEnvValue(process.env[key]);
    if (!value) continue;

    for (const candidate of value.split(",")) {
      const email = candidate.trim().toLowerCase();
      if (email) emails.add(email);
    }
  }

  if (emails.size > 0) return emails;

  for (const email of DEFAULT_NOTES_OWNER_EMAILS) {
    emails.add(email);
  }
  return emails;
};

export const getNotesOwnerEmails = () =>
  collectEmails("NOTES_OWNER_EMAILS", "NOTES_OWNER_EMAIL");

export const isNotesOwnerEmail = (email: string | null | undefined) => {
  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalized) return false;
  return getNotesOwnerEmails().has(normalized);
};

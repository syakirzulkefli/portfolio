export type DomainId = "software" | "trading" | "motivation";

export type SectionId =
  | "java"
  | "javascript"
  | "typescript"
  | "react"
  | "node"
  | "css"
  | "tooling"
  | "algorithms"
  | "designPatterns"
  | "nextjs"
  | "docker"
  | "git"
  | "tradingFundamentals"
  | "tradingTechnical"
  | "pastWinner"
  | "currentCounter"
  | "fcpo"
  | "mindset"
  | "discipline"
  | "habits"
  | "focus"
  | "growth"
  | "other";

export type Level = "intro" | "beginner" | "intermediate" | "advanced";

export type SortBy = "recent" | "difficulty" | "mostReviewed";
export type NoteKind = "folder" | "note";

export type NoteSection = { title: string; content: string };

export type NoteNode = {
  id: string;
  kind: NoteKind;
  domain: DomainId;
  title: string;
  section: SectionId;
  parentId: string | null;
  chapterId?: string | null;
  chapterTitle?: string | null;
  level: Level;
  summary: string;
  tags: string[];
  updatedAt: string;
  pinned?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
  lastReviewedAt?: string;
  viewCount?: number;
  headings?: string[];
  sections?: NoteSection[];
};

export type Note = NoteNode & {
  kind: "note";
};

export const domains: { id: DomainId; label: string }[] = [
  { id: "software", label: "Software Programming" },
  { id: "trading", label: "Stock Trading" },
  { id: "motivation", label: "Motivation" },
];

export const sections: { id: SectionId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "java", label: "Java" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "react", label: "React" },
  { id: "node", label: "Node.js" },
  { id: "css", label: "CSS" },
  { id: "tooling", label: "Tooling" },
  { id: "algorithms", label: "Algorithms" },
  { id: "designPatterns", label: "Design Patterns" },
  { id: "nextjs", label: "Next.js" },
  { id: "docker", label: "Docker" },
  { id: "git", label: "Git" },
  { id: "tradingFundamentals", label: "Trading Fundamentals" },
  { id: "tradingTechnical", label: "Technical Analysis" },
  { id: "pastWinner", label: "Past Winner" },
  { id: "currentCounter", label: "Current Counter" },
  { id: "fcpo", label: "FCPO" },
  { id: "mindset", label: "Mindset" },
  { id: "discipline", label: "Discipline" },
  { id: "habits", label: "Habits" },
  { id: "focus", label: "Focus" },
  { id: "growth", label: "Growth" },
  { id: "other", label: "Other" },
];

const sectionLabelById = new Map<SectionId, string>(
  sections
    .filter((item): item is { id: SectionId; label: string } => item.id !== "all")
    .map((item) => [item.id, item.label])
);

export const sectionIdsByDomain: Record<DomainId, SectionId[]> = {
  software: [
    "java",
    "javascript",
    "typescript",
    "react",
    "node",
    "css",
    "designPatterns",
    "nextjs",
    "docker",
    "git",
    "tooling",
    "algorithms",
    "other",
  ],
  trading: [
    "tradingFundamentals",
    "tradingTechnical",
    "pastWinner",
    "currentCounter",
    "fcpo",
    "other",
  ],
  motivation: ["mindset", "discipline", "habits", "focus", "growth", "other"],
};

export const isSectionInDomain = (domain: DomainId, section: SectionId) =>
  sectionIdsByDomain[domain].includes(section);

export const firstSectionForDomain = (domain: DomainId) =>
  sectionIdsByDomain[domain][0];

export const sectionOptionsForDomain = (domain: DomainId) =>
  sectionIdsByDomain[domain]
    .map((id) => {
      const label = sectionLabelById.get(id);
      if (!label) return null;
      return { value: id, label };
    })
    .filter((item): item is { value: SectionId; label: string } => item !== null);

export const sectionLabelForId = (section: SectionId) =>
  sectionLabelById.get(section) ?? section;

export const levels: { id: Level | "all"; label: string }[] = [
  { id: "all", label: "All levels" },
  { id: "intro", label: "Intro" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const sortOptions: { id: SortBy; label: string }[] = [
  { id: "recent", label: "Last updated" },
  { id: "difficulty", label: "Difficulty" },
  { id: "mostReviewed", label: "Most reviewed" },
];

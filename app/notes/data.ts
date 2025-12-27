export type DomainId = "software" | "trading";

export type SectionId =
  | "java"
  | "javascript"
  | "typescript"
  | "react"
  | "node"
  | "css"
  | "tooling"
  | "algorithms"
  | "tradingFundamentals"
  | "tradingTechnical"
  | "other";

export type Level = "intro" | "beginner" | "intermediate" | "advanced";

export type SortBy = "recent" | "difficulty" | "mostReviewed";

export type NoteSection = { title: string; content: string };

export type Note = {
  id: string;
  domain: DomainId;
  title: string;
  section: SectionId;
  chapterId: string;
  chapterTitle: string;
  level: Level;
  summary: string;
  tags: string[];
  updatedAt: string;
  pinned?: boolean;
  lastReviewedAt?: string;
  viewCount?: number;
  headings?: string[];
  sections?: NoteSection[];
};

export const domains: { id: DomainId; label: string }[] = [
  { id: "software", label: "Software Programming" },
  { id: "trading", label: "Stock Trading" },
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
  { id: "tradingFundamentals", label: "Trading Fundamentals" },
  { id: "tradingTechnical", label: "Technical Analysis" },
  { id: "other", label: "Other" },
];

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

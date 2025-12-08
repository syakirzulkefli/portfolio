import { Note } from "../data";
import { javaGettingStarted } from "./java/getting-started";
import { javaTypes } from "./java/types";
import { javaControlFlow } from "./java/control-flow";
import { javaCleanCoding } from "./java/clean-coding";
import { javaDebugDeploy } from "./java/debug-deploy";

// Lightweight placeholders for other sections so the UI still has content beyond Java.
const otherNotes: Note[] = [
  {
    id: "javascript-array-methods",
    domain: "software",
    title: "Array Methods Cheatsheet",
    section: "javascript",
    chapterId: "javascript-arrays",
    chapterTitle: "Array Methods",
    level: "beginner",
    summary:
      "Quick reference for map, filter, reduce, and a few common patterns.",
    tags: ["javascript", "arrays"],
    updatedAt: "2025-11-27",
    viewCount: 14,
    sections: [
      { title: "Core methods", content: "Lorem ipsum dolor sit amet." },
      { title: "When to use map/filter", content: "Lorem ipsum dolor sit amet." },
      { title: "Reduce patterns", content: "Lorem ipsum dolor sit amet." },
    ],
  },
  {
    id: "react-useeffect",
    domain: "software",
    title: "Essential useEffect Patterns",
    section: "react",
    chapterId: "react-hooks",
    chapterTitle: "Hooks",
    level: "intermediate",
    summary: "Patterns for data fetching, subscriptions, and cleanups.",
    tags: ["react", "hooks"],
    updatedAt: "2025-11-20",
    viewCount: 10,
    sections: [
      { title: "Basic pattern", content: "Lorem ipsum dolor sit amet." },
      { title: "Data fetching", content: "Lorem ipsum dolor sit amet." },
      { title: "Cleanup rules", content: "Lorem ipsum dolor sit amet." },
    ],
  },
  {
    id: "trading-price-action",
    domain: "trading",
    title: "Trading: Price Action Basics",
    section: "tradingTechnical",
    chapterId: "trading-price-action",
    chapterTitle: "Price Action",
    level: "beginner",
    summary: "Support, resistance, trends, and candlesticks at a glance.",
    tags: ["trading", "technical"],
    updatedAt: "2025-11-18",
    viewCount: 4,
    sections: [
      { title: "Support and resistance", content: "Lorem ipsum dolor sit amet." },
      { title: "Trend basics", content: "Lorem ipsum dolor sit amet." },
      { title: "Candlestick overview", content: "Lorem ipsum dolor sit amet." },
    ],
  },
];

export const mockNotes: Note[] = [
  javaGettingStarted,
  javaTypes,
  javaControlFlow,
  javaCleanCoding,
  javaDebugDeploy,
  ...otherNotes,
];

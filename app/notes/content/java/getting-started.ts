import "server-only";

import fs from "node:fs";
import path from "node:path";
import { Note } from "../../data";

const markdownPath = path.join(
  process.cwd(),
  "app/notes/content/java/1-getting-started/1_Setting_Up_the_Development_Environment.md"
);

const rawMarkdown = fs.readFileSync(markdownPath, "utf8");
const markdownBody = rawMarkdown.replace(/^#\s+[^\n]*\n?/, "").trim();
const updatedAt = (() => {
  try {
    const stat = fs.statSync(markdownPath);
    return new Date(stat.mtime).toISOString().slice(0, 10);
  } catch {
    return "2025-12-22";
  }
})();

export const javaGettingStarted: Note = {
  id: "java-getting-started",
  domain: "software",
  title: "Java: Getting Started",
  section: "java",
  chapterId: "java-getting-started",
  chapterTitle: "Getting started",
  level: "intro",
  summary: "Real notes for Java setup and first steps.",
  tags: ["java", "setup"],
  updatedAt,
  pinned: true,
  sections: [
    {
      title: "Setting Up the Development Environment",
      content: markdownBody,
    },
  ],
};


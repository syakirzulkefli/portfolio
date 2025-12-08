import { Note } from "../../data";

const lipsum = (topic: string) =>
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${topic} metus eget cursus feugiat. Vestibulum at arcu ac justo posuere bibendum.`;

const make = (title: string, desc: string) => ({
  title,
  content: lipsum(desc),
});

export const javaDebugDeploy: Note = {
  id: "java-debug-deploy",
  domain: "software",
  title: "Java: Debugging & Deploying",
  section: "java",
  chapterId: "java-debug-deploy",
  chapterTitle: "Debugging and deploying applications",
  level: "intermediate",
  summary:
    "Debugging with an IDE, common error types, packaging, and deployment wrap-up.",
  tags: ["java", "debug", "deploy"],
  updatedAt: "2025-11-23",
  viewCount: 10,
  sections: [
    make("Introduction", "How to approach debugging and deployment"),
    make("Types of Errors", "Syntax, runtime, and logical errors"),
    make("Common Syntax Errors", "Typical compiler errors and fixes"),
    make("Debugging Java Applications", "Breakpoints, stepping, watches"),
    make("Packaging Java Applications", "JARs, dependencies, manifests"),
    make("Course Wrap Up", "Key points before shipping Java apps"),
  ],
};

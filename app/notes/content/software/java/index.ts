import type { NotesOutlineGroup } from "../../../outline/types";

export const javaOutline: NotesOutlineGroup[] = [
  {
    id: "java-getting-started",
    label: "Getting started",
    domain: "software",
    items: [
      {
        id: "java-dev-environment",
        label: "Setting Up the Development Environment",
        title: "Java: Getting Started",
        summary: "Install JDK + pick an IDE to start writing Java.",
        domain: "software",
        section: "java",
        chapterId: "java-getting-started",
        chapterTitle: "Getting started",
        level: "intro",
        tags: ["java", "setup"],
        markdownPath:
          "app/notes/content/software/java/1-getting-started/1_Setting_Up_the_Development_Environment.md",
        pinned: true,
      },
      {
        id: "java-anatomy",
        label: "Anatomy of a Java Program",
        title: "Java: Anatomy of a Program",
        summary: "Understand the main class, main method, and basic structure.",
        domain: "software",
        section: "java",
        chapterId: "java-getting-started",
        chapterTitle: "Getting started",
        level: "intro",
        tags: ["java", "basics"],
        markdownPath:
          "app/notes/content/software/java/1-getting-started/2_Anatomy_of_a_Java_Program.md",
      },
    ],
  },
];

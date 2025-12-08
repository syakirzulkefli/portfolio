import { Note } from "../../data";

const lipsum = (topic: string) =>
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${topic} metus eget cursus feugiat. Vestibulum at arcu ac justo posuere bibendum.`;

export const javaGettingStarted: Note = {
  id: "java-getting-started",
  domain: "software",
  title: "Java: Getting Started",
  section: "java",
  chapterId: "java-getting-started",
  chapterTitle: "Getting started",
  level: "intro",
  summary:
    "Setup, first program, how Java code runs, and what to expect from the course.",
  tags: ["java", "setup", "basics"],
  updatedAt: "2025-11-27",
  pinned: true,
  lastReviewedAt: "2025-11-28",
  viewCount: 18,
  sections: [
    {
      title: "Setting Up the Development Environment",
      content: lipsum("Install JDK, set JAVA_HOME, and configure PATH"),
    },
    {
      title: "Anatomy of a Java Program",
      content: lipsum("Understand class structure, main method, and packages"),
    },
    {
      title: "Your First Java Program",
      content: lipsum("Write, compile, and run Hello World from CLI and IDE"),
    },
    {
      title: "How Java Code Gets Executed",
      content: lipsum("Compilation to bytecode, JVM execution, classpath"),
    },
    {
      title: "5 Interesting Facts about Java",
      content: lipsum("A few fun trivia points about Java history and design"),
    },
    {
      title: "Course Structure",
      content: lipsum("What this Java track will cover and how to progress"),
    },
  ],
};

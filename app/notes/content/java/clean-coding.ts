import { Note } from "../../data";

const lipsum = (topic: string) =>
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${topic} metus eget cursus feugiat. Vestibulum at arcu ac justo posuere bibendum.`;

const make = (title: string, desc: string) => ({
  title,
  content: lipsum(desc),
});

export const javaCleanCoding: Note = {
  id: "java-clean-coding",
  domain: "software",
  title: "Java: Clean Coding",
  section: "java",
  chapterId: "java-clean-coding",
  chapterTitle: "Clean coding",
  level: "intermediate",
  summary: "Naming, formatting, reducing complexity, and refactoring patterns.",
  tags: ["java", "clean-code"],
  updatedAt: "2025-11-24",
  viewCount: 12,
  sections: [
    make("Introduction", "Why clean code matters for Java projects"),
    make("Clean Coding", "Principles for readable, maintainable code"),
    make("Creating Methods", "Designing small, focused methods"),
    make("Refactoring", "Safer changes to improve structure"),
    make("Extracting Methods", "Extracting logic to reduce duplication"),
    make("Refactoring Repetitive Patterns", "Identifying and removing repetition"),
    make("Project – Payment Schedule", "Applying clean code to a small project"),
    make("Solution", "Walking through the project solution"),
    make("Refactoring the Code", "Iterating on the solution for clarity"),
    make("Summary", "Key takeaways from Clean Coding"),
  ],
};

import { Note } from "../../data";

const lipsum = (topic: string) =>
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${topic} metus eget cursus feugiat. Vestibulum at arcu ac justo posuere bibendum.`;

const make = (title: string, desc: string) => ({
  title,
  content: lipsum(desc),
});

export const javaTypes: Note = {
  id: "java-types",
  domain: "software",
  title: "Java: Types",
  section: "java",
  chapterId: "java-types",
  chapterTitle: "Types",
  level: "beginner",
  summary:
    "Primitive vs reference types, casting, and good habits for declarations.",
  tags: ["java", "types"],
  updatedAt: "2025-11-26",
  viewCount: 15,
  sections: [
    make("Introduction", "Overview of the type system and why it matters"),
    make("Variables", "Declaring and initializing variables"),
    make("Primitive Types", "byte, short, int, long, float, double, char, boolean"),
    make("Reference Types", "Objects, strings, arrays, and null"),
    make("Primitive vs Reference Types", "Memory layout and behavior"),
    make("Strings", "String basics and immutability"),
    make("Escape Sequences", "Using escape characters in strings"),
    make("Arrays", "Creating and iterating arrays"),
    make("Multi-dimensional Arrays", "2D arrays and nested loops"),
    make("Constants", "Using final for constants"),
    make("Arithmetic Expressions", "Operators and precedence"),
    make("Order of Operations", "How expressions are evaluated"),
    make("Casting", "Implicit vs explicit casts, narrowing vs widening"),
    make("The Math Class", "Common Math utilities"),
    make("Formatting Numbers", "NumberFormat and formatting patterns"),
    make("Reading Input", "Scanner basics"),
    make("Project – Mortgage Calculator", "Applying types in a small project"),
    make("Solution", "Walking through the project solution"),
    make("Summary", "Key takeaways from the Types module"),
  ],
};

import { Note } from "../../data";

const lipsum = (topic: string) =>
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${topic} metus eget cursus feugiat. Vestibulum at arcu ac justo posuere bibendum.`;

const make = (title: string, desc: string) => ({
  title,
  content: lipsum(desc),
});

export const javaControlFlow: Note = {
  id: "java-control-flow",
  domain: "software",
  title: "Java: Control Flow",
  section: "java",
  chapterId: "java-control-flow",
  chapterTitle: "Control flow",
  level: "beginner",
  summary:
    "If/else, switch, loops, and exceptions to control the execution path.",
  tags: ["java", "control-flow"],
  updatedAt: "2025-11-25",
  viewCount: 14,
  sections: [
    make("Introduction", "Why control flow matters"),
    make("Comparison Operators", "==, !=, >, <, >=, <="),
    make("Logical Operators", "&&, ||, !"),
    make("If Statements", "Basic if / if-else patterns"),
    make("Simplifying If Statements", "Early returns and guard clauses"),
    make("The Ternary Operator", "Inline conditional expressions"),
    make("Switch Statements", "Classic and enhanced switch"),
    make("Exercise – FizzBuzz", "Applying control flow in practice"),
    make("For Loops", "Counting and iterating collections"),
    make("While Loops", "Looping with conditions"),
    make("Do..While Loops", "When to use do-while"),
    make("Break and Continue Statements", "Controlling loop flow"),
    make("For-Each Loop", "Enhanced for loops"),
    make("Project – Mortgage Calculator", "Using control flow in a small app"),
    make("Solution", "Walking through the project solution"),
    make("Summary", "Key takeaways from Control Flow"),
  ],
};

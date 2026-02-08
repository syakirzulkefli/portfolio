import type { NotesOutlineGroup, NotesOutlineItem } from "../../../outline/types";

type NoteSeed = Pick<NotesOutlineItem, "id" | "markdownPath"> &
  Partial<Omit<NotesOutlineItem, "id" | "markdownPath" | "domain">>;

const labelFromMarkdownPath = (markdownPath: string) => {
  const baseName = markdownPath.split("/").pop() ?? markdownPath;
  return baseName
    .replace(/\.(md|mdx)$/i, "")
    .replace(/^\d+[_-]/, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const javaChapter = ({
  id,
  label,
  items,
}: {
  id: string;
  label: string;
  items: NoteSeed[];
}): NotesOutlineGroup => ({
  id,
  label,
  domain: "software",
  items: items.map((seed) => {
    const itemLabel = seed.label ?? labelFromMarkdownPath(seed.markdownPath);
    return {
      id: seed.id,
      label: itemLabel,
      title: seed.title ?? `Java: ${itemLabel}`,
      summary: seed.summary ?? "",
      domain: "software",
      section: seed.section ?? "java",
      chapterId: seed.chapterId ?? id,
      chapterTitle: seed.chapterTitle ?? label,
      level: seed.level ?? "intro",
      tags: seed.tags ?? [],
      markdownPath: seed.markdownPath,
      pinned: seed.pinned,
    };
  }),
});

export const javaOutline: NotesOutlineGroup[] = [
  javaChapter({
    id: "java-getting-started",
    label: "Getting started",
    items: [
      {
        id: "java-dev-environment",
        title: "Java: Getting Started",
        summary: "Install JDK + pick an IDE to start writing Java.",
        tags: ["java", "setup"],
        markdownPath:
          "app/notes/content/software/java/1-getting-started/1_Setting_Up_the_Development_Environment.md",
        pinned: true,
      },
      {
        id: "java-anatomy",
        title: "Java: Anatomy of a Program",
        summary: "Understand the main class, main method, and basic structure.",
        tags: ["java", "basics"],
        markdownPath:
          "app/notes/content/software/java/1-getting-started/2_Anatomy_of_a_Java_Program.md",
      },
      {
        id: "first-java-program",
        summary: "Understand the main class, main method, and basic structure.",
        tags: ["java", "basics"],
        markdownPath:
          "app/notes/content/software/java/1-getting-started/3_First_Java_Program.md",
      },
      {
        id: "how-java-code-gets-executed",
        summary: "How Java Code Gets Executed.",
        tags: ["java", "basics"],
        markdownPath:
          "app/notes/content/software/java/1-getting-started/4_How_Java_Code_Gets_Executed.md",
      },
      {
        id: "5_interesting_facts_about_java",
        summary: "5 Interesting Facts About Java.",
        tags: ["java", "basics"],
        markdownPath:
          "app/notes/content/software/java/1-getting-started/5_5_Interesting_Facts_About_Java.md",
      },
    ],
  }),
  javaChapter({
    id: "java-types",
    label: "Types",
    items: [
      {
        id: "java-types-introduction",
        markdownPath:
          "app/notes/content/software/java/2-types/1_Introduction.md",
      },
      {
        id: "java-types-variables",
        markdownPath: "app/notes/content/software/java/2-types/2_Variables.md",
      },
      {
        id: "java-types-primitive-types",
        markdownPath:
          "app/notes/content/software/java/2-types/3_Primitive_Types.md",
      },
      {
        id: "java-types-reference-types",
        markdownPath:
          "app/notes/content/software/java/2-types/4_Reference_Types.md",
      },
      {
        id: "java-types-primitive-vs-reference",
        markdownPath:
          "app/notes/content/software/java/2-types/5_Primitive_vs_Reference_Types.md",
      },
      {
        id: "java-types-strings",
        markdownPath: "app/notes/content/software/java/2-types/6_Strings.md",
      },
      {
        id: "java-types-escape-sequences",
        markdownPath:
          "app/notes/content/software/java/2-types/7_Escape_Sequences.md",
      },
      {
        id: "java-types-arrays",
        markdownPath: "app/notes/content/software/java/2-types/8_Arrays.md",
      },
      {
        id: "java-types-multi-dimensional-arrays",
        markdownPath:
          "app/notes/content/software/java/2-types/9_Multi-dimensional_Arrays.md",
      },
      {
        id: "java-types-constants",
        markdownPath: "app/notes/content/software/java/2-types/10_Constants.md",
      },
      {
        id: "java-types-arithmetic-expressions",
        markdownPath:
          "app/notes/content/software/java/2-types/11_Arithmetic_Expressions.md",
      },
      {
        id: "java-types-order-of-operations",
        markdownPath:
          "app/notes/content/software/java/2-types/12_Order_Of_Operations.md",
      },
      {
        id: "java-types-casting",
        markdownPath: "app/notes/content/software/java/2-types/13_Casting.md",
      },
      {
        id: "java-types-the-math-class",
        markdownPath:
          "app/notes/content/software/java/2-types/14_The_Math_Class.md",
      },
      {
        id: "java-types-formatting-numbers",
        markdownPath:
          "app/notes/content/software/java/2-types/15_Formatting_Numbers.md",
      },
      {
        id: "java-types-reading-input",
        markdownPath:
          "app/notes/content/software/java/2-types/16_Reading_Input.md",
      },
      {
        id: "java-types-project-mortgage-calculator",
        markdownPath:
          "app/notes/content/software/java/2-types/17_Project_Mortgage_Calculator.md",
      },
    ],
  }),
  javaChapter({
    id: "java-control-flow",
    label: "Control Flow",
    items: [
      {
        id: "java-control-flow-introduction",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/1_Introduction.md",
      },
      {
        id: "java-control-flow-comparison-operators",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/2_Comparison_Operators.md",
      },
      {
        id: "java-control-flow-logical-operators",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/3_Logical_Operators.md",
      },
      {
        id: "java-control-flow-if-statements",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/4_If_Statements.md",
      },
      {
        id: "java-control-flow-simplifying-if-statements",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/5_Simplifying_If_Statements.md",
      },
      {
        id: "java-control-flow-ternary-operator",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/6_The_Ternary_Operator.md",
      },
      {
        id: "java-control-flow-switch-statements",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/7_Switch_Statements.md",
      },
      {
        id: "java-control-flow-exercise-fizzbuzz",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/8_Exercise_FizzBuzz.md",
      },
      {
        id: "java-control-flow-for-loops",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/9_For_Loops.md",
      },
      {
        id: "java-control-flow-while-loops",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/10_While_Loops.md",
      },
      {
        id: "java-control-flow-do-while-loops",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/11_Do_While_Loops.md",
      },
      {
        id: "java-control-flow-break-and-continue",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/12_Break_and_Continue_Statements.md",
      },
      {
        id: "java-control-flow-for-each-loop",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/13_For-Each_Loop.md",
      },
      {
        id: "java-control-flow-project-mortgage-calculator",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/14_Project_Mortgage_Calculator.md",
      },
      {
        id: "java-control-flow-solution",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/15_Solution.md",
      },
      {
        id: "java-control-flow-summary",
        markdownPath:
          "app/notes/content/software/java/3-control-flow/16_Summary.md",
      },
    ],
  }),
  javaChapter({
    id: "java-clean-coding",
    label: "Clean Coding",
    items: [
      {
        id: "java-clean-coding-introduction",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/1_Introduction.md",
      },
      {
        id: "java-clean-coding-clean-coding",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/2_Clean_Coding.md",
      },
      {
        id: "java-clean-coding-creating-methods",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/3_Creating_Methods.md",
      },
      {
        id: "java-clean-coding-refactoring",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/4_Refactoring.md",
      },
      {
        id: "java-clean-coding-extracting-methods",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/5_Extracting_Methods.md",
      },
      {
        id: "java-clean-coding-refactoring-repetitive-patterns",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/6_Refactoring_Repetitive_Patterns.md",
      },
      {
        id: "java-clean-coding-project-payment-schedule",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/7_Project_Payment_Schedule.md",
      },
      {
        id: "java-clean-coding-solution",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/8_Solution.md",
      },
      {
        id: "java-clean-coding-refactoring-the-code",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/9_Refactoring_the_Code.md",
      },
      {
        id: "java-clean-coding-summary",
        markdownPath:
          "app/notes/content/software/java/4-clean-coding/10_Summary.md",
      },
    ],
  }),
  javaChapter({
    id: "java-debugging-and-deploying-applications",
    label: "Debugging & Deploying applications",
    items: [
      {
        id: "java-debugging-introduction",
        markdownPath:
          "app/notes/content/software/java/5-debugging-and-deploying-applications/1_Introduction.md",
      },
      {
        id: "java-debugging-types-of-errors",
        markdownPath:
          "app/notes/content/software/java/5-debugging-and-deploying-applications/2_Types_of_Errors.md",
      },
      {
        id: "java-debugging-common-syntax-errors",
        markdownPath:
          "app/notes/content/software/java/5-debugging-and-deploying-applications/3_Common_Syntax_Errors.md",
      },
      {
        id: "java-debugging-debugging-java-applications",
        markdownPath:
          "app/notes/content/software/java/5-debugging-and-deploying-applications/4_Debugging_Java_Applications.md",
      },
      {
        id: "java-debugging-packaging-java-applications",
        markdownPath:
          "app/notes/content/software/java/5-debugging-and-deploying-applications/5_Packaging_Java_Applications.md",
      },
      {
        id: "java-debugging-course-wrap-up",
        markdownPath:
          "app/notes/content/software/java/5-debugging-and-deploying-applications/6_Course_Wrap_Up.md",
      },
    ],
  }),
];

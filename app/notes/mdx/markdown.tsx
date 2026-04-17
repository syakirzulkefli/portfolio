/* eslint-disable @next/next/no-img-element */
import type { Element, Root, RootContent } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { unified } from "unified";

const cx = (...parts: Array<string | undefined | null | false>) =>
  parts.filter(Boolean).join(" ");

const DEFAULT_HIGHLIGHT_COLOR = "#facc15";

const isSafeHighlightColor = (value: string) => {
  const color = value.trim();
  if (!color) return false;
  return (
    /^#[0-9a-f]{3,8}$/i.test(color) ||
    /^rgb(a)?\([\d\s.,%]+\)$/i.test(color) ||
    /^hsl(a)?\([\d\s.,%]+\)$/i.test(color) ||
    /^[a-z]+$/i.test(color)
  );
};

const parseHighlightSegments = (value: string): RootContent[] => {
  const pattern = /==([\s\S]+?)==(?:\{([^}]+)\})?/g;
  const nodes: RootContent[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
    }

    const text = (match[1] || "").trim();
    const requestedColor = (match[2] || "").trim();
    const color = isSafeHighlightColor(requestedColor)
      ? requestedColor
      : DEFAULT_HIGHLIGHT_COLOR;

    if (text) {
      nodes.push({
        type: "element",
        tagName: "mark",
        properties: {
          "data-highlight-color": color,
        },
        children: [{ type: "text", value: text }],
      });
    } else {
      nodes.push({ type: "text", value: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: "text", value }];
};

const applyTextHighlights = (node: Root | Element) => {
  const nextChildren: RootContent[] = [];

  for (const child of node.children) {
    if (child.type === "text") {
      nextChildren.push(...parseHighlightSegments(child.value));
      continue;
    }

    if (
      child.type === "element" &&
      child.tagName !== "code" &&
      child.tagName !== "pre"
    ) {
      applyTextHighlights(child);
    }

    nextChildren.push(child);
  }

  node.children = nextChildren;
};

type HighlightTokenType = "comment" | "string" | "keyword" | "number";

const highlightJava = (code: string): ReactNode => {
  const keywords = [
    "abstract",
    "assert",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "continue",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extends",
    "final",
    "finally",
    "float",
    "for",
    "goto",
    "if",
    "implements",
    "import",
    "instanceof",
    "int",
    "interface",
    "long",
    "native",
    "new",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "strictfp",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "try",
    "void",
    "volatile",
    "while",
  ] as const;

  const keywordAlternation = keywords.join("|");
  const tokenRe = new RegExp(
    [
      "(\\/\\*[\\s\\S]*?\\*\\/)", // block comment
      "(\\/\\/[^\\n]*)", // line comment
      '("(?:\\\\.|[^"\\\\])*")', // string
      "('(?:\\\\.|[^'\\\\])*')", // char
      `\\b(${keywordAlternation})\\b`, // keyword
      "\\b(\\d+(?:\\.\\d+)?)\\b", // number
    ].join("|"),
    "g"
  );

  const classForType: Record<HighlightTokenType, string> = {
    comment: "text-slate-400 italic",
    string: "text-amber-300",
    keyword: "text-sky-300 font-semibold",
    number: "text-fuchsia-300",
  };

  const nodes: Array<string | ReactElement> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }

    const raw = match[0];
    const type: HighlightTokenType =
      raw.startsWith("/*") || raw.startsWith("//")
        ? "comment"
        : raw.startsWith('"') || raw.startsWith("'")
          ? "string"
          : keywords.includes(raw as (typeof keywords)[number])
            ? "keyword"
            : "number";

    nodes.push(
      <span key={`${match.index}-${raw.length}`} className={classForType[type]}>
        {raw}
      </span>
    );

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
  return nodes;
};

const highlightCode = (code: string, language: string | null): ReactNode => {
  if (!language) return code;
  if (language === "java") return highlightJava(code);
  return code;
};

const Anchor = ({
  href,
  className,
  ...props
}: ComponentProps<"a">): ReactElement<ComponentProps<"a">> => {
  const isExternal =
    typeof href === "string" &&
    (href.startsWith("http://") || href.startsWith("https://"));
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer noopener" : undefined}
      className={cx(
        "text-sky-400 underline underline-offset-4 hover:text-sky-300",
        className
      )}
      {...props}
    />
  );
};

const InlineCode = ({ className, ...props }: ComponentProps<"code">) => (
  <code
    className={cx(
      "rounded border border-[var(--note-inline-code-border)] bg-[var(--note-inline-code-bg)] px-1.5 py-0.5 font-mono text-[0.95em] text-[var(--note-inline-code-text)]",
      className
    )}
    {...props}
  />
);

const Code = ({ className, children, ...props }: ComponentProps<"code">) => {
  const text = Array.isArray(children)
    ? children.join("")
    : typeof children === "string"
      ? children
      : "";
  const isBlock = !!className || text.includes("\n");
  if (isBlock) {
    const language =
      className?.match(/language-([a-z0-9-]+)/i)?.[1]?.toLowerCase() ?? null;
    const highlighted =
      typeof text === "string" ? highlightCode(text, language) : children;
    return (
      <code className={cx("font-mono", className)} {...props}>
        {highlighted}
      </code>
    );
  }
  return (
    <InlineCode className={className} {...props}>
      {children}
    </InlineCode>
  );
};

const Pre = ({ className, ...props }: ComponentProps<"pre">) => (
  <pre
    className={cx(
      "overflow-x-auto rounded-xl border border-[var(--note-code-border)] bg-[var(--note-code-bg)] p-4 text-[13px] leading-[1.6] text-[var(--note-code-text)]",
      className
    )}
    {...props}
  />
);

const Mark = ({
  className,
  children,
  ...props
}: ComponentProps<"mark"> & {
  "data-highlight-color"?: string;
}) => {
  const highlightColor =
    typeof props["data-highlight-color"] === "string" &&
    isSafeHighlightColor(props["data-highlight-color"])
      ? props["data-highlight-color"]
      : DEFAULT_HIGHLIGHT_COLOR;

  return (
    <mark
      className={cx(
        "rounded px-1 py-0.5 text-slate-950 shadow-[inset_0_-1px_0_rgba(15,23,42,0.18)]",
        className
      )}
      style={{ backgroundColor: highlightColor }}
      {...props}
    >
      {children}
    </mark>
  );
};

export const markdownComponents = {
  a: Anchor,
  h1: ({ className, ...props }: ComponentProps<"h1">) => (
    <h2
      className={cx(
        "mt-6 text-2xl font-semibold text-[var(--note-heading-text)]",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h3
      className={cx(
        "mt-6 text-lg font-semibold text-[var(--note-heading-text)]",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p className={cx("whitespace-normal", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={cx("list-disc list-outside space-y-2 pl-6", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cx("list-decimal list-outside space-y-2 pl-6", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentProps<"li">) => (
    <li className={cx("whitespace-normal", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cx(
        "border-l-2 border-[var(--note-blockquote-border)] pl-4 text-[var(--note-blockquote-text)]",
        className
      )}
      {...props}
    />
  ),
  code: Code,
  pre: Pre,
  mark: Mark,
  img: ({ className, ...props }: ComponentProps<"img">) => (
    <img
      alt=""
      loading="lazy"
      className={cx(
        "h-auto w-full rounded-2xl border border-[var(--note-img-border)]",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentProps<"hr">) => (
    <hr className={cx("border-[var(--note-hr)]", className)} {...props} />
  ),
} as const;

export const renderMarkdownToJsx = async (
  source: string,
  options: { suppressFirstHeading?: boolean } = {}
): Promise<ReactElement> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype);

  const tree = (await processor.run(processor.parse(source))) as Root;
  applyTextHighlights(tree);
  if (options.suppressFirstHeading) {
    const firstMeaningfulNodeIndex = tree.children.findIndex((node) => {
      if (node.type === "text") return node.value.trim().length > 0;
      return true;
    });
    if (firstMeaningfulNodeIndex >= 0) {
      const node = tree.children[firstMeaningfulNodeIndex];
      if (node.type === "element" && node.tagName === "h1") {
        tree.children.splice(firstMeaningfulNodeIndex, 1);
      }
    }
  }
  const content = toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: markdownComponents,
  });

  return <div className="space-y-4">{content}</div>;
};

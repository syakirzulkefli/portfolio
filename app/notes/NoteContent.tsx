"use client";

import MdxPreviewClient from "./mdx/MdxPreviewClient";
import { isRichHtmlContent } from "./content-format";

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const decodeHtml = (value: string) =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const syntaxStyleByToken: Record<string, string> = {
  comment: "color:var(--note-syntax-comment,#94a3b8);font-style:italic",
  string: "color:var(--note-syntax-string,#86efac)",
  keyword:
    "color:var(--note-syntax-keyword,#7dd3fc);font-weight:600",
  number: "color:var(--note-syntax-number,#f0abfc)",
  type: "color:var(--note-syntax-type,#fde68a)",
  function: "color:var(--note-syntax-function,#38bdf8)",
};

const syntaxSpan = (token: string, tokenType: string) =>
  `<span style="${syntaxStyleByToken[tokenType] ?? ""}">${escapeHtml(token)}</span>`;

const highlightCodeHtml = (code: string, language: string | null) => {
  const normalizedLanguage = language?.toLowerCase() ?? "";
  const keywordSets: Record<string, string[]> = {
    java: [
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
    ],
    javascript: [
      "async",
      "await",
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "default",
      "else",
      "export",
      "extends",
      "finally",
      "for",
      "from",
      "function",
      "if",
      "import",
      "let",
      "new",
      "return",
      "switch",
      "throw",
      "try",
      "var",
      "while",
    ],
    sql: [
      "alter",
      "and",
      "as",
      "between",
      "by",
      "create",
      "delete",
      "drop",
      "from",
      "group",
      "having",
      "in",
      "insert",
      "into",
      "is",
      "join",
      "like",
      "limit",
      "not",
      "null",
      "or",
      "order",
      "select",
      "set",
      "table",
      "update",
      "values",
      "where",
    ],
  };
  const languageKey =
    normalizedLanguage === "js" ? "javascript" : normalizedLanguage;
  const keywords = keywordSets[languageKey] ?? [
    ...keywordSets.java,
    ...keywordSets.javascript,
    ...keywordSets.sql,
  ];
  const keywordAlternation = [...new Set(keywords)].join("|");
  const tokenRe = new RegExp(
    [
      "(\\/\\*[\\s\\S]*?\\*\\/)",
      "(\\/\\/[^\\n]*)",
      "(--[^\\n]*)",
      '("(?:\\\\.|[^"\\\\])*")',
      "('(?:\\\\.|[^'\\\\])*')",
      `\\b(${keywordAlternation})\\b`,
      "\\b([A-Z][A-Za-z0-9_]*)\\b",
      "\\b([a-zA-Z_$][\\w$]*)(?=\\s*\\()",
      "\\b(\\d+(?:\\.\\d+)?)\\b",
    ].join("|"),
    "gi"
  );

  let highlighted = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(code)) !== null) {
    if (match.index > lastIndex) {
      highlighted += escapeHtml(code.slice(lastIndex, match.index));
    }

    const raw = match[0];
    const lower = raw.toLowerCase();
    const type =
      raw.startsWith("/*") || raw.startsWith("//") || raw.startsWith("--")
        ? "comment"
        : raw.startsWith('"') || raw.startsWith("'")
          ? "string"
          : keywords.includes(lower)
            ? "keyword"
            : /^\d/.test(raw)
              ? "number"
              : /^[A-Z]/.test(raw)
                ? "type"
                : "function";

    highlighted += syntaxSpan(raw, type);
    lastIndex = match.index + raw.length;
  }

  if (lastIndex < code.length) highlighted += escapeHtml(code.slice(lastIndex));
  return highlighted;
};

const languageFromAttributes = (attributes: string) =>
  attributes
    .match(/class=(["'])(.*?)\1/i)?.[2]
    ?.split(/\s+/)
    .find((className) => className.startsWith("language-"))
    ?.replace(/^language-/, "") ?? null;

const highlightRichCodeBlocks = (source: string) =>
  source.replace(
    /<pre([^>]*)>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (match, preAttributes: string, codeAttributes: string, rawCode: string) => {
      const language =
        languageFromAttributes(codeAttributes) ??
        languageFromAttributes(preAttributes);
      const highlighted = highlightCodeHtml(decodeHtml(rawCode), language);
      return `<pre${preAttributes}><code${codeAttributes}>${highlighted}</code></pre>`;
    }
  );

function RichHtmlContent({ source }: { source: string }) {
  return (
    <div
      className={cx(
        "max-w-none text-[15px] text-[var(--note-body-text,rgb(226,232,240))]",
        "[&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-[1.2] [&_h1]:text-[var(--note-heading-text)]",
        "[&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:leading-[1.2] [&_h2]:text-[var(--note-heading-text)]",
        "[&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:leading-[1.2] [&_h3]:text-[var(--note-heading-text)]",
        "[&_p]:my-2 [&_p]:whitespace-pre-wrap [&_p]:leading-[1.25] [&_p:empty]:min-h-[1.25em]",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-0.5 [&_li]:leading-[1.25]",
        "[&_a]:text-sky-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-sky-300",
        "[&_mark]:rounded [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:text-slate-950",
        "[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--note-blockquote-border)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--note-blockquote-text)]",
        "[&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-[var(--note-img-border)]",
        "[&_hr]:my-6 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[var(--note-hr)]",
        "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--note-code-border)] [&_pre]:bg-[var(--note-code-bg)] [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-[1.35] [&_pre]:text-[var(--note-code-text)]",
        "[&_code]:rounded [&_code]:border [&_code]:border-[var(--note-inline-code-border)] [&_code]:bg-[var(--note-inline-code-bg)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.95em] [&_code]:text-[var(--note-inline-code-text)]",
        "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit"
      )}
      dangerouslySetInnerHTML={{ __html: highlightRichCodeBlocks(source) }}
    />
  );
}

export default function NoteContent({
  source,
  suppressFirstHeading = false,
}: {
  source: string;
  suppressFirstHeading?: boolean;
}) {
  if (isRichHtmlContent(source)) {
    return <RichHtmlContent source={source} />;
  }

  return (
    <MdxPreviewClient
      source={source}
      suppressFirstHeading={suppressFirstHeading}
    />
  );
}

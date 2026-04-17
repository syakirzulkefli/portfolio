import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const DEFAULT_HIGHLIGHT_COLOR = "#facc15";

const RICH_HTML_TAG_RE =
  /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|code|img|figure|br|strong|em|a|mark|span)(\s|>)/i;
const LEGACY_HIGHLIGHT_RE = /==([\s\S]+?)==(?:\{([^}]+)\})?/g;

const decodeBasicEntities = (value: string) =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const stripMarkdownSyntax = (source: string) =>
  source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripHtmlToText = (source: string) =>
  decodeBasicEntities(
    source
      .replace(/<(br|hr)\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|blockquote|pre|h[1-6])>/gi, "\n")
      .replace(/<img\b[^>]*alt="([^"]*)"[^>]*>/gi, " $1 ")
      .replace(/<img\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

export const isRichHtmlContent = (source: string) => RICH_HTML_TAG_RE.test(source);

export const stripContentToPlainText = (source: string) => {
  if (!source.trim()) return "";
  return isRichHtmlContent(source)
    ? stripHtmlToText(source)
    : stripMarkdownSyntax(source);
};

export const deriveSummaryFromContent = (source: string) => {
  const text = stripContentToPlainText(source);
  if (!text) return "";
  return text.length > 180 ? `${text.slice(0, 177).trimEnd()}...` : text;
};

export const normalizeRichTextHtml = (html: string) => {
  const trimmed = html.trim();
  if (
    !trimmed ||
    trimmed === "<p></p>" ||
    trimmed === "<p><br></p>" ||
    trimmed === "<p> </p>"
  ) {
    return "";
  }
  return trimmed;
};

export const markdownToRichHtml = async (source: string) => {
  const trimmed = source.trim();
  if (!trimmed) return "";

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(source);

  const withLegacyHighlights = String(file).replace(
    LEGACY_HIGHLIGHT_RE,
    (_, text: string, color?: string) => {
      const normalizedColor = (color || "").trim();
      const style = normalizedColor
        ? ` style="background-color:${normalizedColor}"`
        : "";
      return `<mark${style}>${text}</mark>`;
    }
  );

  return normalizeRichTextHtml(withLegacyHighlights);
};

export const toEditableRichContent = async (source: string) => {
  if (!source.trim()) return "";
  if (isRichHtmlContent(source)) return normalizeRichTextHtml(source);
  return markdownToRichHtml(source);
};

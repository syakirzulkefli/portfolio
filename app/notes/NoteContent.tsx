"use client";

import MdxPreviewClient from "./mdx/MdxPreviewClient";
import { isRichHtmlContent } from "./content-format";

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

function RichHtmlContent({ source }: { source: string }) {
  return (
    <div
      className={cx(
        "max-w-none text-[15px] text-[var(--note-body-text,rgb(226,232,240))]",
        "[&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-[var(--note-heading-text)]",
        "[&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--note-heading-text)]",
        "[&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--note-heading-text)]",
        "[&_p]:my-4 [&_p]:whitespace-pre-wrap [&_p]:leading-7",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1 [&_li]:leading-7",
        "[&_a]:text-sky-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-sky-300",
        "[&_mark]:rounded [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:text-slate-950",
        "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--note-blockquote-border)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--note-blockquote-text)]",
        "[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-[var(--note-img-border)]",
        "[&_hr]:my-6 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[var(--note-hr)]",
        "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--note-code-border)] [&_pre]:bg-[var(--note-code-bg)] [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-[1.6] [&_pre]:text-[var(--note-code-text)]",
        "[&_code]:rounded [&_code]:border [&_code]:border-[var(--note-inline-code-border)] [&_code]:bg-[var(--note-inline-code-bg)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.95em] [&_code]:text-[var(--note-inline-code-text)]",
        "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit"
      )}
      dangerouslySetInnerHTML={{ __html: source }}
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

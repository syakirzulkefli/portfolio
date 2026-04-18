"use client";

import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";

import {
  DEFAULT_HIGHLIGHT_COLOR,
  normalizeRichTextHtml,
  toEditableRichContent,
} from "./content-format";

export type RichTextEditorHandle = {
  focus: () => void;
  applyHighlight: (color: string) => boolean;
  updateHighlightColor: (color: string) => boolean;
  removeHighlight: () => boolean;
  insertImageFromFile: (file: File) => Promise<boolean>;
  insertLink: (href: string, label?: string) => boolean;
};

const editorHtmlClassName = (isDark: boolean) =>
  [
    "min-h-[320px] rounded-2xl border px-3 py-3 text-[15px] leading-7 outline-none sm:min-h-[420px] sm:px-4",
    "max-w-none",
    "[&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold",
    "[&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold",
    "[&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold",
    "[&_p]:my-4 [&_p]:whitespace-pre-wrap",
    "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
    "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
    "[&_li]:my-1",
    "[&_a]:text-sky-400 [&_a]:underline [&_a]:underline-offset-4",
    "[&_mark]:rounded [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:text-slate-950",
    "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-400/50 [&_blockquote]:pl-4",
    "[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-700",
    "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-[1.6]",
    "[&_code]:rounded [&_code]:border [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.95em]",
    "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
    isDark
      ? "border-slate-800 bg-slate-900 text-slate-100 focus:border-sky-500 focus:ring focus:ring-sky-500/20 [&_blockquote]:text-slate-300 [&_pre]:border-slate-800 [&_pre]:bg-slate-950/70 [&_code]:border-slate-800 [&_code]:bg-slate-950/70"
      : "border-slate-300 bg-white text-slate-900 focus:border-sky-500 focus:ring focus:ring-sky-500/20 [&_blockquote]:text-slate-600 [&_pre]:border-slate-200 [&_pre]:bg-slate-50 [&_code]:border-slate-200 [&_code]:bg-slate-50",
  ].join(" ");

const getActiveHighlightColor = (editor: Editor) => {
  if (!editor.isActive("highlight")) return null;
  const attributes = editor.getAttributes("highlight") as {
    color?: string;
  };
  return typeof attributes.color === "string" && attributes.color.trim()
    ? attributes.color
    : DEFAULT_HIGHLIGHT_COLOR;
};

const normalizeSelectedHref = (href: string) => href.trim();

const normalizeUploadError = (error?: string, details?: string) => {
  if (details?.trim()) return `${error || "Upload failed."}: ${details.trim()}`;
  return error || "Upload failed.";
};

const RichTextEditor = forwardRef<RichTextEditorHandle, {
  value: string;
  isDark: boolean;
  onChange: (value: string) => void;
  onError: (message: string | null) => void;
  onBusyChange: (busy: boolean) => void;
  onActiveHighlightColorChange: (color: string | null) => void;
}>(
  (
    {
      value,
      isDark,
      onChange,
      onError,
      onBusyChange,
      onActiveHighlightColorChange,
    },
    ref
  ) => {
    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Highlight.configure({ multicolor: true }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        }),
        Image,
      ],
      content: "",
      editorProps: {
        attributes: {
          class: editorHtmlClassName(isDark),
        },
        handlePaste: (_, event) => {
          const files = Array.from(event.clipboardData?.files ?? []).filter(
            (file) => file.type.startsWith("image/")
          );
          if (files.length === 0) return false;
          event.preventDefault();
          void uploadAndInsertImage(files[0]);
          return true;
        },
        handleDrop: (view, event) => {
          const files = Array.from(event.dataTransfer?.files ?? []).filter(
            (file) => file.type.startsWith("image/")
          );
          if (files.length === 0) return false;
          event.preventDefault();
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          void uploadAndInsertImage(files[0], coordinates?.pos ?? null);
          return true;
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        const nextHtml = normalizeRichTextHtml(currentEditor.getHTML());
        onChange(nextHtml);
      },
      onSelectionUpdate: ({ editor: currentEditor }) => {
        onActiveHighlightColorChange(getActiveHighlightColor(currentEditor));
      },
      onCreate: ({ editor: currentEditor }) => {
        onActiveHighlightColorChange(getActiveHighlightColor(currentEditor));
      },
    });

    const uploadAndInsertImage = useCallback(
      async (file: File, position?: number | null) => {
        if (!editor) return false;

        onBusyChange(true);
        onError(null);

        try {
          const body = new FormData();
          body.append("file", file);
          const response = await fetch("/api/notes/admin/uploads", {
            method: "POST",
            body,
          });
          const payload = (await response.json()) as {
            ok?: boolean;
            url?: string;
            error?: string;
            details?: string;
          };
          if (!response.ok || !payload.ok || !payload.url) {
            onError(normalizeUploadError(payload.error, payload.details));
            return false;
          }

          const chain = editor.chain().focus();
          if (typeof position === "number") {
            chain.setTextSelection(position);
          }
          chain
            .setImage({
              src: payload.url,
              alt: file.name ? file.name.replace(/\.[^/.]+$/, "") : "image",
            })
            .run();
          return true;
        } catch {
          onError("Upload failed.");
          return false;
        } finally {
          onBusyChange(false);
        }
      },
      [editor, onBusyChange, onError]
    );

    useEffect(() => {
      if (!editor) return;

      let cancelled = false;
      void (async () => {
        const editableValue = await toEditableRichContent(value);
        if (cancelled) return;
        const normalizedTarget = normalizeRichTextHtml(editableValue);
        const normalizedCurrent = normalizeRichTextHtml(editor.getHTML());
        if (normalizedCurrent === normalizedTarget) {
          onActiveHighlightColorChange(getActiveHighlightColor(editor));
          return;
        }

        editor.commands.setContent(editableValue || "<p></p>", {
          emitUpdate: false,
        });
        if (normalizeRichTextHtml(value) !== normalizedTarget) {
          onChange(normalizedTarget);
        }
        onActiveHighlightColorChange(getActiveHighlightColor(editor));
      })();

      return () => {
        cancelled = true;
      };
    }, [editor, onActiveHighlightColorChange, onChange, value]);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          editor?.chain().focus().run();
        },
        applyHighlight: (color: string) => {
          if (!editor) return false;
          onError(null);
          const selection = editor.state.selection;
          if (selection.empty && !editor.isActive("highlight")) {
            return false;
          }

          const chain = editor.chain().focus();
          if (editor.isActive("highlight")) {
            chain.extendMarkRange("highlight");
          }
          const didRun = chain.setHighlight({ color }).run();
          onActiveHighlightColorChange(getActiveHighlightColor(editor));
          return didRun;
        },
        updateHighlightColor: (color: string) => {
          if (!editor || !editor.isActive("highlight")) return false;
          const didRun = editor
            .chain()
            .focus()
            .extendMarkRange("highlight")
            .setHighlight({ color })
            .run();
          onActiveHighlightColorChange(getActiveHighlightColor(editor));
          return didRun;
        },
        removeHighlight: () => {
          if (!editor) return false;
          onError(null);
          const selection = editor.state.selection;
          if (selection.empty && !editor.isActive("highlight")) {
            return false;
          }

          const chain = editor.chain().focus();
          if (editor.isActive("highlight")) {
            chain.extendMarkRange("highlight");
          }
          const didRun = chain.unsetHighlight().run();
          onActiveHighlightColorChange(getActiveHighlightColor(editor));
          return didRun;
        },
        insertImageFromFile: (file: File) => uploadAndInsertImage(file),
        insertLink: (href: string, label?: string) => {
          if (!editor) return false;
          const normalizedHref = normalizeSelectedHref(href);
          if (!normalizedHref) return false;

          const selection = editor.state.selection;
          if (selection.empty) {
            const text = label?.trim() || normalizedHref;
            return editor
              .chain()
              .focus()
              .insertContent({
                type: "text",
                text,
                marks: [{ type: "link", attrs: { href: normalizedHref } }],
              })
              .run();
          }

          return editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: normalizedHref })
            .run();
        },
      }),
      [editor, onActiveHighlightColorChange, onError, uploadAndInsertImage]
    );

    return <EditorContent editor={editor} />;
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;

"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";

import { renderMarkdownToJsx } from "./markdown";

export default function MdxPreviewClient({
  source,
  suppressFirstHeading = false,
}: {
  source: string;
  suppressFirstHeading?: boolean;
}) {
  const [content, setContent] = useState<ReactElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    setContent(null);

    renderMarkdownToJsx(source, { suppressFirstHeading })
      .then((rendered) => {
        if (active) setContent(rendered);
      })
      .catch(() => {
        if (active) setError("Failed to render preview.");
      });

    return () => {
      active = false;
    };
  }, [source, suppressFirstHeading]);

  if (error) {
    return (
      <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
        {error}
      </p>
    );
  }

  if (!content) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
        Rendering preview...
      </p>
    );
  }

  return content;
}

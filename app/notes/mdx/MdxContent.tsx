import "server-only";

import type { ReactElement } from "react";

import { renderMarkdownToJsx } from "./markdown";

export default async function MdxContent({
  source,
  suppressFirstHeading = false,
}: {
  source: string;
  suppressFirstHeading?: boolean;
}): Promise<ReactElement> {
  return renderMarkdownToJsx(source, { suppressFirstHeading });
}

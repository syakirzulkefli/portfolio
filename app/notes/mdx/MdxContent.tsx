import "server-only";

import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import type { ComponentProps, ReactElement } from "react";
import * as runtime from "react/jsx-runtime";

const cx = (...parts: Array<string | undefined | null | false>) =>
  parts.filter(Boolean).join(" ");

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
    return (
      <code className={cx("font-mono", className)} {...props}>
        {children}
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

const components = {
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
    <p className={cx("whitespace-pre-wrap", className)} {...props} />
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
    <li className={cx("whitespace-pre-wrap", className)} {...props} />
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

export default async function MdxContent({
  source,
}: {
  source: string;
}): Promise<ReactElement> {
  const { default: Content } = (await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    development: false,
  })) as unknown as {
    default: (props: { components?: object }) => ReactElement;
  };

  return (
    <div className="space-y-4">
      <Content components={components} />
    </div>
  );
}

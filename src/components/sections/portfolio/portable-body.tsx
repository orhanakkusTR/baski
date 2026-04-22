import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-pretty text-body-lg text-stone">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-h2 text-ink">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-h3 text-ink">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-gold pl-5 font-display text-h3 italic text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex flex-col gap-2 pl-5 text-body-lg text-stone [&>li]:list-disc">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="flex flex-col gap-2 pl-5 text-body-lg text-stone [&>li]:list-decimal">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-ink font-medium">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const blank = value?.blank !== false;
      return (
        <a
          href={href}
          target={blank ? "_blank" : undefined}
          rel={blank ? "noopener noreferrer" : undefined}
          className="text-ink underline decoration-gold underline-offset-[0.2em] transition-opacity hover:opacity-80"
        >
          {children}
        </a>
      );
    },
  },
};

/**
 * Renders a Portable Text array with brand-consistent typography.
 *
 * Use for `challenge`, `solution`, `results` and any other long-form
 * rich-text field from Sanity. Deliberately limited component set —
 * mirrors the blockContent schema (H2/H3/blockquote + lists + links).
 */
export function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      <PortableText value={value} components={components} />
    </div>
  );
}

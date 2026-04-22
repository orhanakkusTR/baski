import { cn } from "@/lib/utils";

interface HeadingDotProps {
  children: string;
  className?: string;
}

/**
 * Renders a heading string with its trailing period swapped for a small
 * gold dot — the same mark used in the AW AB wordmark. Signs each section
 * title with a brand stamp instead of an ordinary full stop. If the input
 * does not end in a period (e.g. ends with "?"), the text renders
 * unchanged. Dot is em-relative so it tracks the surrounding heading size.
 */
export function HeadingDot({ children, className }: HeadingDotProps) {
  const trimmed = children.trimEnd();
  if (!trimmed.endsWith(".")) {
    return <>{children}</>;
  }
  return (
    <>
      {trimmed.slice(0, -1)}
      <span
        aria-hidden
        className={cn(
          "ml-[0.06em] inline-block size-[0.22em] rounded-full bg-gold align-baseline",
          className,
        )}
      />
    </>
  );
}

import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  tone?: "ink" | "paper";
  size?: "sm" | "md" | "lg";
  className?: string;
  withMark?: boolean;
}

const sizeMap = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl md:text-2xl",
} as const;

export function Logo({
  href = "/",
  tone = "ink",
  size = "md",
  className,
  withMark = true,
}: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 font-display font-medium tracking-[-0.01em]",
        tone === "ink" ? "text-ink" : "text-paper",
        sizeMap[size],
      )}
    >
      <span aria-hidden="true">AW</span>
      <span
        aria-hidden="true"
        className="text-stone font-mono text-[0.55em] uppercase tracking-[0.2em] translate-y-[-0.1em]"
      >
        AB
      </span>
      <span className="sr-only">AW AB</span>
      {withMark ? (
        <span
          aria-hidden
          className={cn(
            "ml-1 inline-block size-1.5 translate-y-[-0.2em] rounded-full",
            tone === "ink" ? "bg-gold" : "bg-gold",
          )}
        />
      ) : null}
    </span>
  );

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="AW AB — Home"
      className={cn(
        "inline-flex items-center transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        className,
      )}
    >
      {content}
    </Link>
  );
}

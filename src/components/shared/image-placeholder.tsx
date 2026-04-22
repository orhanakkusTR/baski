import { cn } from "@/lib/utils";

type Aspect =
  | "square"
  | "portrait"
  | "landscape"
  | "4/5"
  | "4/3"
  | "3/2"
  | "3/4"
  | "16/10";

interface ImagePlaceholderProps {
  label: string;
  aspect?: Aspect;
  tone?: "bone" | "stone" | "ink" | "paper";
  className?: string;
  /** Rendered inside the slot — e.g., a number or small caption */
  children?: React.ReactNode;
}

const aspectMap: Record<Aspect, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  "3/4": "aspect-[3/4]",
  landscape: "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/10": "aspect-[16/10]",
};

const toneMap = {
  bone: "bg-bone",
  stone: "bg-stone",
  ink: "bg-ink",
  paper: "bg-paper",
} as const;

const textToneMap = {
  bone: "text-stone/50",
  stone: "text-paper/70",
  ink: "text-paper/40",
  paper: "text-stone/50",
} as const;

/**
 * Stand-in for imagery until real assets are delivered. Renders an aspect-
 * ratio box with the brand palette and the contextual label in the centre
 * so it's clear what should go there ("Kartongproduktion · Studio", etc.).
 *
 * Swap usages for <Image src="..." /> once shots are produced.
 */
export function ImagePlaceholder({
  label,
  aspect = "4/5",
  tone = "bone",
  className,
  children,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative w-full overflow-hidden",
        aspectMap[aspect],
        toneMap[tone],
        className,
      )}
    >
      {/* Subtle grain so the surface reads as "photo slot", not "flat block" */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 3px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <span
          className={cn(
            "font-mono text-caption uppercase tracking-[0.2em]",
            textToneMap[tone],
          )}
        >
          {label}
        </span>
      </div>
      {children ? (
        <div className="absolute inset-0 flex">{children}</div>
      ) : null}
    </div>
  );
}

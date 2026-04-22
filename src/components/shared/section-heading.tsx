import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md" | "sm";
  className?: string;
}

const sizeMap = {
  lg: "text-display-lg",
  md: "text-h1",
  sm: "text-h2",
} as const;

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "start",
  as: Tag = "h2",
  size = "md",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-caption uppercase text-stone">
          {eyebrow}
        </span>
      ) : null}
      <Tag
        className={cn(
          "font-display text-balance text-ink",
          sizeMap[size],
        )}
      >
        {heading}
      </Tag>
      {description ? (
        <p className="text-body-lg text-pretty text-stone">{description}</p>
      ) : null}
    </header>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  repeat?: number;
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  repeat = 4,
  className,
  itemClassName,
}: MarqueeProps) {
  const items = Array.from({ length: repeat }, (_, i) => i);

  return (
    <div
      className={cn(
        "group/marquee relative flex w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      style={{
        // @ts-expect-error custom CSS variables for animation
        "--marquee-duration": `${speed}s`,
      }}
    >
      {items.map((key) => (
        <div
          key={key}
          aria-hidden={key > 0}
          className={cn(
            "flex shrink-0 items-center gap-12 pr-12",
            direction === "left"
              ? "animate-[marquee-left_var(--marquee-duration)_linear_infinite]"
              : "animate-[marquee-right_var(--marquee-duration)_linear_infinite]",
            pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
            itemClassName,
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

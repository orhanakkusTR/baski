import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] leading-none",
  {
    variants: {
      tone: {
        ink: "text-ink",
        paper: "text-paper",
        stone: "text-stone",
        gold: "text-gold",
      },
      variant: {
        plain: "",
        outline: "border border-current rounded-sm px-2.5 py-1",
        solid: "",
        dot: "",
      },
    },
    compoundVariants: [
      { variant: "solid", tone: "ink", className: "bg-ink text-paper rounded-sm px-2.5 py-1" },
      { variant: "solid", tone: "paper", className: "bg-paper text-ink rounded-sm px-2.5 py-1" },
      { variant: "solid", tone: "gold", className: "bg-gold text-ink rounded-sm px-2.5 py-1" },
    ],
    defaultVariants: {
      tone: "ink",
      variant: "plain",
    },
  },
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  tone,
  variant,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, variant }), className)} {...props}>
      {variant === "dot" ? (
        <span
          aria-hidden
          className="inline-block size-1.5 rounded-full bg-current"
        />
      ) : null}
      {children}
    </span>
  );
}

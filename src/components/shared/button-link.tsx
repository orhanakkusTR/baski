import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonLinkVariants = cva(
  "group/buttonlink relative inline-flex items-center gap-2 font-sans font-medium transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
  {
    variants: {
      tone: {
        ink: "text-ink hover:text-ink",
        paper: "text-paper hover:text-paper",
        stone: "text-stone hover:text-ink",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      tone: "ink",
      size: "md",
    },
  },
);

type Direction = "right" | "up-right";

interface BaseProps extends VariantProps<typeof buttonLinkVariants> {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  showArrow?: boolean;
}

interface InternalLinkProps extends BaseProps {
  href: string;
  external?: false;
}

interface ExternalLinkProps extends BaseProps {
  href: string;
  external: true;
}

type ButtonLinkProps = InternalLinkProps | ExternalLinkProps;

export function ButtonLink({
  href,
  external,
  tone,
  size,
  direction = "right",
  showArrow = true,
  className,
  children,
}: ButtonLinkProps) {
  const Icon = direction === "up-right" ? ArrowUpRight : ArrowRight;
  const translateClass =
    direction === "up-right"
      ? "group-hover/buttonlink:-translate-y-0.5 group-hover/buttonlink:translate-x-0.5"
      : "group-hover/buttonlink:translate-x-1";

  const content = (
    <>
      <span className="relative">
        <span>{children}</span>
        <span
          aria-hidden
          className="absolute bottom-[-4px] left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/buttonlink:scale-x-100"
        />
      </span>
      {showArrow ? (
        <Icon
          aria-hidden
          className={cn(
            "size-4 transition-transform duration-300 ease-out",
            translateClass,
          )}
        />
      ) : null}
    </>
  );

  const classes = cn(buttonLinkVariants({ tone, size }), className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

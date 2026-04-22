import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * CTA band — presentational, prop-driven so the same band can close any
 * page with its own messaging. Dark ink background with a single gold
 * accent line anchors the brand without splashing accent across a large
 * surface. Dual CTAs: primary (paper fill on ink) + secondary (paper
 * outline). Uses the standard tightened section padding.
 */

interface CtaLink {
  label: string;
  href: StaticPathname;
}

interface CtaBlockProps {
  eyebrow: string;
  heading: string;
  description: string;
  primary: CtaLink;
  secondary: CtaLink;
}

export function CtaBlock({
  eyebrow,
  heading,
  description,
  primary,
  secondary,
}: CtaBlockProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      <Container className="relative py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <div className="flex flex-col gap-8">
            <span aria-hidden className="block h-px w-16 bg-gold" />
            <span className="font-mono text-caption uppercase text-paper/50">
              {eyebrow}
            </span>
            <h2
              id="cta-heading"
              className="max-w-3xl text-balance font-display text-paper text-display-lg hyphens-auto break-words"
            >
              {heading}
            </h2>
          </div>

          <div className="flex flex-col gap-8">
            <p className="max-w-md text-pretty text-body-lg text-paper/70">
              {description}
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href={primary.href}
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "bg-paper text-ink hover:bg-paper/90",
                )}
              >
                {primary.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={secondary.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink",
                )}
              >
                {secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

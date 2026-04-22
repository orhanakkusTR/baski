import { ArrowUpRight, Phone } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { buttonVariants } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ServiceDirectCtaProps {
  eyebrow: string;
  heading: string;
  description: string;
  quoteLabel: string;
  phoneLabel: string;
}

/**
 * Custom-production CTA — different from the standard CtaBlock because
 * the custom brief does not start in an inbox. For prestige/limited-run
 * projects the decision-maker wants voice contact first. So we lift the
 * phone number out of the footer and put it inline at heading scale,
 * with the "Begär offert"-style button as the secondary path. Still
 * dark/ink to match the CtaBlock pattern used at the end of other
 * service pages so the page still reads as "closed."
 */
export function ServiceDirectCta({
  eyebrow,
  heading,
  description,
  quoteLabel,
  phoneLabel,
}: ServiceDirectCtaProps) {
  const { phone, email } = SITE_CONFIG;

  return (
    <section
      aria-labelledby="custom-cta-heading"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      <Container className="relative py-12 md:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
          <div className="flex flex-col gap-8">
            <span aria-hidden className="block h-px w-16 bg-gold" />
            <span className="font-mono text-caption uppercase text-paper/50">
              {eyebrow}
            </span>
            <h2
              id="custom-cta-heading"
              className="max-w-3xl text-balance font-display text-paper text-display-lg hyphens-auto break-words"
            >
              <HeadingDot>{heading}</HeadingDot>
            </h2>
            <p className="max-w-xl text-pretty text-body-lg text-paper/70">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Phone treated as a display unit, not a button-sized CTA —
                it's the primary contact, so it gets the typographic weight
                of a heading. */}
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="group flex flex-col gap-3 border-l-2 border-gold pl-5"
            >
              <span className="inline-flex items-center gap-2 font-mono text-caption uppercase text-paper/60">
                <Phone aria-hidden className="size-3" />
                {phoneLabel}
              </span>
              <span className="font-display text-h2 text-paper underline decoration-transparent underline-offset-[0.2em] transition-[text-decoration-color] duration-300 ease-out group-hover:decoration-gold">
                {phone}
              </span>
            </a>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/quote"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "bg-paper text-ink hover:bg-paper/90",
                )}
              >
                {quoteLabel}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <a
                href={`mailto:${email}`}
                className="font-mono text-caption uppercase text-paper/70 underline underline-offset-[0.25em] decoration-paper/30 transition-colors hover:text-paper hover:decoration-paper"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 04 — CTA band.
 *
 * Dark ink-coloured full-width block that precedes the footer so the page
 * ends with momentum. Two CTAs: primary (paper fill) and secondary (paper
 * outline). A single gold accent line above the heading anchors the brand
 * accent without splashing it across a large surface.
 */
export async function CtaBlock() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      <Container className="relative py-20 md:py-24 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <div className="flex flex-col gap-8">
            {/* Gold accent line */}
            <span
              aria-hidden
              className="block h-px w-16 bg-gold"
            />
            <span className="font-mono text-caption uppercase text-paper/50">
              {t("home.cta.eyebrow")}
            </span>
            <h2
              id="cta-heading"
              className="max-w-3xl text-balance font-display text-paper text-display-lg"
            >
              {t("home.cta.heading")}
            </h2>
          </div>

          <div className="flex flex-col gap-8">
            <p className="max-w-md text-pretty text-body-lg text-paper/70">
              {t("home.cta.description")}
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/quote"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "bg-paper text-ink hover:bg-paper/90",
                )}
              >
                {t("home.cta.primary")}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink",
                )}
              >
                {t("home.cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * 03 — Process teaser.
 *
 * A three-step preview that links to the full /process page. Left side
 * holds the section heading + lede; right side lists three numbered
 * step summaries. The "Se hela processen" link lives at the bottom so
 * the visitor's eye naturally ends on the call-forward.
 */
const steps = ["brief", "concept", "production"] as const;

export async function ProcessTeaser() {
  const t = await getTranslations("about.process");

  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={t("eyebrow")}
            heading={t("heading")}
            description={t("description")}
            size="md"
          />
        </div>

        <div className="flex flex-col">
          <ol className="flex flex-col">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-6 border-t border-ink/10 py-6 last:border-b md:gap-10 md:py-8"
              >
                <span className="font-mono text-caption uppercase text-stone md:min-w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="font-display text-h4 text-ink">
                    {t(`steps.${step}.title`)}
                  </h3>
                  <p className="text-pretty text-body text-stone">
                    {t(`steps.${step}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href="/process"
            className="group mt-8 inline-flex items-center gap-2 self-start font-mono text-caption uppercase text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <span className="relative">
              {t("viewAll")}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Container>
  );
}

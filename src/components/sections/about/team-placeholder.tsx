import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * 04 — Team placeholder.
 *
 * Deliberately minimal — the real team grid needs photography,
 * headshot briefs, and legal clearance (especially for Swedish
 * employment context). Instead of populating a grid of generic
 * placeholder boxes, we state honestly that the team presentation is
 * coming and anchor a small fact ("tolv personer") so the section
 * isn't empty filler.
 */
export async function TeamPlaceholder() {
  const t = await getTranslations("about.team");

  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <SectionHeading
          eyebrow={t("eyebrow")}
          heading={t("heading")}
          size="md"
        />

        <div className="flex flex-col gap-6">
          <p className="max-w-xl text-pretty text-body-lg text-stone">
            {t("description")}
          </p>
          <p className="inline-flex w-fit items-center gap-3 border border-ink/15 px-4 py-2 font-mono text-caption uppercase text-stone">
            <span aria-hidden className="size-1.5 rounded-full bg-gold" />
            {t("status")}
          </p>
        </div>
      </div>
    </Container>
  );
}

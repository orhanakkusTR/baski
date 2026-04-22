import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaBlock } from "@/components/sections/cta-block";
import { ServiceHero } from "@/components/sections/services/service-hero";
import {
  ServiceFeatureList,
  type FeatureListItem,
} from "@/components/sections/services/service-feature-list";
import {
  ServiceMaterials,
  type MaterialGroup,
} from "@/components/sections/services/service-materials";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services.corporate.page.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function ServiceCorporatePage() {
  const t = await getTranslations("services.corporate.page");

  const productKeys = [
    "brochures",
    "folders",
    "notebooks",
    "stationery",
    "event",
  ] as const;
  const products: FeatureListItem[] = productKeys.map((key) => ({
    title: t(`products.items.${key}.title`),
    description: t(`products.items.${key}.description`),
  }));

  const specKeys = ["paper", "finish", "binding"] as const;
  const specs: MaterialGroup[] = specKeys.map((key) => ({
    title: t(`specs.items.${key}.title`),
    description: t(`specs.items.${key}.description`),
    tags: t.raw(`specs.items.${key}.tags`) as string[],
  }));

  const volumeRowKeys = ["small", "medium", "large"] as const;

  return (
    <>
      <ServiceHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        tagline={t("hero.tagline")}
        imageLabel={t("hero.imageLabel")}
      />

      <ServiceFeatureList
        eyebrow={t("products.eyebrow")}
        heading={t("products.heading")}
        description={t("products.description")}
        items={products}
      />

      <ServiceMaterials
        eyebrow={t("specs.eyebrow")}
        heading={t("specs.heading")}
        description={t("specs.description")}
        groups={specs}
      />

      {/* Volume section — unique to corporate-print. Not a price list, a
          posture statement: bigger runs don't mean cheaper finish. */}
      <Container as="section" className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading
            eyebrow={t("volume.eyebrow")}
            heading={t("volume.heading")}
            description={t("volume.description")}
            size="md"
          />
          <ol className="flex flex-col">
            {volumeRowKeys.map((key, i) => (
              <li
                key={key}
                className="flex items-start gap-6 border-t border-ink/10 py-6 last:border-b md:gap-10 md:py-8"
              >
                <span className="font-mono text-caption uppercase text-stone md:min-w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-h4 text-ink">
                      {t(`volume.rows.${key}.range`)}
                    </h3>
                    <span className="font-mono text-caption uppercase text-stone">
                      {t(`volume.rows.${key}.label`)}
                    </span>
                  </div>
                  <p className="text-pretty text-body text-stone">
                    {t(`volume.rows.${key}.note`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-10 max-w-2xl font-mono text-caption uppercase text-stone">
          {t("volume.disclaimer")}
        </p>
      </Container>

      <CtaBlock
        eyebrow={t("cta.eyebrow")}
        heading={t("cta.heading")}
        description={t("cta.description")}
        primary={{ label: t("cta.primary"), href: "/quote" }}
        secondary={{ label: t("cta.secondary"), href: "/contact" }}
      />
    </>
  );
}

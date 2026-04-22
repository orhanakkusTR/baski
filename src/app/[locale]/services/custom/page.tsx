import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ServiceHero } from "@/components/sections/services/service-hero";
import {
  ServiceFeatureList,
  type FeatureListItem,
} from "@/components/sections/services/service-feature-list";
import { ServiceDirectCta } from "@/components/sections/services/service-direct-cta";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services.custom.page.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function ServiceCustomPage() {
  const t = await getTranslations("services.custom.page");

  const exampleKeys = [
    "limitedEdition",
    "prKits",
    "seeding",
    "eventKits",
    "flagship",
  ] as const;
  const examples: FeatureListItem[] = exampleKeys.map((key) => ({
    title: t(`examples.items.${key}.title`),
    description: t(`examples.items.${key}.description`),
  }));

  return (
    <>
      <ServiceHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        tagline={t("hero.tagline")}
        imageLabel={t("hero.imageLabel")}
      />

      {/* Manifesto — the "Ring oss för projekt som kräver något annat"
          statement. Deliberately typographic, no ornamentation. */}
      <Container as="section" className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading
            eyebrow={t("manifesto.eyebrow")}
            heading={t("manifesto.heading")}
            size="md"
          />
          <div className="flex flex-col gap-6 text-body-lg text-stone">
            <p className="text-pretty">{t("manifesto.body.pitch")}</p>
            <p className="text-pretty">{t("manifesto.body.terms")}</p>
            <p className="text-pretty">{t("manifesto.body.close")}</p>
          </div>
        </div>
      </Container>

      <ServiceFeatureList
        eyebrow={t("examples.eyebrow")}
        heading={t("examples.heading")}
        description={t("examples.description")}
        items={examples}
      />

      <ServiceDirectCta
        eyebrow={t("cta.eyebrow")}
        heading={t("cta.heading")}
        description={t("cta.description")}
        quoteLabel={t("cta.quote")}
        phoneLabel={t("cta.phoneLabel")}
      />
    </>
  );
}

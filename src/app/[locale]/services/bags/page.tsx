import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
import {
  ServiceCaseTeaser,
  type CaseTeaserItem,
} from "@/components/sections/services/service-case-teaser";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services.bags.page.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function ServiceBagsPage() {
  const t = await getTranslations("services.bags.page");

  const typeKeys = ["luxuryShopping", "gift", "kraft", "eventRetail"] as const;
  const types: FeatureListItem[] = typeKeys.map((key) => ({
    title: t(`types.items.${key}.title`),
    description: t(`types.items.${key}.description`),
  }));

  const materialKeys = ["paper", "handle", "finish", "print"] as const;
  const materials: MaterialGroup[] = materialKeys.map((key) => ({
    title: t(`materials.items.${key}.title`),
    description: t(`materials.items.${key}.description`),
    tags: t.raw(`materials.items.${key}.tags`) as string[],
  }));

  const caseKeys = ["veka", "meridian"] as const;
  const cases: CaseTeaserItem[] = caseKeys.map((key) => ({
    label: t(`cases.items.${key}.label`),
    summary: t(`cases.items.${key}.summary`),
    imageLabel: t(`cases.items.${key}.imageLabel`),
  }));

  return (
    <>
      <ServiceHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        tagline={t("hero.tagline")}
        imageLabel={t("hero.imageLabel")}
      />

      <ServiceFeatureList
        eyebrow={t("types.eyebrow")}
        heading={t("types.heading")}
        description={t("types.description")}
        items={types}
      />

      <ServiceMaterials
        eyebrow={t("materials.eyebrow")}
        heading={t("materials.heading")}
        description={t("materials.description")}
        groups={materials}
      />

      <ServiceCaseTeaser
        eyebrow={t("cases.eyebrow")}
        heading={t("cases.heading")}
        description={t("cases.description")}
        viewAllLabel={t("cases.viewAll")}
        items={cases}
      />

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

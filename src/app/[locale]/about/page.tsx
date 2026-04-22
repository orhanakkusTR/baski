import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { HeroAbout } from "@/components/sections/about/hero-about";
import { OurHistory } from "@/components/sections/about/our-history";
import { OurValues } from "@/components/sections/about/our-values";
import { ProcessTeaser } from "@/components/sections/about/process-teaser";
import { TeamPlaceholder } from "@/components/sections/about/team-placeholder";
import { CtaBlock } from "@/components/sections/cta-block";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function AboutPage() {
  const tCta = await getTranslations("about.cta");

  return (
    <>
      <HeroAbout />
      <OurHistory />
      <OurValues />
      <ProcessTeaser />
      <TeamPlaceholder />
      <CtaBlock
        eyebrow={tCta("eyebrow")}
        heading={tCta("heading")}
        description={tCta("description")}
        primary={{ label: tCta("primary"), href: "/quote" }}
        secondary={{ label: tCta("secondary"), href: "/contact" }}
      />
    </>
  );
}

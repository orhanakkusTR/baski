import { getTranslations } from "next-intl/server";

import { HeroHome } from "@/components/sections/hero/hero-home";
import { ServicesGrid } from "@/components/sections/services-grid";
import { FeaturedClients } from "@/components/sections/featured-clients";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { StatsCounter } from "@/components/sections/stats-counter";
import { CtaBlock } from "@/components/sections/cta-block";

export default async function HomePage() {
  const t = await getTranslations("home.cta");

  return (
    <>
      <HeroHome />
      <FeaturedClients />
      <ServicesGrid />
      <PortfolioShowcase />
      <StatsCounter />
      <CtaBlock
        eyebrow={t("eyebrow")}
        heading={t("heading")}
        description={t("description")}
        primary={{ label: t("primary"), href: "/quote" }}
        secondary={{ label: t("secondary"), href: "/contact" }}
      />
    </>
  );
}

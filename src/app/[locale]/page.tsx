import { HeroHome } from "@/components/sections/hero/hero-home";
import { ServicesGrid } from "@/components/sections/services-grid";
import { FeaturedClients } from "@/components/sections/featured-clients";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { StatsCounter } from "@/components/sections/stats-counter";
import { CtaBlock } from "@/components/sections/cta-block";

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <FeaturedClients />
      <ServicesGrid />
      <PortfolioShowcase />
      <StatsCounter />
      <CtaBlock />
    </>
  );
}

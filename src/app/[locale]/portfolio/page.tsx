import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { CtaBlock } from "@/components/sections/cta-block";
import { PortfolioListing } from "@/components/sections/portfolio/portfolio-listing";
import type { Locale } from "@/i18n/routing";
import {
  displayFromSanity,
  fallbackDisplayProjects,
  type DisplayProject,
} from "@/lib/sanity/adapter";
import { getAllProjects } from "@/lib/sanity/queries";
import type { ServiceKey } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function PortfolioPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const sanityProjects = await getAllProjects();
  const projects: DisplayProject[] =
    sanityProjects.length > 0
      ? sanityProjects.map((p) => displayFromSanity(p, locale))
      : await fallbackDisplayProjects();

  const categoryLabels: Record<ServiceKey, string> = {
    boxes: t("services.boxes.name"),
    bags: t("services.bags.name"),
    corporate: t("services.corporate.name"),
    custom: t("services.custom.name"),
  };

  return (
    <>
      <section className="relative -mt-24 bg-paper md:-mt-28">
        <Container className="flex flex-col gap-8 pt-40 pb-12 md:pt-48 md:pb-16 lg:pt-52 lg:pb-20">
          <span className="font-mono text-caption uppercase text-stone">
            {t("portfolio.hero.eyebrow")}
          </span>
          <h1
            lang="sv"
            className="max-w-4xl text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{t("portfolio.hero.heading")}</HeadingDot>
          </h1>
          <p className="max-w-2xl text-pretty text-body-lg text-stone">
            {t("portfolio.hero.description")}
          </p>
        </Container>
      </section>

      <Container as="section" className="py-12 md:py-16 lg:py-20">
        <PortfolioListing
          projects={projects}
          viewLabel={t("portfolio.viewProject")}
          allLabel={t("portfolio.filter.all")}
          categoryLabels={categoryLabels}
          emptyLabel={t("portfolio.empty")}
          filterAriaLabel={t("portfolio.filter.ariaLabel")}
        />
      </Container>

      <CtaBlock
        eyebrow={t("portfolio.cta.eyebrow")}
        heading={t("portfolio.cta.heading")}
        description={t("portfolio.cta.description")}
        primary={{ label: t("portfolio.cta.primary"), href: "/quote" }}
        secondary={{ label: t("portfolio.cta.secondary"), href: "/contact" }}
      />
    </>
  );
}

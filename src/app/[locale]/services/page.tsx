import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { CtaBlock } from "@/components/sections/cta-block";
import { ServicesOverviewList } from "@/components/sections/services/services-overview-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services.overview.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function ServicesOverviewPage() {
  const tHero = await getTranslations("services.overview.hero");
  const tCta = await getTranslations("services.overview.cta");

  return (
    <>
      <section className="relative -mt-24 bg-paper md:-mt-28">
        <Container className="flex flex-col gap-8 pt-40 pb-12 md:pt-48 md:pb-16 lg:pt-52 lg:pb-20">
          <span className="font-mono text-caption uppercase text-stone">
            {tHero("eyebrow")}
          </span>
          <h1
            lang="sv"
            className="max-w-4xl text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{tHero("heading")}</HeadingDot>
          </h1>
          <p className="max-w-2xl text-pretty text-body-lg text-stone">
            {tHero("description")}
          </p>
        </Container>
      </section>

      <ServicesOverviewList />

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

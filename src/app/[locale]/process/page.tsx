import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { CtaBlock } from "@/components/sections/cta-block";
import { ProcessTimeline } from "@/components/sections/process/process-timeline";
import { ProcessFaq } from "@/components/sections/process/process-faq";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("process.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function ProcessPage() {
  const t = await getTranslations();

  return (
    <>
      <section className="relative -mt-24 bg-paper md:-mt-28">
        <Container className="flex flex-col gap-8 pt-40 pb-12 md:pt-48 md:pb-16 lg:pt-52 lg:pb-20">
          <span className="font-mono text-caption uppercase text-stone">
            {t("process.hero.eyebrow")}
          </span>
          <h1
            lang="sv"
            className="max-w-4xl text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{t("process.hero.heading")}</HeadingDot>
          </h1>
          <p className="max-w-2xl text-pretty text-body-lg text-stone">
            {t("process.hero.description")}
          </p>
        </Container>
      </section>

      <ProcessTimeline />

      <ProcessFaq />

      <CtaBlock
        eyebrow={t("process.cta.eyebrow")}
        heading={t("process.cta.heading")}
        description={t("process.cta.description")}
        primary={{ label: t("process.cta.primary"), href: "/quote" }}
        secondary={{ label: t("process.cta.secondary"), href: "/contact" }}
      />
    </>
  );
}

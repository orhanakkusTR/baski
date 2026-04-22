import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";

/**
 * 00 — About hero.
 *
 * Textual, not full-viewport — the About page is a reading experience,
 * not a pitch. Eyebrow + display-lg mission statement + one-paragraph
 * intro. Breaks out of the layout's top padding (like the home hero)
 * so the transparent header reads over paper.
 */
export async function HeroAbout() {
  const t = await getTranslations("about.hero");

  return (
    <section className="relative -mt-24 bg-paper md:-mt-28">
      <Container className="flex flex-col gap-8 pt-40 pb-12 md:pt-48 md:pb-16 lg:pt-52 lg:pb-20">
        <span className="font-mono text-caption uppercase text-stone">
          {t("eyebrow")}
        </span>
        <h1
          lang="sv"
          className="max-w-4xl text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
        >
          {t("heading")}
        </h1>
        <p className="max-w-2xl text-pretty text-body-lg text-stone">
          {t("description")}
        </p>
      </Container>
    </section>
  );
}

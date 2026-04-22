import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

/**
 * 00 — About hero.
 *
 * Editorial two-column split: portrait image on the left (studio / craft),
 * mission statement on the right. Breaks out of the layout's top padding
 * (like the home hero) so the transparent header reads over paper. On
 * mobile the image stacks above the text.
 */
export async function HeroAbout() {
  const t = await getTranslations("about.hero");

  return (
    <section className="relative -mt-24 bg-paper md:-mt-28">
      <Container className="grid gap-10 pt-40 pb-12 md:grid-cols-2 md:gap-12 md:pt-48 md:pb-16 lg:gap-16 lg:pt-52 lg:pb-20">
        <div className="relative">
          <ImagePlaceholder
            aspect="4/5"
            tone="bone"
            label={t("imageLabel")}
          />
        </div>
        <div className="flex flex-col gap-8 md:justify-center">
          <span className="font-mono text-caption uppercase text-stone">
            {t("eyebrow")}
          </span>
          <h1
            lang="sv"
            className="text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{t("heading")}</HeadingDot>
          </h1>
          <p className="max-w-xl text-pretty text-body-lg text-stone">
            {t("description")}
          </p>
        </div>
      </Container>
    </section>
  );
}

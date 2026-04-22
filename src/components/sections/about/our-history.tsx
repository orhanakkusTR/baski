import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";

/**
 * 01 — Our history.
 *
 * Editorial 2-column asymmetric layout — narrow sidebar on the left with
 * eyebrow + h2 (sticky on desktop so the heading sits alongside the
 * reader's position in the body), wide prose column on the right with
 * three paragraphs. Mobile collapses to a single column stack.
 */
export async function OurHistory() {
  const t = await getTranslations("about.history");

  const paragraphs = [
    t("body.founding"),
    t("body.growth"),
    t("body.ethos"),
  ];

  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-12 lg:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <span className="font-mono text-caption uppercase text-stone">
            {t("eyebrow")}
          </span>
          <h2
            lang="sv"
            className="mt-5 text-balance font-display text-ink text-h1 hyphens-auto break-words"
          >
            <HeadingDot>{t("heading")}</HeadingDot>
          </h2>
        </div>
        <div className="flex flex-col gap-6 text-body-lg text-stone">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Container>
  );
}

import { ShieldCheck, Leaf, Target, Lock, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * 02 — Our values.
 *
 * Four equal-weight values — none is "hero", so the grid is uniform:
 * 2×2 on md, 4-column on lg+, single column on mobile. Each value
 * gets a lucide outline icon, a short heading, and one clean sentence
 * of substance (no agency cliché — concrete commitments only).
 */
interface ValueKey {
  key: "quality" | "sustainability" | "precision" | "partnership";
  Icon: LucideIcon;
}

const values: ValueKey[] = [
  { key: "quality", Icon: ShieldCheck },
  { key: "sustainability", Icon: Leaf },
  { key: "precision", Icon: Target },
  { key: "partnership", Icon: Lock },
];

export async function OurValues() {
  const t = await getTranslations("about.values");

  return (
    <section
      aria-labelledby="values-heading"
      className="border-y border-ink/10 bg-paper"
    >
      <Container className="py-12 md:py-16 lg:py-20">
        <SectionHeading
          eyebrow={t("eyebrow")}
          heading={t("heading")}
          description={t("description")}
          size="md"
        />

        <ul
          id="values-heading"
          className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:grid-cols-4 lg:gap-x-8"
        >
          {values.map(({ key, Icon }, i) => (
            <li
              key={key}
              className="group relative flex flex-col gap-5 border-t border-ink/15 pt-6 transition-colors duration-300 ease-out hover:border-gold"
            >
              <div className="flex items-center justify-between">
                <Icon
                  aria-hidden
                  className="size-6 text-ink transition-colors duration-300 ease-out group-hover:text-gold"
                  strokeWidth={1.5}
                />
                <span className="font-mono text-caption uppercase text-stone">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-h4 text-ink">
                {t(`items.${key}.name`)}
              </h3>
              <p className="text-pretty text-body text-stone">
                {t(`items.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

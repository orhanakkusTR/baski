"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";

const STEP_KEYS = ["brief", "concept", "prototype", "production", "delivery"] as const;
type StepKey = (typeof STEP_KEYS)[number];

/**
 * Five-step process timeline with a sticky big Fraunces number on the
 * left of each row. The natural CSS `position: sticky` behaviour is
 * what produces the "number stays while content scrolls" effect — each
 * step is its own 2-col grid with a tall right column; the left cell
 * (`md:sticky md:top-28`) stays pinned until the parent row scrolls
 * past, at which point the next row's number takes over.
 *
 * On top of the sticky layout, each step right-side content fades + slides
 * in via `whileInView` so entering a step has a small editorial reveal.
 * Reduced-motion users get the positions instantly with no animation.
 */
export function ProcessTimeline() {
  const t = useTranslations("process.timeline");
  const prefersReducedMotion = useReducedMotion();

  const EASE = [0.22, 1, 0.36, 1] as const;
  const rightReveal: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: EASE },
    },
  };

  const numberReveal: Variants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.9, ease: EASE },
    },
  };

  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <ol className="flex flex-col">
        {STEP_KEYS.map((key: StepKey, i) => {
          const deliverables = t.raw(`steps.${key}.deliverables`) as string[];
          return (
            <li
              key={key}
              className="grid gap-10 border-t border-ink/15 py-16 first:border-t-0 md:grid-cols-[1fr_1.5fr] md:gap-16 md:py-24 lg:gap-24 lg:py-32"
            >
              <div className="md:sticky md:top-28 md:self-start">
                <motion.span
                  aria-hidden
                  variants={numberReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20% 0px" }}
                  className="block font-display leading-[0.85] text-ink text-[8rem] md:text-[12rem] lg:text-[14rem] tracking-[-0.04em]"
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
              </div>

              <motion.div
                variants={rightReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-15% 0px" }}
                className="flex flex-col gap-8"
              >
                <div className="flex flex-col gap-5">
                  <span className="font-mono text-caption uppercase text-stone">
                    {t(`stepLabel`, { n: String(i + 1).padStart(2, "0") })}
                  </span>
                  <h3 className="font-display text-h1 text-ink">
                    {t(`steps.${key}.title`)}
                  </h3>
                </div>

                <p className="max-w-2xl text-pretty text-body-lg text-stone">
                  {t(`steps.${key}.description`)}
                </p>

                <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-12 pt-4">
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-caption uppercase text-stone">
                      {t("duration")}
                    </span>
                    <span className="font-display text-h4 text-ink">
                      {t(`steps.${key}.duration`)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-caption uppercase text-stone">
                      {t("deliverables")}
                    </span>
                    <ul className="flex flex-col gap-2">
                      {deliverables.map((d, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-pretty text-body text-stone"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.65em] inline-block size-1 shrink-0 rounded-full bg-gold"
                          />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}

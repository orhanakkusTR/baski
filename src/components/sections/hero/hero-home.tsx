"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { ButtonLink } from "@/components/shared/button-link";
import { buttonVariants } from "@/components/ui/button";
import { NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

/**
 * Full-viewport homepage hero.
 *
 * Breaks out of the locale layout's top padding (`-mt-24 md:-mt-28`) so the
 * transparent header reads over the content instead of sitting on a strip
 * of paper. Content inside the hero re-pads (`pt-40 md:pt-52 lg:pt-56`)
 * to clear the header visually.
 */
export function HeroHome() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();

  const headline = t("home.hero.headline");
  const words = headline.split(/(\s+)/);

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.2 },
    },
  };

  const wordVariants: Variants = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.85, ease: EASE_EDITORIAL },
    },
  };

  const metaFade: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.6, ease: EASE_EDITORIAL, delay: 0.8 + i * 0.08 },
    }),
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative -mt-24 flex min-h-[100svh] flex-col bg-paper md:-mt-28"
    >
      <Container className="flex flex-1 flex-col justify-between gap-16 pb-16 pt-40 md:pt-52 lg:pb-24 lg:pt-56">
        <div className="flex flex-col gap-10">
          {/* Eyebrow */}
          <motion.p
            custom={0}
            variants={metaFade}
            initial="hidden"
            animate="visible"
            className="font-mono text-caption uppercase text-stone"
          >
            {t("home.hero.eyebrow")}
          </motion.p>

          {/* Headline — word-stagger reveal */}
          <motion.h1
            id="hero-heading"
            aria-label={headline}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="font-display text-balance text-ink text-display-xl"
          >
            {words.map((segment, i) => {
              if (/^\s+$/.test(segment)) return segment;
              return (
                <span
                  key={i}
                  aria-hidden
                  className="inline-block overflow-hidden align-[0.05em]"
                >
                  <motion.span
                    variants={wordVariants}
                    className="inline-block"
                  >
                    {segment}
                  </motion.span>
                </span>
              );
            })}
          </motion.h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          {/* Subtitle */}
          <motion.p
            custom={1}
            variants={metaFade}
            initial="hidden"
            animate="visible"
            className="max-w-xl text-body-lg text-stone"
          >
            {t("home.hero.subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={2}
            variants={metaFade}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-5 sm:flex-row sm:items-center lg:justify-end"
          >
            <Link
              href={NAVIGATION.cta.href}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              {t("header.cta")}
            </Link>
            <ButtonLink href="/portfolio" size="md">
              {t("home.hero.secondary")}
            </ButtonLink>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        custom={3}
        variants={metaFade}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-hidden
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-stone">
          {t("home.hero.scroll")}
        </span>
        <motion.span
          className="block h-10 w-px bg-gold origin-top"
          initial={{ scaleY: 0 }}
          animate={
            prefersReducedMotion
              ? { scaleY: 1 }
              : { scaleY: [0, 1, 1, 0], originY: [0, 0, 1, 1] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }
          }
        />
        <ArrowDown aria-hidden className="size-3 text-gold" />
      </motion.div>
    </section>
  );
}

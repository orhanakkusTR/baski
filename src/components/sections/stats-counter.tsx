"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/shared/container";

interface StatDef {
  /** Numeric target for the count-up. Null = static text value (no count). */
  to: number | null;
  /** Optional suffix rendered next to the number (e.g. "+"). Ignored when `to` is null. */
  suffix?: string;
  /** Fallback/static display value. Used when `to` is null OR reduced motion is on. */
  staticValue?: string;
  labelKey: string;
}

const stats: StatDef[] = [
  { to: 150, suffix: "+", staticValue: "150+", labelKey: "home.stats.projects" },
  { to: 40, suffix: "+", staticValue: "40+", labelKey: "home.stats.brands" },
  { to: 12, staticValue: "12", labelKey: "home.stats.countries" },
  { to: null, staticValue: "A++", labelKey: "home.stats.quality" },
];

export function StatsCounter() {
  const t = useTranslations();

  return (
    <section
      aria-labelledby="stats-heading"
      className="border-y border-ink/10 bg-paper py-12 md:py-16 lg:py-20"
    >
      <Container>
        <h2 id="stats-heading" className="sr-only">
          {t("home.stats.srHeading")}
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-10">
          {stats.map((stat) => (
            <StatItem key={stat.labelKey} stat={stat} label={t(stat.labelKey)} />
          ))}
        </dl>
      </Container>
    </section>
  );
}

interface StatItemProps {
  stat: StatDef;
  label: string;
}

function StatItem({ stat, label }: StatItemProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-ink/10 pt-6">
      <dt className="order-2 font-mono text-caption uppercase text-stone">
        {label}
      </dt>
      <dd className="order-1 font-display text-ink leading-none tracking-[-0.02em] text-[clamp(3rem,7vw,5rem)]">
        <StatValue stat={stat} />
      </dd>
    </div>
  );
}

function StatValue({ stat }: { stat: StatDef }) {
  const prefersReducedMotion = useReducedMotion();

  if (stat.to === null || prefersReducedMotion) {
    return <span>{stat.staticValue}</span>;
  }

  return <CountUp to={stat.to} suffix={stat.suffix ?? ""} />;
}

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
}

function CountUp({ to, duration = 1500, suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start: number | null = null;
    let raf = 0;

    const tick = (t: number) => {
      if (start === null) start = t;
      const elapsed = t - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PhoneCall, Clock, FileText, ShieldCheck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { QuoteForm } from "@/components/forms/quote-form";
import { SITE_CONFIG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("quote.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

const SIDEBAR_ICONS = [Clock, FileText, PhoneCall, ShieldCheck];

export default async function QuotePage() {
  const t = await getTranslations();
  const sidebarKeys = ["response", "proposal", "scoping", "nda"] as const;

  return (
    <>
      <section className="relative -mt-24 bg-paper md:-mt-28">
        <Container className="flex flex-col gap-8 pt-40 pb-10 md:pt-48 md:pb-12 lg:pt-52 lg:pb-14">
          <span className="font-mono text-caption uppercase text-stone">
            {t("quote.hero.eyebrow")}
          </span>
          <h1
            lang="sv"
            className="max-w-4xl text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{t("quote.hero.heading")}</HeadingDot>
          </h1>
          <p className="max-w-2xl text-pretty text-body-lg text-stone">
            {t("quote.hero.description")}
          </p>
        </Container>
      </section>

      <Container as="section" className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div>
            <QuoteForm />
          </div>

          <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-4 border-l-2 border-gold pl-6">
              <span className="font-mono text-caption uppercase text-stone">
                {t("quote.sidebar.eyebrow")}
              </span>
              <h2 className="font-display text-h2 text-ink">
                {t("quote.sidebar.heading")}
              </h2>
              <p className="max-w-md text-pretty text-body text-stone">
                {t("quote.sidebar.description")}
              </p>
            </div>

            <ul className="flex flex-col">
              {sidebarKeys.map((key, i) => {
                const Icon = SIDEBAR_ICONS[i];
                return (
                  <li
                    key={key}
                    className="flex items-start gap-4 border-t border-ink/10 py-5 last:border-b"
                  >
                    <Icon
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-ink"
                      strokeWidth={1.5}
                    />
                    <div className="flex flex-1 flex-col gap-2">
                      <h3 className="font-display text-h5 text-ink">
                        {t(`quote.sidebar.items.${key}.title`)}
                      </h3>
                      <p className="text-pretty text-body-sm text-stone">
                        {t(`quote.sidebar.items.${key}.description`)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-caption uppercase text-stone">
                {t("quote.sidebar.directContact")}
              </span>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, "")}`}
                className="font-display text-h4 text-ink underline decoration-transparent underline-offset-[0.2em] transition-[text-decoration-color] duration-300 ease-out hover:decoration-gold"
              >
                {SITE_CONFIG.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-mono text-caption uppercase text-stone underline underline-offset-[0.25em] decoration-ink/20 transition-colors hover:text-ink hover:decoration-ink"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

import { Children } from "react";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { Container } from "@/components/shared/container";
import { LanguageSwitcher } from "./language-switcher";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <Container as="div" className="pb-12 pt-24 md:pt-32">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-caption uppercase text-paper/50">
              {t("footer.tagline.eyebrow")}
            </span>
            <p className="text-pretty font-display text-h3 text-paper">
              {t("footer.tagline.body")}
            </p>
            <Link
              href={NAVIGATION.cta.href}
              className="group inline-flex items-center gap-3 self-start border border-paper/30 px-6 py-3 font-mono text-caption uppercase text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span>{t("header.cta")}</span>
              <ArrowUpRight className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <FooterColumn title={t("footer.columns.services")}>
            {NAVIGATION.footer.services.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(`services.${item.key}.name`)}
              </FooterLink>
            ))}
            <FooterLink href="/services">{t("footer.viewAll")}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t("footer.columns.company")}>
            {NAVIGATION.footer.company.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(`nav.${item.key}`)}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-caption uppercase text-paper/50">
              {t("footer.columns.contact")}
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 self-start text-body-sm text-paper transition-colors hover:text-gold"
              >
                {SITE_CONFIG.email}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                className="self-start text-body-sm text-paper/80 transition-colors hover:text-paper"
              >
                {SITE_CONFIG.phone}
              </a>
              <address className="not-italic text-body-sm text-paper/60">
                {SITE_CONFIG.address.line1}
                <br />
                {SITE_CONFIG.address.line2}
                <br />
                {SITE_CONFIG.address.country}
              </address>
              <p className="pt-2 font-mono text-caption uppercase text-paper/40">
                {t("footer.orgLabel")} {SITE_CONFIG.orgNumber}
              </p>
              <p className="font-mono text-caption uppercase text-paper/40">
                {t("footer.vatLabel")} {SITE_CONFIG.vatNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div
          aria-hidden
          className="pointer-events-none mt-24 select-none border-t border-paper/15 pt-12 text-center"
        >
          <span className="block font-display font-medium leading-none tracking-[-0.04em] text-paper/90 text-[clamp(6rem,22vw,20rem)]">
            AW<span className="text-gold">·</span>AB
          </span>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-caption uppercase text-paper/50">
            {t("footer.copyright", { year })}
          </p>
          <nav
            aria-label={t("footer.legalNav")}
            className="flex flex-wrap items-center gap-6"
          >
            {NAVIGATION.footer.legal.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="font-mono text-caption uppercase text-paper/50 transition-colors hover:text-paper"
              >
                {t(`footer.links.${item.key}`)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher tone="paper" />
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-caption uppercase text-paper/50">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {Children.map(children, (child, i) => (
          <li key={i}>{child}</li>
        ))}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: StaticPathname;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-body-sm text-paper/80 transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      {children}
    </Link>
  );
}

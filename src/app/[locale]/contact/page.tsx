import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE_CONFIG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

export default async function ContactPage() {
  const t = await getTranslations();

  return (
    <>
      <section className="relative -mt-24 bg-paper md:-mt-28">
        <Container className="flex flex-col gap-8 pt-40 pb-10 md:pt-48 md:pb-12 lg:pt-52 lg:pb-14">
          <span className="font-mono text-caption uppercase text-stone">
            {t("contact.hero.eyebrow")}
          </span>
          <h1
            lang="sv"
            className="max-w-4xl text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{t("contact.hero.heading")}</HeadingDot>
          </h1>
          <p className="max-w-2xl text-pretty text-body-lg text-stone">
            {t("contact.hero.description")}
          </p>
        </Container>
      </section>

      <Container as="section" className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <div>
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-3 border-l-2 border-gold pl-6">
              <span className="font-mono text-caption uppercase text-stone">
                {t("contact.info.eyebrow")}
              </span>
              <h2 className="font-display text-h3 text-ink">
                {t("contact.info.heading")}
              </h2>
            </div>

            <ul className="flex flex-col">
              <InfoRow
                icon={MapPin}
                label={t("contact.info.address")}
                value={
                  <>
                    {SITE_CONFIG.address.line1}
                    <br />
                    {SITE_CONFIG.address.line2}
                    <br />
                    {SITE_CONFIG.address.country}
                  </>
                }
              />
              <InfoRow
                icon={Mail}
                label={t("contact.info.email")}
                value={
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="underline underline-offset-[0.25em] decoration-ink/20 transition-colors hover:decoration-ink"
                  >
                    {SITE_CONFIG.email}
                  </a>
                }
              />
              <InfoRow
                icon={Phone}
                label={t("contact.info.phone")}
                value={
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, "")}`}
                    className="underline underline-offset-[0.25em] decoration-ink/20 transition-colors hover:decoration-ink"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                }
              />
              <InfoRow
                icon={Clock}
                label={t("contact.info.hours")}
                value={t("contact.info.hoursValue")}
              />
            </ul>
          </aside>
        </div>
      </Container>

      <Container as="section" className="py-6 pb-16 md:py-8 md:pb-24 lg:pb-32">
        <div className="relative aspect-[21/9] overflow-hidden bg-bone">
          <ImagePlaceholder
            label={t("contact.office.imageLabel")}
            fill
            tone="bone"
          />
        </div>
        <p className="mt-4 max-w-xl font-mono text-caption uppercase text-stone">
          {t("contact.office.caption")}
        </p>
      </Container>
    </>
  );
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  label: string;
  value: React.ReactNode;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <li className="flex items-start gap-4 border-t border-ink/10 py-5 last:border-b">
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-ink" strokeWidth={1.5} />
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-caption uppercase text-stone">
          {label}
        </span>
        <div className="text-pretty text-body text-ink">{value}</div>
      </div>
    </li>
  );
}

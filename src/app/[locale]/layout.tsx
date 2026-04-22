import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { fraunces, inter } from "@/styles/fonts";
import { SITE_CONFIG } from "@/lib/constants";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "AW AB — Premium förpackningsbyrå i Sverige",
    template: "%s · AW AB",
  },
  description:
    "AW AB är en svensk förpackningsbyrå för premium- och lyxvarumärken. Presentkartonger, papperskassar och företagstryck i studio-kvalitet.",
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    title: "AW AB — Premium förpackningsbyrå",
    description:
      "Förpackningar, papperskassar och företagstryck för varumärken som måste hålla i butiksljuset.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AW AB — Premium förpackningsbyrå",
    description:
      "Förpackningar, papperskassar och företagstryck för varumärken som måste hålla i butiksljuset.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <NextIntlClientProvider>
          <Header />
          <main className="flex flex-1 flex-col pt-24 md:pt-28">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

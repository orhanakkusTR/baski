import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fraunces, inter } from "@/styles/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "AW AB — Premium förpackningsbyrå",
    template: "%s | AW AB",
  },
  description:
    "AW AB är en svensk förpackningsbyrå för premium- och lyxmärken. Presentkartonger, papperskassar och kurerad kurator för företagstryck.",
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

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

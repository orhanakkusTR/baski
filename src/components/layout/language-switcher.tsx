"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  tone?: "ink" | "paper";
  className?: string;
}

export function LanguageSwitcher({
  tone = "ink",
  className,
}: LanguageSwitcherProps) {
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(target: Locale) {
    if (target === current) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error — dynamic params shape is fine here
        { pathname, params },
        { locale: target },
      );
    });
  }

  const activeClass = tone === "paper" ? "text-paper" : "text-ink";
  const mutedClass =
    tone === "paper"
      ? "text-paper/40 hover:text-paper"
      : "text-stone hover:text-ink";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-caption uppercase",
        isPending && "pointer-events-none opacity-60",
        className,
      )}
      aria-label="Language"
    >
      {routing.locales.map((locale, i) => {
        const isActive = locale === current;
        return (
          <span key={locale} className="contents">
            {i > 0 ? (
              <span aria-hidden className={cn("select-none", mutedClass)}>
                /
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => switchTo(locale)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
                isActive ? activeClass : mutedClass,
                isActive && "font-semibold",
              )}
            >
              {locale}
            </button>
          </span>
        );
      })}
    </div>
  );
}

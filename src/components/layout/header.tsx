"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { NAVIGATION } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A short close-grace so users can move the cursor from the trigger into
  // the dropdown without the panel snapping shut.
  function openServices() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setServicesOpen(true);
  }
  function scheduleCloseServices() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setServicesOpen(false), 120);
  }

  const headerHeight = scrolled ? 64 : 96;

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-200 ease-out",
          scrolled
            ? "border-b border-ink/10 bg-paper/92 supports-[backdrop-filter]:bg-paper/75 supports-[backdrop-filter]:backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
        initial={false}
        animate={{ height: prefersReducedMotion ? 96 : headerHeight }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-edge flex h-full items-center justify-between gap-8">
          <Logo tone="ink" size={scrolled ? "sm" : "md"} />

          {/* Desktop nav — shows at xl+ only. Below that (tablets and small
              laptops, where 5 nav items + logo + LS + CTA would wrap or
              crowd), the hamburger + fullscreen mobile menu takes over. */}
          <nav
            className="hidden items-center gap-8 xl:flex"
            aria-label={t("header.primaryNav")}
          >
            {NAVIGATION.header.map((item) =>
              item.submenu ? (
                <div
                  key={item.key}
                  className="relative"
                  onPointerEnter={openServices}
                  onPointerLeave={scheduleCloseServices}
                >
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                  >
                    {t(`nav.${item.key}`)}
                    <span
                      aria-hidden
                      className={cn(
                        "size-1 rounded-full bg-ink transition-opacity",
                        servicesOpen ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>

                  <AnimatePresence>
                    {servicesOpen ? (
                      <ServicesDropdown
                        submenu={item.submenu}
                        onPointerEnter={openServices}
                        onPointerLeave={scheduleCloseServices}
                        onNavigate={() => setServicesOpen(false)}
                      />
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-body-sm font-medium text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <Link
              href={NAVIGATION.cta.href}
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "hidden md:inline-flex",
              )}
            >
              {t("header.cta")}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t("header.openMenu")}
              className="inline-flex size-11 items-center justify-center text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold xl:hidden"
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

interface ServicesDropdownProps {
  submenu: { key: string; href: string }[];
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onNavigate: () => void;
}

function ServicesDropdown({
  submenu,
  onPointerEnter,
  onPointerLeave,
  onNavigate,
}: ServicesDropdownProps) {
  const t = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="absolute left-1/2 top-full z-50 mt-4 w-[min(64rem,calc(100vw-3rem))] -translate-x-1/2 border border-ink/10 bg-paper shadow-[var(--shadow-elevated)]"
      role="menu"
    >
      <div className="grid grid-cols-1 divide-y divide-ink/10 md:grid-cols-4 md:divide-x md:divide-y-0">
        {submenu.map((item, i) => (
          <Link
            key={item.key}
            href={item.href}
            role="menuitem"
            onClick={onNavigate}
            className="group flex flex-col gap-3 p-6 transition-colors hover:bg-bone focus-visible:bg-bone focus-visible:outline-none"
          >
            <span className="font-mono text-caption uppercase text-stone">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-h4 text-ink">
              {t(`services.${item.key}.name`)}
            </span>
            <span className="text-body-sm text-stone">
              {t(`services.${item.key}.description`)}
            </span>
            <span
              aria-hidden
              className="mt-auto inline-flex items-center gap-1.5 pt-2 font-mono text-caption uppercase text-ink"
            >
              <span className="relative">
                {t("nav.learnMore")}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
              <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

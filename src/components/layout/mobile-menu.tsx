"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;
import { X, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "./language-switcher";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();

  // Lock body scroll and wire ESC to close while the overlay is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 32, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.6, ease: EASE_EDITORIAL },
    },
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("header.menuLabel")}
          className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: EASE_EDITORIAL }
          }
        >
          <div className="container-edge flex h-24 shrink-0 items-center justify-between">
            <Logo tone="paper" href="/" ariaLabel={t("header.homeLink")} />
            <button
              type="button"
              onClick={onClose}
              aria-label={t("header.closeMenu")}
              className="group inline-flex items-center gap-3 font-mono text-caption uppercase text-paper/70 transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span>{t("header.close")}</span>
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <motion.nav
            className="container-edge flex flex-1 flex-col justify-between gap-10 pb-12 pt-6"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={listVariants}
          >
            <motion.ul className="flex flex-col gap-6" variants={listVariants}>
              {NAVIGATION.mobile.map((item) => (
                <motion.li key={item.key} variants={itemVariants}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group inline-flex items-baseline gap-4 font-display text-display-lg text-paper transition-colors hover:text-gold",
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
                    )}
                  >
                    <span className="font-mono text-caption uppercase text-paper/40">
                      {String(NAVIGATION.mobile.indexOf(item) + 1).padStart(2, "0")}
                    </span>
                    <span>{t(`nav.${item.key}`)}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-end md:justify-between"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-caption uppercase text-paper/40">
                  {t("footer.addressLabel")}
                </span>
                <span className="text-body text-paper/80">
                  {SITE_CONFIG.address.line1}
                  <br />
                  {SITE_CONFIG.address.line2}
                </span>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-2 text-body text-paper transition-colors hover:text-gold"
                >
                  {SITE_CONFIG.email}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
                <LanguageSwitcher tone="paper" />
              </div>
            </motion.div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

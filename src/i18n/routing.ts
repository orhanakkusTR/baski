import { defineRouting } from "next-intl/routing";

/**
 * Routing configuration — defines locales, default locale, and the full
 * pathname map so each route gets a locale-appropriate URL slug:
 *
 *   /about         → /sv/om-oss             · /en/about
 *   /services      → /sv/tjanster           · /en/services
 *   /portfolio     → /sv/arbeten            · /en/portfolio
 *   /quote         → /sv/offert             · /en/quote
 *   /contact       → /sv/kontakt            · /en/contact
 *
 * File-system routes live at the canonical English path (e.g.
 * `src/app/[locale]/about/page.tsx`); next-intl's middleware rewrites
 * the localised URL onto the canonical path automatically. Links should
 * use the canonical path (`<Link href="/about">`) — next-intl renders the
 * correct per-locale URL at render time.
 *
 * Every route referenced anywhere in the app must be listed here or
 * next-intl's Link component will reject it at the type level. Pages not
 * yet built (services/*, portfolio/[slug], etc.) are listed anyway so
 * internal links from the header / footer type-check; they'll 404 at
 * runtime until the corresponding page file lands.
 */
export const routing = defineRouting({
  locales: ["sv", "en"] as const,
  defaultLocale: "sv",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/about": { sv: "/om-oss", en: "/about" },
    "/services": { sv: "/tjanster", en: "/services" },
    "/services/boxes": {
      sv: "/tjanster/kartonger",
      en: "/services/boxes",
    },
    "/services/bags": {
      sv: "/tjanster/kassar",
      en: "/services/bags",
    },
    "/services/corporate-print": {
      sv: "/tjanster/foretagstryck",
      en: "/services/corporate-print",
    },
    "/services/custom": {
      sv: "/tjanster/specialproduktion",
      en: "/services/custom",
    },
    "/portfolio": { sv: "/arbeten", en: "/portfolio" },
    "/portfolio/[slug]": {
      sv: "/arbeten/[slug]",
      en: "/portfolio/[slug]",
    },
    "/process": "/process",
    "/quote": { sv: "/offert", en: "/quote" },
    "/contact": { sv: "/kontakt", en: "/contact" },
    "/privacy": { sv: "/integritetspolicy", en: "/privacy" },
    "/terms": { sv: "/villkor", en: "/terms" },
    "/cookies": "/cookies",
    "/styleguide": "/styleguide",
  },
});

export type Locale = (typeof routing.locales)[number];

/** Every key in the pathnames map. Includes both static and dynamic routes. */
export type Pathname = keyof typeof routing.pathnames;

/**
 * Static-only subset of `Pathname` — excludes dynamic routes like
 * `/portfolio/[slug]` that need `{pathname, params}` object form when
 * passed to `<Link>`. Use this when typing static href values (e.g. in
 * `constants.ts` NAVIGATION) so callers can pass the href directly as a
 * string without TypeScript complaining about the dynamic variant.
 */
export type StaticPathname = Exclude<Pathname, `${string}[${string}]${string}`>;

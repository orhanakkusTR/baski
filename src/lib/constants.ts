/**
 * Single source of truth for site-wide metadata and the navigation graph.
 * Anything user-visible here (link labels, addresses visible to real humans)
 * should either go through next-intl `t()` keys or live in Sanity — not as
 * bare strings. What stays here is structural: URLs, enums, placeholders.
 */

export const SITE_CONFIG = {
  name: "AW AB",
  shortDescription: "Premium förpackningsbyrå i Sverige.",
  url: "https://awab.se",
  email: "info@awab.se",
  phone: "+46 8 000 00 00",
  address: {
    line1: "Stora Nygatan 12",
    line2: "111 27 Stockholm",
    country: "Sverige",
  },
  orgNumber: "556000-0000",
  vatNumber: "SE556000000001",
  foundingYear: 2019,
  social: {
    instagram: "https://instagram.com/awab.se",
    linkedin: "https://www.linkedin.com/company/awab-se",
  },
} as const;

export type NavKey =
  | "home"
  | "services"
  | "portfolio"
  | "process"
  | "about"
  | "contact"
  | "quote";

export type ServiceKey = "boxes" | "bags" | "corporate" | "custom";

export interface SubmenuItem {
  key: ServiceKey;
  href: string;
}

export interface NavItem {
  key: NavKey;
  href: string;
  submenu?: SubmenuItem[];
}

/**
 * Main navigation shown in the header (desktop + mobile).
 * The `home` entry is intentionally omitted from the visible list — the logo
 * links to `/`. It stays in the enum because the mobile menu includes it.
 */
export const NAVIGATION: {
  header: NavItem[];
  mobile: NavItem[];
  cta: { key: NavKey; href: string };
  footer: {
    services: SubmenuItem[];
    company: NavItem[];
    legal: { key: string; href: string }[];
  };
} = {
  header: [
    {
      key: "services",
      href: "/services",
      submenu: [
        { key: "boxes", href: "/services/boxes" },
        { key: "bags", href: "/services/bags" },
        { key: "corporate", href: "/services/corporate-print" },
        { key: "custom", href: "/services/custom" },
      ],
    },
    { key: "portfolio", href: "/portfolio" },
    { key: "process", href: "/process" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ],
  mobile: [
    { key: "home", href: "/" },
    { key: "services", href: "/services" },
    { key: "portfolio", href: "/portfolio" },
    { key: "process", href: "/process" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
    { key: "quote", href: "/quote" },
  ],
  cta: { key: "quote", href: "/quote" },
  footer: {
    services: [
      { key: "boxes", href: "/services/boxes" },
      { key: "bags", href: "/services/bags" },
      { key: "corporate", href: "/services/corporate-print" },
      { key: "custom", href: "/services/custom" },
    ],
    company: [
      { key: "about", href: "/about" },
      { key: "process", href: "/process" },
      { key: "portfolio", href: "/portfolio" },
      { key: "contact", href: "/contact" },
    ],
    legal: [
      { key: "privacy", href: "/privacy" },
      { key: "terms", href: "/terms" },
      { key: "cookies", href: "/cookies" },
    ],
  },
};

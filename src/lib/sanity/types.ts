import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import type { ServiceKey } from "@/lib/constants";

/** { sv, en } — short localized string. Swedish is canonical. */
export interface LocalizedString {
  sv: string;
  en?: string;
}

/** { sv, en } — long-form portable text per locale. */
export interface LocalizedText {
  sv: PortableTextBlock[];
  en?: PortableTextBlock[];
}

/**
 * Shape of an `image` field from a document. Structurally compatible with
 * `SanityImageSource` (from `@sanity/image-url`), so values typed as
 * `SanityImage` can be passed directly to `urlFor()`.
 */
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// Keep the SanityImageSource import live so downstream typings stay aligned;
// `urlFor` accepts our SanityImage because it matches the source shape.
export type { SanityImageSource };

export interface GalleryImage {
  _key: string;
  image: SanityImage;
  alt: LocalizedString;
  caption?: LocalizedString;
}

export interface ClientDoc {
  _id: string;
  _type: "client";
  name: string;
  logo?: SanityImage;
  industry?: string;
  website?: string;
  publishedConsent?: boolean;
}

export type ProjectCategory = ServiceKey;

/** Listing / featured projection — light, safe to ship in many cards. */
export interface ProjectListItem {
  _id: string;
  slug: string;
  title: LocalizedString;
  clientName?: string;
  category: ProjectCategory;
  year?: number;
  description: LocalizedString;
  heroImage?: SanityImage;
  materials?: string[];
  featured?: boolean;
  order?: number;
}

/** Detail projection — full narrative + gallery. */
export interface ProjectDetail extends ProjectListItem {
  challenge?: LocalizedText;
  solution?: LocalizedText;
  results?: LocalizedText;
  gallery?: GalleryImage[];
  seo?: {
    title?: LocalizedString;
    description?: LocalizedString;
    ogImage?: SanityImage;
    noindex?: boolean;
  };
}

/**
 * Resolve a localized field for a locale with Swedish fallback —
 * Swedish is the canonical locale; English is optional during drafting.
 */
export function pickLocale<T extends { sv: unknown; en?: unknown }>(
  field: T | undefined,
  locale: "sv" | "en",
): T["sv"] | undefined {
  if (!field) return undefined;
  if (locale === "en") {
    return (field.en as T["sv"]) ?? field.sv;
  }
  return field.sv;
}

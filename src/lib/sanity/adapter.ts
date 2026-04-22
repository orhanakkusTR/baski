import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { featuredProjects, type ProjectMock } from "@/lib/mock-projects";

import type { ProjectListItem } from "./types";
import { pickLocale } from "./types";
import { urlFor } from "./image";

/**
 * A flat, locale-resolved shape the card components consume.
 * Whether the source was Sanity or the local mock, the card sees the
 * same object — which keeps the rendering paths identical.
 */
export interface DisplayProject {
  slug: string;
  title: string;
  clientName: string;
  category: string;
  year?: number;
  description: string;
  /** Real image URL when Sanity is connected. Null triggers the placeholder. */
  heroUrl: string | null;
  /** Used as the `<ImagePlaceholder label>` when heroUrl is null. */
  imageLabel: string;
  materials?: string[];
  /**
   * When false, the card renders as a non-linked <article>. Used by the
   * fallback mock projects — their slugs don't resolve to a real detail
   * page until Sanity is populated, so clicking them would 404.
   */
  linkable: boolean;
}

/** Convert a Sanity ProjectListItem into the flat display shape. */
export function displayFromSanity(
  project: ProjectListItem,
  locale: Locale,
): DisplayProject {
  const title = pickLocale(project.title, locale) ?? "";
  const description = pickLocale(project.description, locale) ?? "";
  const heroUrl = project.heroImage
    ? (urlFor(project.heroImage)
        ?.width(1600)
        .height(1200)
        .fit("crop")
        .auto("format")
        .url() ?? null)
    : null;
  return {
    slug: project.slug,
    title,
    clientName: project.clientName ?? "",
    category: project.category,
    year: project.year,
    description,
    heroUrl,
    imageLabel: `Project · ${title}`,
    materials: project.materials,
    linkable: true,
  };
}

/**
 * Fallback display projects sourced from the mock file.
 *
 * Used when Sanity returns zero projects — before the client has
 * populated content, we still want the portfolio page to show
 * something real-ish. Title is resolved through next-intl so the mocks
 * appear in the correct locale.
 */
export async function fallbackDisplayProjects(): Promise<DisplayProject[]> {
  const t = await getTranslations();
  return featuredProjects.map((mock: ProjectMock) => ({
    slug: mock.slug,
    title: t(mock.titleKey),
    clientName: mock.client,
    category: mock.category,
    year: mock.year,
    description: t(mock.titleKey),
    heroUrl: null,
    imageLabel: mock.imageLabel,
    linkable: false,
  }));
}

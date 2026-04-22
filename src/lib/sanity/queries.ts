import { groq } from "next-sanity";

import { sanityClient } from "./client";
import type { ProjectDetail, ProjectListItem } from "./types";

/**
 * GROQ projections.
 *
 * Lists use the light `listProjection` — just enough to render a card.
 * The detail query adds challenge / solution / results / gallery.
 *
 * Client name is flattened into `clientName` at query time so listing
 * cards don't dereference a reference client-side; when there is no
 * linked client, fall back to `anonymousClient`.
 */
const listProjection = groq`
  _id,
  "slug": slug.current,
  title,
  "clientName": coalesce(client->name, anonymousClient),
  category,
  year,
  description,
  heroImage,
  materials,
  featured,
  order
`;

const detailProjection = groq`
  ${listProjection},
  challenge,
  solution,
  results,
  gallery[]{
    _key,
    image,
    alt,
    caption
  },
  seo
`;

export async function getAllProjects(): Promise<ProjectListItem[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch<ProjectListItem[]>(
    groq`*[_type == "project" && defined(slug.current)] | order(order asc, year desc){${listProjection}}`,
  );
}

export async function getFeaturedProjects(
  limit = 3,
): Promise<ProjectListItem[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch<ProjectListItem[]>(
    groq`*[_type == "project" && featured == true && defined(slug.current)] | order(order asc, year desc)[0...$limit]{${listProjection}}`,
    { limit },
  );
}

export async function getProjectsByCategory(
  category: string,
  excludeSlug?: string,
  limit = 2,
): Promise<ProjectListItem[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch<ProjectListItem[]>(
    groq`*[_type == "project" && category == $category && defined(slug.current) && slug.current != $excludeSlug] | order(order asc, year desc)[0...$limit]{${listProjection}}`,
    { category, excludeSlug: excludeSlug ?? "", limit },
  );
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<ProjectDetail | null>(
    groq`*[_type == "project" && slug.current == $slug][0]{${detailProjection}}`,
    { slug },
  );
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch<string[]>(
    groq`*[_type == "project" && defined(slug.current)].slug.current`,
  );
}

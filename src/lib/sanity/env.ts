/**
 * Sanity env resolution.
 *
 * The public site is designed to build and render without Sanity
 * configured — so env vars are optional here. Everything downstream
 * (`client.ts`, queries) treats a missing projectId as "Sanity is
 * disabled" and falls back to local mock data.
 *
 * When Sanity is ready:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxx
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *   SANITY_API_TOKEN=sk...   (only needed for draft preview / writes)
 *   SANITY_REVALIDATE_SECRET=...  (only needed for webhook revalidation)
 */
export const sanityEnv = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  /** Server-only token — do not read this in client components. */
  apiToken: process.env.SANITY_API_TOKEN ?? "",
  revalidateSecret: process.env.SANITY_REVALIDATE_SECRET ?? "",
};

/** True when a project id is configured; queries short-circuit to [] otherwise. */
export const sanityEnabled = sanityEnv.projectId.length > 0;

import { createClient } from "@sanity/client";

import { sanityEnabled, sanityEnv } from "./env";

/**
 * Shared read client.
 *
 * `null` when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset — queries detect
 * this and return empty arrays so the site builds without CMS access.
 * Do not import this directly into client components; fetch server-side
 * and pass results in as props.
 */
export const sanityClient = sanityEnabled
  ? createClient({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      apiVersion: sanityEnv.apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

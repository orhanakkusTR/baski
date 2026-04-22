"use client";

/**
 * Embedded Sanity Studio.
 *
 * Mounts the studio defined in `sanity.config.ts` as a client component
 * at /studio. Catch-all segment (`[[...tool]]`) is required so the
 * studio can use its own nested routing (/studio/vision, /studio/desk,
 * project/document paths, etc.).
 *
 * Without a `NEXT_PUBLIC_SANITY_PROJECT_ID`, the config has an empty
 * projectId and the studio UI will show Sanity's own connection-error
 * screen — that is expected, not a site bug. Add the env var and reload.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}

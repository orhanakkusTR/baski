import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

/**
 * Sanity Studio configuration for AW AB.
 *
 * Mounted two ways:
 *   1. Embedded in Next.js at /studio (see src/app/studio/[[...tool]]/page.tsx)
 *      — the production-visible studio editors use day-to-day.
 *   2. Standalone via `npm run sanity:dev` — a one-off CLI dev server that
 *      reads this same config; useful for schema hacking without the Next
 *      app running. Both paths share this file.
 *
 * Env vars (NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET) are
 * required at studio load time. The site itself degrades gracefully if
 * they are missing (see src/lib/sanity/client.ts), but the studio will
 * refuse to boot without a real project id.
 */
export default defineConfig({
  name: "awab-studio",
  title: "AW AB Content",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],
  schema: {
    types: schemaTypes,
  },
});

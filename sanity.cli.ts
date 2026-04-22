import { defineCliConfig } from "sanity/cli";

/**
 * CLI config for `npx sanity` commands (deploy, graphql, migrate, etc.).
 * Uses the same project/dataset env vars as sanity.config.ts so studio
 * and CLI operate on the same Sanity instance.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  /** Studio host path — matches basePath in sanity.config.ts. */
  studioHost: "awab-studio",
});

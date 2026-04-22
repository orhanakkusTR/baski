import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity image CDN — all assets served through cdn.sanity.io
      // regardless of dataset. Path is /images/{projectId}/{dataset}/{hash}.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default withNextIntl(nextConfig);

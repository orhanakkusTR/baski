import { defineField, defineType } from "sanity";
import { SettingsIcon } from "lucide-react";

/**
 * Site-wide settings.
 *
 * Singleton — the place editors update contact info, social handles,
 * and the default Open Graph image. Business name / legal numbers stay
 * in src/lib/constants.ts because they are structural facts, not
 * content; don't duplicate them here.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: SettingsIcon,
  fields: [
    defineField({
      name: "contactEmail",
      title: "Public contact email",
      type: "string",
      description: "Shown on /contact and in the footer.",
    }),
    defineField({
      name: "contactPhone",
      title: "Public contact phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Office address",
      type: "object",
      fields: [
        { name: "line1", type: "string", title: "Street" },
        { name: "line2", type: "string", title: "Postal + city" },
        { name: "country", type: "string", title: "Country" },
      ],
    }),
    defineField({
      name: "social",
      title: "Social handles",
      type: "object",
      fields: [
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "linkedin", type: "url", title: "LinkedIn" },
      ],
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default Open Graph image",
      type: "image",
      description:
        "Fallback for pages whose own document does not set an SEO image. 1200×630.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});

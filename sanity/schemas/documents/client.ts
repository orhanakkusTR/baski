import { defineField, defineType } from "sanity";
import { BuildingIcon } from "lucide-react";

/**
 * A brand / company we have produced for.
 *
 * Referenced from `project` (the project's client) and from
 * `homePage.featuredClients` (the logo strip). Whether a client shows up
 * publicly anywhere is gated by `publishedConsent` — we do not publish
 * client names without written permission.
 */
export const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  icon: BuildingIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Public-facing brand name.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "SVG preferred. Transparent background.",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      options: {
        list: [
          { title: "Spirits & wine", value: "spirits" },
          { title: "Beauty & cosmetics", value: "beauty" },
          { title: "Fashion & retail", value: "fashion" },
          { title: "Food & beverage", value: "food" },
          { title: "Technology", value: "tech" },
          { title: "Financial services", value: "finance" },
          { title: "Hospitality", value: "hospitality" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "publishedConsent",
      title: "Written consent to publish?",
      type: "boolean",
      description:
        "Must be on for the client to appear on the public site. Our default posture is discretion — flip only when written consent is on file.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", media: "logo", industry: "industry" },
    prepare({ title, media, industry }) {
      return { title, subtitle: industry, media };
    },
  },
});

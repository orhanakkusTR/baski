import { defineField, defineType } from "sanity";
import { HomeIcon } from "lucide-react";

/**
 * Home page content.
 *
 * Singleton — one instance, pinned to the top of the studio structure.
 * Holds the references editors can change without code: the three
 * featured portfolio projects, the client logo strip, the stat counters.
 * Hero/eyebrow text stays in i18n JSON (it's brand voice, not content
 * that rotates) — do not move it here just because Sanity can hold it.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "featuredProjects",
      title: "Featured projects",
      type: "array",
      description:
        "Exactly three projects shown in the home-page featured strip. Order matters — index 0 is the hero banner, 1–2 are the supporting row.",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "featuredClients",
      title: "Featured clients",
      type: "array",
      description:
        "Client logotypes shown in the 'Brands that trust us' strip. Client documents must have written consent on file.",
      of: [{ type: "reference", to: [{ type: "client" }] }],
    }),
    defineField({
      name: "stats",
      title: "Numerical stats",
      type: "object",
      description:
        "The four numbers above the CTA. Labels remain in i18n JSON.",
      fields: [
        { name: "projectsDelivered", title: "Projects delivered", type: "number" },
        { name: "brands", title: "Brands", type: "number" },
        { name: "countries", title: "Countries shipped to", type: "number" },
        { name: "qualityGrade", title: "Quality grade (text)", type: "string" },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home page" }),
  },
});

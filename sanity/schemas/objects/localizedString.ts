import { defineField, defineType } from "sanity";

/**
 * Short, single-line strings that exist in both Swedish and English.
 *
 * Used anywhere the site renders a short label: project titles, client
 * names that need translation, section headings, CTA button copy. For
 * longer rich text, use `localizedText` instead.
 *
 * Swedish is the canonical locale — it is required. English is optional
 * during drafting, but the site will fall back to Swedish if a field is
 * missing on render.
 */
export const localizedString = defineType({
  name: "localizedString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({
      name: "sv",
      title: "Svenska",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
    }),
  ],
  preview: {
    select: { sv: "sv", en: "en" },
    prepare({ sv, en }) {
      return {
        title: sv || "(no sv)",
        subtitle: en ? `en: ${en}` : "en: —",
      };
    },
  },
});

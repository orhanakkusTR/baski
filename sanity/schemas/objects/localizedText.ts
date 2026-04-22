import { defineField, defineType } from "sanity";

/**
 * Long-form rich text in both Swedish and English.
 *
 * Each locale is its own Portable Text array so editors can format
 * paragraphs, lists and quotes independently — a direct translation is
 * rarely a one-to-one split at paragraph level. Use `localizedString`
 * for single-line labels.
 */
export const localizedText = defineType({
  name: "localizedText",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({
      name: "sv",
      title: "Svenska",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "blockContent",
    }),
  ],
});

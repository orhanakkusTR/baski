import { defineField, defineType } from "sanity";

/**
 * SEO overrides for a document.
 *
 * Optional — any field left blank falls back to the document's own
 * title / description / hero image when the page renders its
 * `<head>` metadata (see `generateMetadata` in each page file).
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "localizedString",
      description:
        "Overrides the page title tag. Leave empty to fall back to the document's own title.",
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "localizedString",
      description:
        "Used for <meta name='description'> and Open Graph. Keep under ~160 chars.",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
      description: "1200×630 recommended. Falls back to hero image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noindex",
      title: "Block from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

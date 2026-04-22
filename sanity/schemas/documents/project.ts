import { defineField, defineType } from "sanity";
import { FolderIcon } from "lucide-react";

/**
 * A portfolio project / case study.
 *
 * Category is a simple select (not a reference to a `service` document)
 * so the portfolio list can filter by category without joining — four
 * disciplines are a fixed enum, not a growing taxonomy. For related
 * service pages, use the `services` reference array below (many-to-many:
 * e.g. a launch kit might be filed under both `boxes` and `bags`).
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: FolderIcon,
  fieldsets: [
    { name: "meta", title: "Metadata", options: { collapsible: true } },
    { name: "narrative", title: "Case narrative", options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.sv",
        maxLength: 80,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "client" }],
      description:
        "Links to a client document. If the project is published anonymously, leave blank and fill the `anonymousClient` field instead.",
    }),
    defineField({
      name: "anonymousClient",
      title: "Anonymous client label",
      type: "string",
      description:
        "Optional placeholder shown when the project is public but the client's name is not (e.g. 'Premium spirits brand'). Only used if `client` is not set.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      fieldset: "meta",
      options: {
        list: [
          { title: "Gift boxes", value: "boxes" },
          { title: "Paper bags", value: "bags" },
          { title: "Corporate print", value: "corporate" },
          { title: "A++ Custom", value: "custom" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      fieldset: "meta",
      validation: (rule) => rule.min(2015).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "services",
      title: "Related services",
      type: "array",
      fieldset: "meta",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "materials",
      title: "Materials used",
      type: "array",
      fieldset: "meta",
      description:
        "Short tags shown in the detail page metadata strip (e.g. 'Invercote 300 gsm', 'Hot-foil', 'Magnetic closure').",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "localizedString",
      description:
        "One-line summary shown on the portfolio listing and in featured sections.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "localizedText",
      fieldset: "narrative",
      description: "What the client needed solved.",
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "localizedText",
      fieldset: "narrative",
      description: "How we approached it — construction, material, process.",
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "localizedText",
      fieldset: "narrative",
      description: "Outcomes — volume, turnaround, subsequent engagement.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "galleryImage" }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "If true, eligible to appear on the home page featured strip and service-page case teasers.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first in the portfolio listing.",
      initialValue: 100,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title.sv",
      subtitle: "client.name",
      anonymousClient: "anonymousClient",
      media: "heroImage",
      category: "category",
      year: "year",
    },
    prepare({ title, subtitle, anonymousClient, media, category, year }) {
      const client = subtitle || anonymousClient || "(no client)";
      return {
        title,
        subtitle: `${client} · ${category || "—"} · ${year || "—"}`,
        media,
      };
    },
  },
  orderings: [
    {
      name: "orderAsc",
      title: "Sort order, ascending",
      by: [
        { field: "order", direction: "asc" },
        { field: "year", direction: "desc" },
      ],
    },
    {
      name: "yearDesc",
      title: "Most recent first",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
});

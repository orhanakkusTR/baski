import { defineField, defineType } from "sanity";
import { QuoteIcon } from "lucide-react";

/**
 * A client quote.
 *
 * Quotes are only ever published with written consent — track consent
 * on the client document, not here, so revoking consent pulls every
 * testimonial that references that client. Surfaced in the site UI on
 * the about page and occasional contextual callouts.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: QuoteIcon,
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Name of the person quoted.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / title",
      type: "localizedString",
      description: "e.g. Head of Brand, Creative Director.",
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "client" }],
    }),
    defineField({
      name: "project",
      title: "Related project",
      type: "reference",
      to: [{ type: "project" }],
      description: "Optional — links the quote to a specific case study.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Eligible to appear on the home page rotation.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "attribution", subtitle: "role.sv", quote: "quote.sv" },
    prepare({ title, subtitle }) {
      return { title, subtitle };
    },
  },
});

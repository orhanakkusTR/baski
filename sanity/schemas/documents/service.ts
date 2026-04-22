import { defineField, defineType } from "sanity";
import { BoxIcon } from "lucide-react";

/**
 * A service discipline — matches the four categories hardcoded on the
 * site (boxes / bags / corporate / custom).
 *
 * The category select here is used as the single source of truth that
 * `project.category` references — so a project's category can be
 * filtered without joining through a service document, but detailed
 * service copy (when we decide to make service pages Sanity-driven)
 * lives here.
 */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: BoxIcon,
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description:
        "Stable identifier matching ServiceKey in constants.ts — do not rename once assigned.",
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
      name: "name",
      title: "Name",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "localizedString",
      description: "One line, used in nav and service cards.",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first in listings.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name.sv", subtitle: "key" },
  },
  orderings: [
    {
      name: "orderAsc",
      title: "Sort order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

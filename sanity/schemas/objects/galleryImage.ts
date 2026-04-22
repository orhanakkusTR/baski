import { defineField, defineType } from "sanity";

/**
 * A single gallery image with an optional caption and alt text.
 *
 * Used as an array member on project documents. Alt text is required
 * (accessibility); caption is optional and only shown below the image
 * in the gallery lightbox, not in the grid thumbnail view.
 */
export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "localizedString",
      description:
        "Describe the image for screen readers and when the image fails to load. Required.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localizedString",
      description: "Shown under the image in lightbox view.",
    }),
  ],
  preview: {
    select: { media: "image", title: "alt.sv", subtitle: "caption.sv" },
  },
});

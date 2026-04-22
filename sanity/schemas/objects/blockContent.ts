import { defineArrayMember, defineType } from "sanity";

/**
 * Portable Text configuration used by all rich-text fields.
 *
 * Deliberately narrow — this is editorial body copy (case-study
 * paragraphs, about-page history, service descriptions), not a
 * full-featured blog editor. No headings beyond H2/H3, no code blocks,
 * no checklists, no image embeds (gallery imagery lives on its own
 * `galleryImage` array so it renders outside the text flow).
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "External link",
            fields: [
              { name: "href", type: "url", title: "URL" },
              {
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
  ],
});

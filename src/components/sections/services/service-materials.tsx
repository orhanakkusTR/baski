import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export interface MaterialGroup {
  title: string;
  description: string;
  tags: string[];
}

interface ServiceMaterialsProps {
  eyebrow: string;
  heading: string;
  description?: string;
  groups: MaterialGroup[];
}

/**
 * Materials & finishing options.
 *
 * A banded section (border-y on paper) that presents grouped specs as
 * editorial cards — each card has a short title, a one-sentence note on
 * where that group fits, and a row of tag pills naming the actual
 * options. Tag pills are typographic (mono caption, hairline border) so
 * they read as specifications, not marketing chips.
 */
export function ServiceMaterials({
  eyebrow,
  heading,
  description,
  groups,
}: ServiceMaterialsProps) {
  return (
    <section
      aria-labelledby="service-materials-heading"
      className="border-y border-ink/10 bg-paper"
    >
      <Container className="py-12 md:py-16 lg:py-20">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          size="md"
        />

        <ul
          id="service-materials-heading"
          className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12"
        >
          {groups.map((group, i) => (
            <li key={i} className="flex flex-col gap-5 border-t border-ink/15 pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-h4 text-ink">{group.title}</h3>
                <span className="font-mono text-caption uppercase text-stone">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="text-pretty text-body text-stone">
                {group.description}
              </p>
              <ul className="flex flex-wrap gap-2 pt-1">
                {group.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-ink/15 px-3 py-1 font-mono text-caption uppercase tracking-[0.1em] text-ink"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

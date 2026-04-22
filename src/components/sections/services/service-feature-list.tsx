import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export interface FeatureListItem {
  title: string;
  description: string;
}

interface ServiceFeatureListProps {
  eyebrow: string;
  heading: string;
  description?: string;
  items: FeatureListItem[];
}

/**
 * Numbered "Vad vi gör" list — one row per product variant or offer.
 * Left column: section heading (sticky on desktop so titles track the
 * reader). Right column: a numbered rule-separated list matching the
 * process-teaser typography so service pages share a consistent rhythm
 * regardless of item count.
 */
export function ServiceFeatureList({
  eyebrow,
  heading,
  description,
  items,
}: ServiceFeatureListProps) {
  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            description={description}
            size="md"
          />
        </div>

        <ol className="flex flex-col">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-6 border-t border-ink/10 py-6 last:border-b md:gap-10 md:py-8"
            >
              <span className="font-mono text-caption uppercase text-stone md:min-w-10">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="font-display text-h4 text-ink">{item.title}</h3>
                <p className="text-pretty text-body text-stone">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

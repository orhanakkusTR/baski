import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { SectionHeading } from "@/components/shared/section-heading";

export interface CaseTeaserItem {
  label: string;
  summary: string;
  imageLabel: string;
}

interface ServiceCaseTeaserProps {
  eyebrow: string;
  heading: string;
  description?: string;
  viewAllLabel: string;
  items: CaseTeaserItem[];
}

/**
 * Portfolio preview for a service detail page.
 *
 * Two-card teaser that links out to the full /portfolio index (the
 * per-project detail route is still stubbed until ADIM 7). Deliberately
 * light — gives visitors a visual exit to real work without competing
 * with the service page's own conversion path.
 */
export function ServiceCaseTeaser({
  eyebrow,
  heading,
  description,
  viewAllLabel,
  items,
}: ServiceCaseTeaserProps) {
  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          size="md"
        />
        <Link
          href="/portfolio"
          className="group inline-flex items-center gap-2 self-start font-mono text-caption uppercase text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:self-end"
        >
          <span className="relative">
            {viewAllLabel}
            <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
          <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
        {items.map((item, i) => (
          <article key={i} className="flex flex-col gap-5">
            <ImagePlaceholder
              aspect="4/3"
              tone={i === 0 ? "bone" : "stone"}
              label={item.imageLabel}
            />
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-caption uppercase text-stone">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h3 text-ink">{item.label}</h3>
              </div>
            </div>
            <p className="max-w-md text-pretty text-body text-stone">
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </Container>
  );
}

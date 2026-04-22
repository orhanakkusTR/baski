import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/sections/portfolio/project-card";
import type { DisplayProject } from "@/lib/sanity/adapter";

interface ServiceCaseTeaserProps {
  eyebrow: string;
  heading: string;
  description?: string;
  viewAllLabel: string;
  viewProjectLabel: string;
  categoryLabel: string;
  items: DisplayProject[];
}

/**
 * Portfolio preview for a service detail page.
 *
 * Two-card teaser that lifts projects directly from Sanity (filtered
 * by category) — each card is a `ProjectCard` linking to the detail
 * page. When Sanity is empty the caller supplies synthetic
 * `DisplayProject` entries so the section still has content to show.
 * The "Se alla projekt" link at the top right points to `/portfolio`.
 */
export function ServiceCaseTeaser({
  eyebrow,
  heading,
  description,
  viewAllLabel,
  viewProjectLabel,
  categoryLabel,
  items,
}: ServiceCaseTeaserProps) {
  if (items.length === 0) return null;

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

      <ul className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
        {items.map((project) => (
          <li key={project.slug}>
            <ProjectCard
              project={project}
              aspect="aspect-[4/3]"
              viewLabel={viewProjectLabel}
              categoryLabel={categoryLabel}
            />
          </li>
        ))}
      </ul>
    </Container>
  );
}

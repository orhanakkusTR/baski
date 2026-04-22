import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Badge } from "@/components/shared/badge";
import { featuredProjects, type ProjectMock } from "@/lib/mock-projects";
import { cn } from "@/lib/utils";

/**
 * 02 — Featured portfolio showcase.
 *
 * Editorial "feature + supporting" layout for exactly three projects:
 *   1. A single full-width hero project up top (aspect 16/9 landscape) —
 *      the most recent / flagship case. Reads like a magazine opener.
 *   2. Two supporting projects in a 2-col row below (aspect 3/2 each).
 *
 * The previous 1-big-left + 2-stacked-right pattern made the hero image
 * stretch to match the sum of the right column (~1100 px tall at ~500 px
 * wide) — no real project photo fits that aspect naturally. A banner +
 * row reads like a case-study index and lets every image live at a
 * sensible landscape ratio.
 */
export async function PortfolioShowcase() {
  const t = await getTranslations();
  const [featured, ...rest] = featuredProjects;

  return (
    <Container as="section" className="py-24 md:py-32 lg:py-40">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow={t("home.portfolio.eyebrow")}
          heading={t("home.portfolio.heading")}
          description={t("home.portfolio.description")}
          size="md"
        />
        <Link
          href="/portfolio"
          className="group inline-flex items-center gap-2 self-start font-mono text-caption uppercase text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:self-end"
        >
          <span className="relative">
            {t("home.portfolio.viewAll")}
            <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
          <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-16 flex flex-col gap-10 md:gap-14">
        {/* Featured hero — full width, landscape banner */}
        <ProjectCard
          project={featured}
          title={t(featured.titleKey)}
          category={t(`services.${featured.category}.name`)}
          size="hero"
        />

        {/* Supporting projects — 2-col row */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {rest.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              title={t(project.titleKey)}
              category={t(`services.${project.category}.name`)}
              size="small"
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

interface ProjectCardProps {
  project: ProjectMock;
  title: string;
  category: string;
  size: "hero" | "small";
}

function ProjectCard({ project, title, category, size }: ProjectCardProps) {
  const isHero = size === "hero";

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group/project flex flex-col gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isHero ? "aspect-[3/2] md:aspect-[16/9]" : "aspect-[3/2]",
        )}
      >
        <ImagePlaceholder
          label={project.imageLabel}
          fill
          className="transition-transform duration-[900ms] ease-out group-hover/project:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 md:left-6 md:top-6">
          <Badge variant="solid" tone="paper">
            {category}
          </Badge>
        </div>
      </div>

      <div
        className={cn(
          "flex items-start justify-between gap-6",
          isHero && "md:gap-10",
        )}
      >
        <div className="flex flex-col gap-2">
          <span className="font-mono text-caption uppercase text-stone">
            {project.client} · {project.year}
          </span>
          <h3
            className={cn(
              "font-display text-pretty text-ink",
              isHero ? "text-h1 md:text-display-lg" : "text-h3",
            )}
          >
            {title}
          </h3>
        </div>
        <ArrowUpRight
          aria-hidden
          className={cn(
            "shrink-0 text-ink transition-transform duration-300 ease-out group-hover/project:-translate-y-0.5 group-hover/project:translate-x-0.5",
            isHero ? "mt-2 size-6" : "mt-1 size-5",
          )}
        />
      </div>
    </Link>
  );
}

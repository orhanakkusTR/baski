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
 * 03 — Featured portfolio showcase.
 *
 * Same asymmetry pattern as the services grid: a hero card on the left
 * that fills its grid row height, and a flex column of two smaller cards
 * stacked on the right. Mock data for now; swap to a Sanity query in
 * ADIM 7.
 */
export async function PortfolioShowcase() {
  const t = await getTranslations();
  const [hero, ...rest] = featuredProjects;

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

      <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <ProjectCard
          project={hero}
          title={t(hero.titleKey)}
          category={t(`services.${hero.category}.name`)}
          size="large"
        />
        <div className="flex flex-col gap-6 lg:gap-8">
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
  size: "large" | "small";
}

function ProjectCard({ project, title, category, size }: ProjectCardProps) {
  const isLarge = size === "large";

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={cn(
        "group/project flex flex-col gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        // On desktop the hero project fills the full grid row height so
        // the two stacked small cards on the right line up with its bottom.
        isLarge && "lg:h-full",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isLarge
            ? "aspect-[4/5] lg:aspect-auto lg:min-h-[560px] lg:flex-1"
            : "aspect-[3/2]",
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

      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-caption uppercase text-stone">
            {project.client} · {project.year}
          </span>
          <h3
            className={cn(
              "font-display text-pretty text-ink",
              isLarge ? "text-h2" : "text-h3",
            )}
          >
            {title}
          </h3>
        </div>
        <ArrowUpRight
          aria-hidden
          className="size-5 shrink-0 text-ink transition-transform duration-300 ease-out group-hover/project:-translate-y-0.5 group-hover/project:translate-x-0.5"
        />
      </div>
    </Link>
  );
}

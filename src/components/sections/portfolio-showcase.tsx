import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Badge } from "@/components/shared/badge";
import {
  displayFromSanity,
  fallbackDisplayProjects,
  type DisplayProject,
} from "@/lib/sanity/adapter";
import { getFeaturedProjects } from "@/lib/sanity/queries";
import type { Locale } from "@/i18n/routing";
import type { ServiceKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * 02 — Featured portfolio showcase (home page).
 *
 * Editorial "feature + supporting" layout for up to three projects:
 *   index 0 → full-width hero banner (16/9 on md+)
 *   index 1,2 → supporting row, side by side (3/2 each)
 *
 * Data source: Sanity `getFeaturedProjects(3)`. When Sanity is empty
 * (unconfigured or no projects flagged featured), falls back to the
 * three seed projects in `src/lib/mock-projects.ts` so the home page
 * has something real to render even before the CMS is populated.
 */
export async function PortfolioShowcase() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;

  const fromSanity = await getFeaturedProjects(3);
  const projects: DisplayProject[] =
    fromSanity.length > 0
      ? fromSanity.map((p) => displayFromSanity(p, locale))
      : await fallbackDisplayProjects();

  if (projects.length === 0) return null;

  const [featured, ...rest] = projects;
  const categoryLabel = (cat: string) => {
    const map: Record<ServiceKey, string> = {
      boxes: t("services.boxes.name"),
      bags: t("services.bags.name"),
      corporate: t("services.corporate.name"),
      custom: t("services.custom.name"),
    };
    return map[cat as ServiceKey] ?? cat;
  };

  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
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
        <FeaturedCard
          project={featured}
          category={categoryLabel(featured.category)}
          size="hero"
        />

        {rest.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 md:gap-8">
            {rest.map((p) => (
              <FeaturedCard
                key={p.slug}
                project={p}
                category={categoryLabel(p.category)}
                size="small"
              />
            ))}
          </div>
        ) : null}
      </div>
    </Container>
  );
}

interface FeaturedCardProps {
  project: DisplayProject;
  category: string;
  size: "hero" | "small";
}

function FeaturedCard({ project, category, size }: FeaturedCardProps) {
  const isHero = size === "hero";
  const body = (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-bone",
          isHero ? "aspect-[3/2] md:aspect-[16/9]" : "aspect-[3/2]",
        )}
      >
        {project.heroUrl ? (
          <Image
            src={project.heroUrl}
            alt={project.title}
            fill
            priority={isHero}
            sizes={isHero ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover/project:scale-[1.03]"
          />
        ) : (
          <ImagePlaceholder
            label={project.imageLabel}
            fill
            className="transition-transform duration-[900ms] ease-out group-hover/project:scale-[1.03]"
          />
        )}
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
            {project.clientName || "—"}
            {project.year ? ` · ${project.year}` : ""}
          </span>
          <h3
            className={cn(
              "font-display text-pretty text-ink",
              isHero ? "text-h1 md:text-display-lg" : "text-h3",
            )}
          >
            {project.title}
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
    </>
  );

  const wrapperClass = cn(
    "group/project flex flex-col gap-5",
    project.linkable &&
      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
  );

  if (!project.linkable) {
    return <article className={wrapperClass}>{body}</article>;
  }

  return (
    <Link
      href={{ pathname: "/portfolio/[slug]", params: { slug: project.slug } }}
      className={wrapperClass}
    >
      {body}
    </Link>
  );
}

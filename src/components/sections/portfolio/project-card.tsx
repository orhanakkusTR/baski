import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { DisplayProject } from "@/lib/sanity/adapter";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: DisplayProject;
  /** Tailwind aspect class — driven by the grid layout pattern. */
  aspect?: string;
  /** Translated label for the hover overlay CTA (e.g. "Se projekt"). */
  viewLabel: string;
  /** Translated category name for the badge in the card meta row. */
  categoryLabel: string;
  className?: string;
}

/**
 * Editorial portfolio card.
 *
 * One linked unit: image (or placeholder) with a hover overlay, plus a
 * meta row below (client · year | title | arrow). Overlay is a dark ink
 * veil with "Se projekt →" — only shown on hover (mouse) or focus
 * (keyboard). Mobile users fall back to the always-visible meta row,
 * which is itself the link target.
 */
export function ProjectCard({
  project,
  aspect = "aspect-[4/5]",
  viewLabel,
  categoryLabel,
  className,
}: ProjectCardProps) {
  const content = (
    <>
      <div className={cn("relative overflow-hidden bg-bone", aspect)}>
        {project.heroUrl ? (
          <Image
            src={project.heroUrl}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
          />
        ) : (
          <ImagePlaceholder
            label={project.imageLabel}
            fill
            className="transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
          />
        )}

        {/* Hover overlay — dark veil with "Se projekt →". Fades in on
            hover / focus; invisible and non-interactive otherwise. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-end justify-between gap-4 p-5 opacity-0 transition-opacity duration-300 ease-out group-hover/card:opacity-100 group-focus-visible/card:opacity-100 md:p-6"
        >
          <div className="absolute inset-0 bg-ink/55" />
          <span className="relative z-[1] font-mono text-caption uppercase text-paper">
            {viewLabel}
          </span>
          <ArrowUpRight
            aria-hidden
            className="relative z-[1] size-5 text-paper"
          />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-caption uppercase text-stone">
            {project.clientName || "—"}
            {project.year ? ` · ${project.year}` : ""}
            {` · ${categoryLabel}`}
          </span>
          <h3 className="font-display text-h3 text-ink">{project.title}</h3>
        </div>
        <ArrowUpRight
          aria-hidden
          className="mt-1 size-5 shrink-0 text-ink transition-transform duration-300 ease-out group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
        />
      </div>

      {project.description ? (
        <p className="max-w-md text-pretty text-body text-stone">
          {project.description}
        </p>
      ) : null}
    </>
  );

  const classes = cn(
    "group/card flex flex-col gap-5",
    project.linkable &&
      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
    className,
  );

  if (!project.linkable) {
    // Fallback mock projects — no valid detail route yet. Render a
    // plain article so the card still hovers / animates but does not
    // lead to a 404.
    return <article className={classes}>{content}</article>;
  }

  return (
    <Link
      href={{ pathname: "/portfolio/[slug]", params: { slug: project.slug } }}
      className={classes}
    >
      {content}
    </Link>
  );
}

"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { DisplayProject } from "@/lib/sanity/adapter";
import type { ServiceKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ProjectCard } from "./project-card";

/**
 * Layout pattern for the asymmetric grid.
 *
 * 12-column grid on md+. Cards cycle through six slots — the pattern
 * produces two rows of mixed 7/5 + 5/7 splits and alternating 4/5 /
 * 4/3 aspects so the eye moves diagonally down the page instead of
 * scanning a uniform checkerboard. On mobile everything stacks to a
 * single column.
 */
const LAYOUT_PATTERN: Array<{ span: string; aspect: string }> = [
  { span: "md:col-span-7", aspect: "aspect-[4/3]" },
  { span: "md:col-span-5", aspect: "aspect-[4/5]" },
  { span: "md:col-span-5", aspect: "aspect-[4/5]" },
  { span: "md:col-span-7", aspect: "aspect-[4/3]" },
  { span: "md:col-span-12", aspect: "aspect-[16/9]" },
  { span: "md:col-span-6", aspect: "aspect-[3/2]" },
  { span: "md:col-span-6", aspect: "aspect-[3/2]" },
];

interface PortfolioListingProps {
  projects: DisplayProject[];
  viewLabel: string;
  allLabel: string;
  /** Localized category labels, keyed by ServiceKey. */
  categoryLabels: Record<ServiceKey, string>;
  emptyLabel: string;
}

const CATEGORY_ORDER: ServiceKey[] = ["boxes", "bags", "corporate", "custom"];

export function PortfolioListing({
  projects,
  viewLabel,
  allLabel,
  categoryLabels,
  emptyLabel,
}: PortfolioListingProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const active = searchParams.get("category") ?? "all";

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.category === active);
  }, [projects, active]);

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Which categories actually have entries — hide filter pills for
  // empty categories so the bar is not misleading.
  const availableCategories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return CATEGORY_ORDER.filter((c) => set.has(c));
  }, [projects]);

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <div
        role="tablist"
        aria-label="Portfolio categories"
        className="flex flex-wrap gap-2 border-b border-ink/10 pb-6"
      >
        <FilterChip
          label={allLabel}
          active={active === "all"}
          onClick={() => setCategory("all")}
        />
        {availableCategories.map((key) => (
          <FilterChip
            key={key}
            label={categoryLabels[key]}
            active={active === key}
            onClick={() => setCategory(key)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-mono text-caption uppercase text-stone">
          {emptyLabel}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-20">
          {filtered.map((project, i) => {
            const layout = LAYOUT_PATTERN[i % LAYOUT_PATTERN.length];
            return (
              <li key={project.slug} className={cn(layout.span)}>
                <ProjectCard
                  project={project}
                  aspect={layout.aspect}
                  viewLabel={viewLabel}
                  categoryLabel={
                    categoryLabels[project.category as ServiceKey] ??
                    project.category
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={cn(
        "font-mono text-caption uppercase px-3 py-1.5 tracking-[0.1em] transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        active
          ? "text-ink underline underline-offset-[0.35em] decoration-gold decoration-2"
          : "text-stone hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}

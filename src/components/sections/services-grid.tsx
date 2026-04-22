import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { NAVIGATION, type ServiceKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * 01 — Services grid.
 *
 * Four services, equal weight — so the grid is deliberately uniform:
 *   mobile (default) — one column, stack all four.
 *   desktop (md+)    — 2×2 grid, every card the same aspect-[3/2] landscape.
 *
 * An earlier 1-big-left + 3-small-right asymmetric layout forced the hero
 * card to match the sum-height of three stacked right-column cards, which
 * produced a ~900px-tall vertical slab no real packaging photo could fill.
 * Equal treatment across all four reads more like Pentagram's service
 * indexes and respects the fact that none of the four is promoted over
 * the others in navigation.
 */
export async function ServicesGrid() {
  const t = await getTranslations();
  const items = NAVIGATION.footer.services;

  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow={t("home.services.eyebrow")}
          heading={t("home.services.heading")}
          description={t("home.services.description")}
          size="md"
        />
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 self-start font-mono text-caption uppercase text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:self-end"
        >
          <span className="relative">
            {t("home.services.viewAll")}
            <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
          <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
        {items.map((item, i) => (
          <ServiceCard
            key={item.key}
            item={item}
            index={i}
            label={t(`services.${item.key}.name`)}
            description={t(`services.${item.key}.description`)}
          />
        ))}
      </div>
    </Container>
  );
}

interface ServiceCardProps {
  item: { key: ServiceKey; href: import("@/i18n/routing").StaticPathname };
  index: number;
  label: string;
  description: string;
}

function ServiceCard({ item, index, label, description }: ServiceCardProps) {
  return (
    <Link
      href={item.href}
      className="group/card flex flex-col gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      <div className="relative overflow-hidden aspect-[3/2]">
        <ImagePlaceholder
          label={label}
          fill
          className="transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-caption uppercase text-stone">
            {String(index + 1).padStart(2, "0")} — {label}
          </span>
          <h3 className="font-display text-h3 text-ink">
            {label}
          </h3>
        </div>
        <ArrowUpRight
          aria-hidden
          className="mt-1 size-5 shrink-0 text-ink transition-transform duration-300 ease-out group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
        />
      </div>

      <p className="max-w-md text-pretty text-body text-stone">
        {description}
      </p>
    </Link>
  );
}

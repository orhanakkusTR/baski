import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { NAVIGATION, type ServiceKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * 01 — Services grid
 *
 * Editorial asymmetric layout on desktop: one hero-sized card on the left
 * occupying roughly 60% and two rows of three small cards shifting on the
 * right. On mobile, collapses to a single-column stack.
 */
export async function ServicesGrid() {
  const t = await getTranslations();
  const items = NAVIGATION.footer.services;

  const hero = items[0];
  const rest = items.slice(1);

  return (
    <Container as="section" className="py-24 md:py-32 lg:py-40">
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

      <div className="mt-16 grid gap-6 md:grid-cols-5 md:gap-8">
        <ServiceCard
          item={hero}
          index={0}
          large
          className="md:col-span-3 md:row-span-2"
          label={t(`services.${hero.key}.name`)}
          description={t(`services.${hero.key}.description`)}
        />
        {rest.map((item, i) => (
          <ServiceCard
            key={item.key}
            item={item}
            index={i + 1}
            className="md:col-span-2"
            label={t(`services.${item.key}.name`)}
            description={t(`services.${item.key}.description`)}
          />
        ))}
      </div>
    </Container>
  );
}

interface ServiceCardProps {
  item: { key: ServiceKey; href: string };
  index: number;
  large?: boolean;
  label: string;
  description: string;
  className?: string;
}

function ServiceCard({
  item,
  index,
  large = false,
  label,
  description,
  className,
}: ServiceCardProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group/card flex flex-col gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <ImagePlaceholder
          label={label}
          aspect={large ? "4/3" : "4/5"}
          className="transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
        />
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-caption uppercase text-stone">
          {String(index + 1).padStart(2, "0")} · {label}
        </span>
        <ArrowUpRight
          aria-hidden
          className="size-4 text-ink transition-transform duration-300 ease-out group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
        />
      </div>

      <p
        className={cn(
          "text-pretty text-stone",
          large ? "max-w-xl text-body-lg" : "text-body",
        )}
      >
        {description}
      </p>
    </Link>
  );
}

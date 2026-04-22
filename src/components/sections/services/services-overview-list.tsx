import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { NAVIGATION, type ServiceKey } from "@/lib/constants";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Full-width alternating list of the four services.
 *
 * Deliberately different from the homepage's 2×2 grid: the dedicated
 * /services page gives each discipline its own row — big image, its
 * own paragraph, its own "Läs mer" link. Rows alternate image side
 * (L-R-L-R) so the page scans like a magazine index rather than a
 * repeating pattern.
 */
export async function ServicesOverviewList() {
  const t = await getTranslations();
  const items = NAVIGATION.footer.services;

  return (
    <Container as="section" className="py-12 md:py-16 lg:py-20">
      <ul className="flex flex-col gap-16 md:gap-20 lg:gap-28">
        {items.map((item, i) => (
          <OverviewRow
            key={item.key}
            item={item}
            index={i}
            label={t(`services.${item.key}.name`)}
            description={t(`services.${item.key}.description`)}
            readMore={t("nav.learnMore")}
          />
        ))}
      </ul>
    </Container>
  );
}

interface OverviewRowProps {
  item: { key: ServiceKey; href: StaticPathname };
  index: number;
  label: string;
  description: string;
  readMore: string;
}

function OverviewRow({
  item,
  index,
  label,
  description,
  readMore,
}: OverviewRowProps) {
  // Even rows: image left. Odd rows: image right. Mobile always stacks
  // with image first since that's the visual anchor.
  const imageRight = index % 2 === 1;

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "group grid items-center gap-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:gap-12 md:grid-cols-2 lg:gap-20",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            imageRight && "md:order-2",
          )}
        >
          <ImagePlaceholder
            aspect="4/5"
            tone={index === 0 ? "bone" : index === 2 ? "stone" : "bone"}
            label={label}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div
          className={cn(
            "flex flex-col gap-6",
            imageRight && "md:order-1",
          )}
        >
          <span className="font-mono text-caption uppercase text-stone">
            {String(index + 1).padStart(2, "0")} — {label}
          </span>
          <h2 className="font-display text-h1 text-ink">{label}</h2>
          <p className="max-w-md text-pretty text-body-lg text-stone">
            {description}
          </p>
          <span className="mt-2 inline-flex items-center gap-2 font-mono text-caption uppercase text-ink">
            <span className="relative">
              {readMore}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </li>
  );
}

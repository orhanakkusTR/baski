import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { SectionHeading } from "@/components/shared/section-heading";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { CtaBlock } from "@/components/sections/cta-block";
import { PortableBody } from "@/components/sections/portfolio/portable-body";
import {
  ProjectGallery,
  type GalleryItem,
} from "@/components/sections/portfolio/project-gallery";
import { ProjectCard } from "@/components/sections/portfolio/project-card";
import type { Locale } from "@/i18n/routing";
import type { ServiceKey } from "@/lib/constants";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getProjectsByCategory,
} from "@/lib/sanity/queries";
import { displayFromSanity } from "@/lib/sanity/adapter";
import { pickLocale } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

interface PageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateStaticParams() {
  // When Sanity is not configured, return an empty list — the slug
  // route remains valid but no static params are emitted, and visits
  // hit notFound(). Once Sanity is wired, build-time pre-renders every
  // slug found in the dataset.
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    const t = await getTranslations("portfolio.meta");
    return { title: t("title") };
  }
  const title = pickLocale(project.title, locale) ?? "";
  const description = pickLocale(project.description, locale) ?? "";
  const ogImage =
    (project.seo?.ogImage &&
      urlFor(project.seo.ogImage)?.width(1200).height(630).fit("crop").url()) ||
    (project.heroImage &&
      urlFor(project.heroImage)?.width(1200).height(630).fit("crop").url());
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    robots: project.seo?.noindex
      ? { index: false, follow: false }
      : undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations();
  const title = pickLocale(project.title, locale) ?? "";
  const description = pickLocale(project.description, locale) ?? "";
  const categoryLabels: Record<ServiceKey, string> = {
    boxes: t("services.boxes.name"),
    bags: t("services.bags.name"),
    corporate: t("services.corporate.name"),
    custom: t("services.custom.name"),
  };

  const heroUrl = project.heroImage
    ? (urlFor(project.heroImage)
        ?.width(2400)
        .height(1400)
        .fit("crop")
        .auto("format")
        .url() ?? null)
    : null;

  const galleryItems: GalleryItem[] = (project.gallery ?? [])
    .map((g) => {
      const url = urlFor(g.image)
        ?.width(2000)
        .height(2500)
        .fit("max")
        .auto("format")
        .url();
      if (!url) return null;
      return {
        url,
        alt: pickLocale(g.alt, locale) ?? "",
        caption: pickLocale(g.caption, locale),
      } as GalleryItem;
    })
    .filter((g): g is GalleryItem => g !== null);

  const challenge = pickLocale(project.challenge, locale);
  const solution = pickLocale(project.solution, locale);
  const results = pickLocale(project.results, locale);
  const narrativeBlocks = [
    { key: "challenge", heading: t("portfolio.detail.challenge"), body: challenge },
    { key: "solution", heading: t("portfolio.detail.solution"), body: solution },
    { key: "results", heading: t("portfolio.detail.results"), body: results },
  ].filter((b) => b.body && b.body.length > 0);

  const relatedRaw = await getProjectsByCategory(project.category, slug, 3);
  const related = relatedRaw.map((p) => displayFromSanity(p, locale));

  return (
    <>
      {/* Back link + meta strip */}
      <Container as="section" className="pt-8 md:pt-10">
        <Link
          href="/portfolio"
          className="group inline-flex items-center gap-2 font-mono text-caption uppercase text-stone transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <ArrowLeft aria-hidden className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5" />
          <span className="relative">
            {t("portfolio.detail.back")}
            <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
        </Link>
      </Container>

      <Container as="section" className="py-8 md:py-10">
        <div className="flex flex-col gap-6">
          <span className="font-mono text-caption uppercase text-stone">
            {project.clientName || "—"}
            {project.year ? ` · ${project.year}` : ""}
            {` · ${categoryLabels[project.category as ServiceKey] ?? project.category}`}
          </span>
          <h1
            lang="sv"
            className="max-w-4xl text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{title}</HeadingDot>
          </h1>
          <p className="max-w-2xl text-pretty text-body-lg text-stone">
            {description}
          </p>
          {project.materials && project.materials.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-2">
              {project.materials.map((tag) => (
                <li
                  key={tag}
                  className="border border-ink/15 px-3 py-1 font-mono text-caption uppercase tracking-[0.1em] text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>

      {/* Hero image — full-bleed effect inside the container, 16/9 on md+ */}
      <Container as="section" className="py-8 md:py-10">
        <div className="relative aspect-[4/3] overflow-hidden bg-bone md:aspect-[16/9]">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder
              label={`Project · ${title}`}
              fill
              tone="bone"
            />
          )}
        </div>
      </Container>

      {/* Narrative — Challenge / Solution / Results */}
      {narrativeBlocks.length > 0 ? (
        <Container as="section" className="py-12 md:py-16 lg:py-20">
          <div className="flex flex-col gap-16 md:gap-20">
            {narrativeBlocks.map((block, i) => (
              <div
                key={block.key}
                className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-20"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-caption uppercase text-stone">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-h2 text-ink">
                    {block.heading}
                  </h2>
                </div>
                <div className="lg:pt-3">
                  <PortableBody value={block.body!} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      ) : null}

      {/* Gallery */}
      {galleryItems.length > 0 ? (
        <Container as="section" className="py-12 md:py-16 lg:py-20">
          <SectionHeading
            eyebrow={t("portfolio.detail.galleryEyebrow")}
            heading={t("portfolio.detail.galleryHeading")}
            size="md"
          />
          <div className="mt-10">
            <ProjectGallery
              items={galleryItems}
              closeLabel={t("portfolio.detail.close")}
              prevLabel={t("portfolio.detail.prev")}
              nextLabel={t("portfolio.detail.next")}
            />
          </div>
        </Container>
      ) : null}

      {/* Similar projects */}
      {related.length > 0 ? (
        <Container as="section" className="py-12 md:py-16 lg:py-20">
          <SectionHeading
            eyebrow={t("portfolio.detail.similarEyebrow")}
            heading={t("portfolio.detail.similarHeading")}
            size="md"
          />
          <ul className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {related.map((r) => (
              <li key={r.slug}>
                <ProjectCard
                  project={r}
                  aspect="aspect-[4/5]"
                  viewLabel={t("portfolio.viewProject")}
                  categoryLabel={
                    categoryLabels[r.category as ServiceKey] ?? r.category
                  }
                />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      <CtaBlock
        eyebrow={t("portfolio.detail.cta.eyebrow")}
        heading={t("portfolio.detail.cta.heading")}
        description={t("portfolio.detail.cta.description")}
        primary={{ label: t("portfolio.detail.cta.primary"), href: "/quote" }}
        secondary={{
          label: t("portfolio.detail.cta.secondary"),
          href: "/contact",
        }}
      />
    </>
  );
}

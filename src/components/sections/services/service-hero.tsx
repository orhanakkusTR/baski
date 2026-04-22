import { Container } from "@/components/shared/container";
import { HeadingDot } from "@/components/shared/heading-dot";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

interface ServiceHeroProps {
  eyebrow: string;
  heading: string;
  tagline: string;
  imageLabel: string;
}

/**
 * Service detail page hero.
 *
 * Mirrors the about-page hero structure — breaks out of the layout's
 * top padding so the transparent header reads over paper, then sets up
 * a 2-column split: portrait placeholder on the left (swap for real
 * product shot later), eyebrow + h1 + tagline on the right. Heading
 * runs through HeadingDot so the wordmark's gold stamp sits at the end
 * of any sentence that closes with a period.
 */
export function ServiceHero({
  eyebrow,
  heading,
  tagline,
  imageLabel,
}: ServiceHeroProps) {
  return (
    <section className="relative -mt-24 bg-paper md:-mt-28">
      <Container className="grid gap-10 pt-40 pb-12 md:grid-cols-[1.1fr_1fr] md:gap-12 md:pt-48 md:pb-16 lg:gap-16 lg:pt-52 lg:pb-20">
        <div className="relative md:order-2">
          <ImagePlaceholder aspect="4/5" tone="bone" label={imageLabel} />
        </div>
        <div className="flex flex-col gap-8 md:order-1 md:justify-center">
          <span className="font-mono text-caption uppercase text-stone">
            {eyebrow}
          </span>
          <h1
            lang="sv"
            className="text-balance font-display text-ink text-display-lg leading-[1.05] hyphens-auto break-words"
          >
            <HeadingDot>{heading}</HeadingDot>
          </h1>
          <p className="max-w-xl text-pretty text-body-lg text-stone">
            {tagline}
          </p>
        </div>
      </Container>
    </section>
  );
}

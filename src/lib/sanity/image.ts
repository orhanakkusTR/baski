import createImageUrlBuilder, {
  type SanityImageSource,
} from "@sanity/image-url";

import { sanityEnabled, sanityEnv } from "./env";

const builder = sanityEnabled
  ? createImageUrlBuilder({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
    })
  : null;

/**
 * Returns a Sanity image URL builder for a given source.
 *
 * Safe when Sanity is not configured — returns `null`, which callers
 * should already handle (they are rendering fallback imagery anyway).
 *
 *   urlFor(project.heroImage)?.width(1600).height(900).fit("crop").url()
 */
export function urlFor(source: SanityImageSource | undefined | null) {
  if (!source || !builder) return null;
  return builder.image(source);
}

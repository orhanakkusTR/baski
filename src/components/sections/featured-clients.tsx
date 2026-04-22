import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { Marquee } from "@/components/animations/marquee";
import { featuredClients } from "@/lib/mock-clients";

/**
 * 02 — Featured clients marquee.
 *
 * IMPORTANT: all names here are fictional (see `src/lib/mock-clients.ts`).
 * Substitute a real client only after written permission is on file.
 * Swap to Sanity-driven data in Phase 1.5.
 */
export async function FeaturedClients() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="clients-heading"
      className="border-y border-ink/10 bg-paper py-16 md:py-20"
    >
      <Container className="flex flex-col items-center gap-8 pb-10 text-center md:pb-12">
        <span className="font-mono text-caption uppercase text-stone">
          {t("home.clients.eyebrow")}
        </span>
        <h2
          id="clients-heading"
          className="max-w-2xl text-balance font-display text-h3 text-ink"
        >
          {t("home.clients.heading")}
        </h2>
      </Container>

      <Marquee speed={60}>
        {featuredClients.map((client) => (
          <ClientWordmark key={client.name} name={client.name} />
        ))}
      </Marquee>
    </section>
  );
}

function ClientWordmark({ name }: { name: string }) {
  return (
    <span className="group inline-flex shrink-0 items-center gap-4 px-2">
      <span
        aria-hidden
        className="block size-1.5 rounded-full bg-stone/40 transition-colors duration-300 ease-out group-hover:bg-gold"
      />
      <span className="font-display text-h3 leading-none tracking-[-0.02em] text-stone/60 transition-colors duration-300 ease-out group-hover:text-ink">
        {name}
      </span>
    </span>
  );
}

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/**
 * Process FAQ — eight B2B-relevant questions Swedish procurement teams
 * routinely bring up during scoping (lead time, volume, shipping,
 * certifications, NDAs, pricing). Rendered as an editorial accordion
 * (base-ui backed). One question open at a time — multi-open would
 * lengthen the page without adding value.
 */
const FAQ_KEYS = [
  "duration",
  "volume",
  "shipping",
  "certifications",
  "prototyping",
  "nda",
  "revisions",
  "pricing",
] as const;

export async function ProcessFaq() {
  const t = await getTranslations("process.faq");

  return (
    <section
      aria-labelledby="process-faq-heading"
      className="border-y border-ink/10 bg-paper"
    >
      <Container className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-20">
          <SectionHeading
            eyebrow={t("eyebrow")}
            heading={t("heading")}
            description={t("description")}
            size="md"
          />

          <Accordion className="flex flex-col" id="process-faq-heading">
            {FAQ_KEYS.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>{t(`items.${key}.q`)}</AccordionTrigger>
                <AccordionContent>{t(`items.${key}.a`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}

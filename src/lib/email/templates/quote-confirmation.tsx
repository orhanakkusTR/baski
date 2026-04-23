import { Text } from "@react-email/components";

import { EmailHeading, EmailLayout, BRAND_COLORS } from "./_layout";

export interface QuoteConfirmationProps {
  name: string;
  productType: string;
  quantity: number;
  deadline?: string;
  locale: "sv" | "en";
}

const copy = {
  sv: {
    preview: "Vi har mottagit din offertförfrågan — AW AB",
    heading: "Tack för din offertförfrågan.",
    body: [
      "Hej {name}, vi har tagit emot din förfrågan och återkommer med ett konkret förslag inom 48 timmar (vardagar). Offertförfrågningar hanteras personligen — ingen automatiserad återkoppling.",
    ],
    summaryTitle: "Din förfrågan",
    summary: {
      productType: "Produkttyp",
      quantity: "Antal",
      deadline: "Deadline",
    },
    nextTitle: "Vad händer nu?",
    next: [
      "Vi går igenom detaljer och materialval internt.",
      "Vi återkommer inom 48 timmar med ett förslag eller kompletterande frågor.",
      "Om scoping behövs bokar vi en 30-min call för att gå igenom briefen.",
      "Behöver ni signera NDA innan vi börjar — säg till vid första återkopplingen.",
    ],
    productLabels: {
      boxes: "Presentkartonger",
      bags: "Papperskassar",
      corporate: "Företagstryck",
      custom: "A++ Specialproduktion",
    },
  },
  en: {
    preview: "We've received your quote request — AW AB",
    heading: "Thanks for your quote request.",
    body: [
      "Hi {name}, we've received your request and will come back with a concrete proposal within 48 hours (business days). Quote requests are handled personally — no automated reply.",
    ],
    summaryTitle: "Your request",
    summary: {
      productType: "Product type",
      quantity: "Quantity",
      deadline: "Deadline",
    },
    nextTitle: "What happens next?",
    next: [
      "We review details and material choices internally.",
      "Within 48 hours we return with a proposal or follow-up questions.",
      "If scoping is needed we book a 30-min call to walk through the brief.",
      "If you need us to sign an NDA before starting — mention it in the first reply.",
    ],
    productLabels: {
      boxes: "Gift boxes",
      bags: "Paper bags",
      corporate: "Corporate print",
      custom: "A++ Custom production",
    },
  },
} as const;

function SummaryRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Text
      style={{
        fontSize: 13,
        lineHeight: 1.5,
        color: BRAND_COLORS.ink,
        margin: "0 0 8px",
      }}
    >
      <span
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          fontSize: 10,
          color: BRAND_COLORS.stone,
          marginRight: 12,
        }}
      >
        {label}
      </span>
      {value}
    </Text>
  );
}

export function QuoteConfirmationEmail({
  name,
  productType,
  quantity,
  deadline,
  locale,
}: QuoteConfirmationProps) {
  const t = copy[locale];
  const productLabel =
    t.productLabels[productType as keyof typeof t.productLabels] ?? productType;
  const qty = new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-GB").format(
    quantity,
  );
  return (
    <EmailLayout preview={t.preview} locale={locale}>
      <EmailHeading>{t.heading}</EmailHeading>
      {t.body.map((p, i) => (
        <Text
          key={i}
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: BRAND_COLORS.ink,
            margin: "0 0 24px",
          }}
        >
          {p.replace("{name}", name)}
        </Text>
      ))}

      <Text
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: BRAND_COLORS.stone,
          margin: "8px 0 12px",
        }}
      >
        — {t.summaryTitle}
      </Text>
      <div
        style={{
          borderLeft: `2px solid ${BRAND_COLORS.gold}`,
          paddingLeft: 16,
          margin: "0 0 32px",
        }}
      >
        <SummaryRow label={t.summary.productType} value={productLabel} />
        <SummaryRow label={t.summary.quantity} value={qty} />
        <SummaryRow label={t.summary.deadline} value={deadline} />
      </div>

      <Text
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: BRAND_COLORS.stone,
          margin: "0 0 12px",
        }}
      >
        — {t.nextTitle}
      </Text>
      {t.next.map((line, i) => (
        <Text
          key={i}
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: BRAND_COLORS.ink,
            margin: "0 0 8px",
            paddingLeft: 18,
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 8,
              width: 4,
              height: 4,
              borderRadius: 999,
              backgroundColor: BRAND_COLORS.gold,
            }}
          />
          {line}
        </Text>
      ))}
    </EmailLayout>
  );
}

export default QuoteConfirmationEmail;

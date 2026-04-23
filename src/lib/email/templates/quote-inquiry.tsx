import { Text } from "@react-email/components";

import { EmailHeading, EmailLayout, FieldRow, BRAND_COLORS } from "./_layout";

export interface QuoteInquiryProps {
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  productType: string;
  quantity: number;
  dimensions?: string;
  materials?: string;
  deadline?: string;
  budget?: string;
  notes?: string;
  fileCount: number;
  locale: "sv" | "en";
  receivedAt: string;
}

const copy = {
  sv: {
    preview: "Ny offertförfrågan — {productType} · {quantity} st · {company}",
    heading: "Ny offertförfrågan.",
    intro:
      "En ny offertförfrågan har kommit in via awab.se/offert. Eventuella bifogade filer finns som attachments i detta mail. Svara direkt för att nå avsändaren.",
    section1: "Avsändare",
    section2: "Projekt",
    section3: "Noteringar & filer",
    fields: {
      name: "Namn",
      company: "Företag",
      email: "E-post",
      phone: "Telefon",
      website: "Webbplats",
      productType: "Produkttyp",
      quantity: "Antal",
      dimensions: "Ungefärliga mått",
      materials: "Material",
      deadline: "Deadline",
      budget: "Budget",
      notes: "Ytterligare noteringar",
      files: "Bifogade filer",
      receivedAt: "Mottaget",
    },
    productLabels: {
      boxes: "Presentkartonger",
      bags: "Papperskassar",
      corporate: "Företagstryck",
      custom: "A++ Specialproduktion",
    },
    budgetLabels: {
      under50k: "< 50 000 kr",
      range50to150k: "50 000 – 150 000 kr",
      range150to500k: "150 000 – 500 000 kr",
      over500k: "> 500 000 kr",
      flexible: "Flexibel",
    },
    fileCount: (n: number) =>
      n === 0 ? "Inga bifogade filer" : `${n} fil(er) bifogade`,
  },
  en: {
    preview: "New quote request — {productType} · {quantity} units · {company}",
    heading: "New quote request.",
    intro:
      "A new quote request has arrived via awab.se/quote. Any attached files are included in this email. Reply directly to reach the sender.",
    section1: "Sender",
    section2: "Project",
    section3: "Notes & files",
    fields: {
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      website: "Website",
      productType: "Product type",
      quantity: "Quantity",
      dimensions: "Approx. dimensions",
      materials: "Material preference",
      deadline: "Deadline",
      budget: "Budget",
      notes: "Additional notes",
      files: "Attached files",
      receivedAt: "Received",
    },
    productLabels: {
      boxes: "Gift boxes",
      bags: "Paper bags",
      corporate: "Corporate print",
      custom: "A++ Custom production",
    },
    budgetLabels: {
      under50k: "< 50 000 SEK",
      range50to150k: "50 000 – 150 000 SEK",
      range150to500k: "150 000 – 500 000 SEK",
      over500k: "> 500 000 SEK",
      flexible: "Flexible",
    },
    fileCount: (n: number) =>
      n === 0 ? "No files attached" : `${n} file(s) attached`,
  },
} as const;

function SectionHeader({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: BRAND_COLORS.gold,
        fontWeight: 500,
        margin: "32px 0 12px",
      }}
    >
      — {label}
    </Text>
  );
}

export function QuoteInquiryEmail({
  name,
  company,
  email,
  phone,
  website,
  productType,
  quantity,
  dimensions,
  materials,
  deadline,
  budget,
  notes,
  fileCount,
  locale,
  receivedAt,
}: QuoteInquiryProps) {
  const t = copy[locale];
  const productLabel =
    t.productLabels[productType as keyof typeof t.productLabels] ?? productType;
  const budgetLabel = budget
    ? (t.budgetLabels[budget as keyof typeof t.budgetLabels] ?? budget)
    : undefined;

  const preview = t.preview
    .replace("{productType}", productLabel)
    .replace("{quantity}", String(quantity))
    .replace("{company}", company);

  return (
    <EmailLayout preview={preview} locale={locale}>
      <EmailHeading>{t.heading}</EmailHeading>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: BRAND_COLORS.stone,
          margin: "0 0 16px",
        }}
      >
        {t.intro}
      </Text>

      <SectionHeader label={t.section1} />
      <FieldRow label={t.fields.name} value={name} />
      <FieldRow label={t.fields.company} value={company} />
      <FieldRow label={t.fields.email} value={email} />
      <FieldRow label={t.fields.phone} value={phone} />
      <FieldRow label={t.fields.website} value={website} />

      <SectionHeader label={t.section2} />
      <FieldRow label={t.fields.productType} value={productLabel} />
      <FieldRow
        label={t.fields.quantity}
        value={new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-GB").format(quantity)}
      />
      <FieldRow label={t.fields.dimensions} value={dimensions} />
      <FieldRow label={t.fields.materials} value={materials} />
      <FieldRow label={t.fields.deadline} value={deadline} />
      <FieldRow label={t.fields.budget} value={budgetLabel} />

      <SectionHeader label={t.section3} />
      <FieldRow label={t.fields.notes} value={notes} />
      <FieldRow label={t.fields.files} value={t.fileCount(fileCount)} />
      <FieldRow label={t.fields.receivedAt} value={receivedAt} />
    </EmailLayout>
  );
}

export default QuoteInquiryEmail;

import { Text } from "@react-email/components";

import { EmailHeading, EmailLayout, FieldRow, BRAND_COLORS } from "./_layout";

export interface ContactInquiryProps {
  name: string;
  company: string;
  email: string;
  phone?: string;
  message: string;
  locale: "sv" | "en";
  receivedAt: string;
}

const copy = {
  sv: {
    preview: "Ny kontaktförfrågan från {name} ({company})",
    heading: "Ny kontaktförfrågan.",
    intro:
      "En ny kontaktförfrågan har kommit in via awab.se/kontakt. Svara direkt på detta mail för att kontakta avsändaren.",
    fields: {
      name: "Namn",
      company: "Företag",
      email: "E-post",
      phone: "Telefon",
      message: "Meddelande",
      receivedAt: "Mottaget",
    },
  },
  en: {
    preview: "New contact form — {name} ({company})",
    heading: "New contact inquiry.",
    intro:
      "A new contact request has arrived via awab.se/contact. Reply to this email to reach the sender.",
    fields: {
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      message: "Message",
      receivedAt: "Received",
    },
  },
} as const;

export function ContactInquiryEmail({
  name,
  company,
  email,
  phone,
  message,
  locale,
  receivedAt,
}: ContactInquiryProps) {
  const t = copy[locale];
  const preview = t.preview.replace("{name}", name).replace("{company}", company);

  return (
    <EmailLayout preview={preview} locale={locale}>
      <EmailHeading>{t.heading}</EmailHeading>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: BRAND_COLORS.stone,
          margin: "0 0 32px",
        }}
      >
        {t.intro}
      </Text>

      <FieldRow label={t.fields.name} value={name} />
      <FieldRow label={t.fields.company} value={company} />
      <FieldRow label={t.fields.email} value={email} />
      <FieldRow label={t.fields.phone} value={phone} />
      <FieldRow label={t.fields.message} value={message} />
      <FieldRow label={t.fields.receivedAt} value={receivedAt} />
    </EmailLayout>
  );
}

export default ContactInquiryEmail;

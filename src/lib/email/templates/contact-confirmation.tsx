import { Text } from "@react-email/components";

import { EmailHeading, EmailLayout, BRAND_COLORS } from "./_layout";

export interface ContactConfirmationProps {
  name: string;
  message: string;
  locale: "sv" | "en";
}

const copy = {
  sv: {
    preview: "Tack för ditt meddelande — vi återkommer inom 48 timmar",
    heading: "Tack för ditt meddelande.",
    body: [
      "Hej {name}, vi har tagit emot ditt meddelande och återkommer personligen inom 48 timmar, vanligtvis samma dag under kontorstid.",
      "Nedan är en kopia av det vi fick från dig — behåll detta mail som kvittens. Om något saknas, svara bara direkt på detta meddelande.",
    ],
    summary: "Ditt meddelande",
  },
  en: {
    preview: "Thanks for your message — we'll reply within 48 hours",
    heading: "Thanks for your message.",
    body: [
      "Hi {name}, we've received your message and will reply personally within 48 hours — usually the same day during office hours.",
      "Below is a copy of what you sent us — keep this email as a receipt. If anything is missing, just reply to this message.",
    ],
    summary: "Your message",
  },
} as const;

export function ContactConfirmationEmail({
  name,
  message,
  locale,
}: ContactConfirmationProps) {
  const t = copy[locale];
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
            margin: i === 0 ? "0 0 16px" : "0 0 24px",
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
          margin: "24px 0 8px",
        }}
      >
        {t.summary}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: BRAND_COLORS.ink,
          margin: 0,
          whiteSpace: "pre-wrap",
          borderLeft: `2px solid ${BRAND_COLORS.gold}`,
          paddingLeft: 16,
        }}
      >
        {message}
      </Text>
    </EmailLayout>
  );
}

export default ContactConfirmationEmail;

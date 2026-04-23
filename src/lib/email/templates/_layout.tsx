import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

/**
 * Shared email layout.
 *
 * All four AW AB templates render through this wrapper so they share
 * palette, typography fallbacks, and footer. Custom fonts are not
 * reliable across email clients (Gmail / Outlook strip @font-face), so
 * we fall back to Georgia for display copy and the system UI stack for
 * body — both close enough to Fraunces / Inter for readability. The
 * accent gold and paper background come through inline-style values
 * on the elements that need them.
 */

export const BRAND_COLORS = {
  paper: "#F5F1EA",
  ink: "#0A0A0A",
  stone: "#8B8680",
  bone: "#E8E2D5",
  gold: "#C9A961",
} as const;

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  /** Footer locale toggle — same copy in two languages. */
  locale: "sv" | "en";
}

const footerCopy = {
  sv: {
    signOff: "AW AB — Premium förpackningsbyrå",
    address: "Stora Nygatan 12 · 111 27 Stockholm · Sverige",
    org: "Org.nr 556000-0000 · VAT SE556000000001",
    reply: "Svara direkt på detta mail för att komma tillbaka till oss.",
  },
  en: {
    signOff: "AW AB — Premium packaging agency",
    address: "Stora Nygatan 12 · 111 27 Stockholm · Sweden",
    org: "Org.no 556000-0000 · VAT SE556000000001",
    reply: "Reply to this email to get back to us directly.",
  },
} as const;

export function EmailLayout({ preview, children, locale }: EmailLayoutProps) {
  const footer = footerCopy[locale];
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body
          style={{
            backgroundColor: BRAND_COLORS.bone,
            color: BRAND_COLORS.ink,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            margin: 0,
            padding: "40px 16px",
          }}
        >
          <Container
            style={{
              backgroundColor: BRAND_COLORS.paper,
              maxWidth: 600,
              margin: "0 auto",
              padding: "48px 40px",
              borderTop: `4px solid ${BRAND_COLORS.gold}`,
            }}
          >
            <Section>
              <Text
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  margin: 0,
                  color: BRAND_COLORS.ink,
                }}
              >
                AW AB
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: BRAND_COLORS.gold,
                    marginLeft: 8,
                    verticalAlign: "baseline",
                  }}
                />
              </Text>
            </Section>

            <Hr
              style={{
                borderColor: BRAND_COLORS.ink,
                opacity: 0.1,
                margin: "32px 0",
              }}
            />

            {children}

            <Hr
              style={{
                borderColor: BRAND_COLORS.ink,
                opacity: 0.1,
                margin: "40px 0 24px",
              }}
            />

            <Section>
              <Text
                style={{
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: BRAND_COLORS.stone,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  margin: 0,
                }}
              >
                {footer.signOff}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: BRAND_COLORS.stone,
                  margin: "12px 0 0",
                }}
              >
                {footer.address}
                <br />
                {footer.org}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: BRAND_COLORS.stone,
                  margin: "20px 0 0",
                }}
              >
                {footer.reply}
                <br />
                <Link
                  href="https://awab.se"
                  style={{ color: BRAND_COLORS.ink }}
                >
                  awab.se
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/** Used on data rows inside email templates. */
export function FieldRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  if (!value) return null;
  return (
    <Section style={{ margin: "0 0 16px" }}>
      <Text
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: BRAND_COLORS.stone,
          margin: "0 0 4px",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: BRAND_COLORS.ink,
          margin: 0,
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </Text>
    </Section>
  );
}

/** Display heading inside templates — Fraunces-style, falls back to Georgia. */
export function EmailHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 28,
        lineHeight: 1.15,
        fontWeight: 400,
        letterSpacing: "-0.02em",
        color: BRAND_COLORS.ink,
        margin: "0 0 24px",
      }}
    >
      {children}
    </Text>
  );
}

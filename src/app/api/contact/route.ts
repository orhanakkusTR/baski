import { NextResponse } from "next/server";

import { contactSchemaServer } from "@/lib/validations/contact-schema";
import { resend, resendConfig, resendEnabled } from "@/lib/email/resend";
import { ContactInquiryEmail } from "@/lib/email/templates/contact-inquiry";
import { ContactConfirmationEmail } from "@/lib/email/templates/contact-confirmation";

export const runtime = "nodejs";

type BodyLocale = "sv" | "en";

/**
 * POST /api/contact — accepts JSON, re-validates with the server Zod
 * schema, then fires two emails via Resend:
 *
 *   1. Admin inquiry with the form data, Reply-To set to the sender.
 *   2. Customer confirmation echoing the message.
 *
 * When `RESEND_API_KEY` is not configured (dev without creds) the
 * route still returns ok with `{ mock: true }` and logs the payload —
 * lets the UI success state be verified without hitting the network.
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = contactSchemaServer.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const localeRaw = (raw as { locale?: unknown })?.locale;
  const locale: BodyLocale = localeRaw === "en" ? "en" : "sv";
  const data = parsed.data;
  const receivedAt = new Date().toISOString();

  if (!resendEnabled || !resend) {
    console.warn("[contact] RESEND_API_KEY missing — skipping send.", data);
    return NextResponse.json({ ok: true, mock: true });
  }

  try {
    const adminSubject =
      locale === "sv"
        ? `Ny kontaktförfrågan — ${data.name} (${data.company})`
        : `New contact inquiry — ${data.name} (${data.company})`;
    const userSubject =
      locale === "sv"
        ? "Tack för ditt meddelande — AW AB"
        : "Thanks for your message — AW AB";

    await Promise.all([
      resend.emails.send({
        from: resendConfig.from,
        to: [resendConfig.adminTo],
        replyTo: data.email,
        subject: adminSubject,
        react: ContactInquiryEmail({
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          message: data.message,
          receivedAt,
          locale,
        }),
      }),
      resend.emails.send({
        from: resendConfig.from,
        to: [data.email],
        subject: userSubject,
        react: ContactConfirmationEmail({
          name: data.name,
          message: data.message,
          locale,
        }),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "Unable to send right now. Please try again later." },
      { status: 502 },
    );
  }
}

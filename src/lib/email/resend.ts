import { Resend } from "resend";

/**
 * Shared Resend client.
 *
 * `null` when `RESEND_API_KEY` is missing — the API routes check for
 * this and return a clean error instead of throwing. Lets the site
 * build and the forms render without sending creds in dev.
 */
const apiKey = process.env.RESEND_API_KEY ?? "";

export const resend = apiKey.length > 0 ? new Resend(apiKey) : null;

export const resendConfig = {
  from: process.env.CONTACT_EMAIL_FROM ?? "noreply@awab.se",
  adminTo: process.env.CONTACT_EMAIL_TO ?? "info@awab.se",
} as const;

/** Convenience flag — true when `resend` is usable. */
export const resendEnabled = resend !== null;

import { NextResponse } from "next/server";

import {
  FILE_MAX_BYTES,
  FILE_MAX_COUNT,
  quoteSchemaServer,
  validateUploadedFiles,
} from "@/lib/validations/quote-schema";
import { resend, resendConfig, resendEnabled } from "@/lib/email/resend";
import { QuoteInquiryEmail } from "@/lib/email/templates/quote-inquiry";
import { QuoteConfirmationEmail } from "@/lib/email/templates/quote-confirmation";

export const runtime = "nodejs";

/**
 * POST /api/quote — accepts `multipart/form-data`. Procedure:
 *
 *   1. Extract scalar fields from FormData + re-run server Zod schema.
 *   2. Extract files, re-run `validateUploadedFiles` (count / MIME +
 *      extension allowlist / per-file size limit). This is defence in
 *      depth — the client already enforced the same rules.
 *   3. Convert accepted files into Buffer-backed Resend attachments.
 *   4. Send two emails: admin inquiry (with attachments + reply-to) and
 *      user confirmation (scalar summary only, no attachments).
 *
 * Dev without `RESEND_API_KEY` returns `{ ok: true, mock: true }` so the
 * UI success flow can be tested without a live provider.
 */
export async function POST(request: Request) {
  // Some edge proxies cap body sizes — belt-and-braces check the total
  // payload before we spool any files into memory.
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  const hardLimit = (FILE_MAX_BYTES + 1024) * FILE_MAX_COUNT + 16 * 1024;
  if (contentLength > 0 && contentLength > hardLimit) {
    return NextResponse.json(
      { error: "Payload too large." },
      { status: 413 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data." },
      { status: 400 },
    );
  }

  const scalarEntries = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string"),
  );
  const parsed = quoteSchemaServer.safeParse(scalarEntries);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const localeRaw = scalarEntries.locale;
  const locale: "sv" | "en" = localeRaw === "en" ? "en" : "sv";

  // Files: re-validate server-side. Client already filtered, but never trust.
  const files = formData
    .getAll("file")
    .filter((v): v is File => v instanceof File);
  const fileErrors = validateUploadedFiles(files);
  if (fileErrors.length > 0) {
    return NextResponse.json(
      { error: "File validation failed.", files: fileErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const receivedAt = new Date().toISOString();

  if (!resendEnabled || !resend) {
    console.warn("[quote] RESEND_API_KEY missing — skipping send.", {
      ...data,
      files: files.map((f) => ({ name: f.name, size: f.size })),
    });
    return NextResponse.json({ ok: true, mock: true });
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );

  const productSubjectLabel =
    locale === "sv"
      ? {
          boxes: "Presentkartonger",
          bags: "Papperskassar",
          corporate: "Företagstryck",
          custom: "A++ Specialproduktion",
        }[data.productType]
      : {
          boxes: "Gift boxes",
          bags: "Paper bags",
          corporate: "Corporate print",
          custom: "A++ Custom production",
        }[data.productType];

  const adminSubject =
    locale === "sv"
      ? `Ny offertförfrågan — ${productSubjectLabel} · ${data.quantity} st · ${data.company}`
      : `New quote request — ${productSubjectLabel} · ${data.quantity} units · ${data.company}`;
  const userSubject =
    locale === "sv"
      ? "Vi har mottagit din offertförfrågan — AW AB"
      : "We've received your quote request — AW AB";

  try {
    await Promise.all([
      resend.emails.send({
        from: resendConfig.from,
        to: [resendConfig.adminTo],
        replyTo: data.email,
        subject: adminSubject,
        react: QuoteInquiryEmail({
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          website: data.website,
          productType: data.productType,
          quantity: data.quantity,
          dimensions: data.dimensions,
          materials: data.materials,
          deadline: data.deadline,
          budget: data.budget,
          notes: data.notes,
          fileCount: files.length,
          locale,
          receivedAt,
        }),
        attachments,
      }),
      resend.emails.send({
        from: resendConfig.from,
        to: [data.email],
        subject: userSubject,
        react: QuoteConfirmationEmail({
          name: data.name,
          productType: data.productType,
          quantity: data.quantity,
          deadline: data.deadline,
          locale,
        }),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[quote] Resend error:", error);
    return NextResponse.json(
      { error: "Unable to send right now. Please try again later." },
      { status: 502 },
    );
  }
}

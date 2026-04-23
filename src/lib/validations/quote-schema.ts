import { z } from "zod";

/**
 * Quote-form schema. Mirrors contact-schema.ts: client factory for
 * localized messages, server schema with generic structure-only checks.
 *
 * File validation is deliberately kept out of Zod. Files live outside
 * the form-state shape (React Hook Form + files is fiddly), so the
 * file-uploader component validates in a sibling state array and the
 * `/api/quote` route re-validates server-side using the constants below.
 */

export const FILE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
export const FILE_MAX_COUNT = 5;

/**
 * Accepted MIME types for uploads. `application/postscript` covers raw
 * `.ai` files; most modern Illustrator files are PDF-shaped so
 * `application/pdf` also passes. We do not allow `.docx` or office
 * formats — briefs arrive as PDF in this industry.
 */
export const FILE_ACCEPTED_MIME = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/postscript",
  "application/illustrator",
]);

/** Also check by extension so we catch files with a missing/fake MIME. */
export const FILE_ACCEPTED_EXT = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "ai",
  "eps",
]);

export const PRODUCT_TYPES = ["boxes", "bags", "corporate", "custom"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const BUDGET_RANGES = [
  "under50k",
  "range50to150k",
  "range150to500k",
  "over500k",
  "flexible",
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

const phoneRegex = /^[+\d\s\-()]{6,}$/;
const urlRegex = /^https?:\/\/.+/;

/**
 * Value shape used by the client form. Dates come from an <input
 * type="date"> as a YYYY-MM-DD string — converting to Date here would
 * make RHF's defaultValues resetting fiddly; we parse server-side
 * instead.
 */
export type QuoteFormValues = z.infer<ReturnType<typeof makeQuoteSchema>>;

export function makeQuoteSchema(t: (key: string) => string) {
  return z.object({
    // Step 1 — contact & company
    name: z.string().trim().min(2, t("validation.nameMin")),
    company: z.string().trim().min(2, t("validation.companyMin")),
    email: z.string().trim().email(t("validation.emailInvalid")),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || phoneRegex.test(v),
        t("validation.phoneInvalid"),
      ),
    website: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || urlRegex.test(v),
        t("validation.websiteInvalid"),
      ),

    // Step 2 — project
    productType: z.enum(PRODUCT_TYPES, {
      message: t("validation.productTypeRequired"),
    }),
    // Kept as a string on the client — HTML `<input type="number">`
    // delivers a string regardless, and piping through a transform
    // makes RHF's input/output types diverge. Server coerces to int.
    quantity: z
      .string()
      .trim()
      .min(1, t("validation.quantityPositive"))
      .regex(/^\d+$/, t("validation.quantityInteger"))
      .refine(
        (v) => Number.parseInt(v, 10) > 0,
        t("validation.quantityPositive"),
      )
      .refine(
        (v) => Number.parseInt(v, 10) <= 1_000_000,
        t("validation.quantityInteger"),
      ),
    dimensions: z
      .string()
      .trim()
      .max(500, t("validation.dimensionsMax"))
      .optional(),
    materials: z
      .string()
      .trim()
      .max(500, t("validation.materialsMax"))
      .optional(),
    /** ISO date string from <input type="date">. Optional — some briefs
     *  are pre-deadline. */
    deadline: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || !Number.isNaN(new Date(v).getTime()),
        t("validation.deadlineInvalid"),
      ),
    budget: z.enum(BUDGET_RANGES).optional(),

    // Step 3 — notes. Files are tracked outside RHF state (see
    // quote-form.tsx) and attached to the final FormData submission.
    notes: z
      .string()
      .trim()
      .max(2000, t("validation.notesMax"))
      .optional(),
  });
}

/** Server schema — all fields come in as strings from FormData. */
export const quoteSchemaServer = z.object({
  name: z.string().trim().min(2).max(200),
  company: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || phoneRegex.test(v)),
  website: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || urlRegex.test(v)),
  productType: z.enum(PRODUCT_TYPES),
  quantity: z.coerce.number().int().positive().max(1_000_000),
  dimensions: z.string().trim().max(500).optional(),
  materials: z.string().trim().max(500).optional(),
  deadline: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || !Number.isNaN(new Date(v).getTime())),
  budget: z.enum(BUDGET_RANGES).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export interface FileValidationError {
  name: string;
  reason: "size" | "type" | "count";
}

/**
 * Server-side file gate. Enforces count, per-file size and the
 * MIME + extension allowlists. Returns a structured list of rejections
 * so the route can log what was dropped; validation passes when the
 * returned array is empty.
 */
export function validateUploadedFiles(files: File[]): FileValidationError[] {
  const errors: FileValidationError[] = [];
  if (files.length > FILE_MAX_COUNT) {
    return files
      .slice(FILE_MAX_COUNT)
      .map((f) => ({ name: f.name, reason: "count" as const }));
  }
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeOk = FILE_ACCEPTED_MIME.has(file.type) || file.type === "";
    const extOk = FILE_ACCEPTED_EXT.has(ext);
    if (!mimeOk || !extOk) {
      errors.push({ name: file.name, reason: "type" });
      continue;
    }
    if (file.size > FILE_MAX_BYTES) {
      errors.push({ name: file.name, reason: "size" });
    }
  }
  return errors;
}

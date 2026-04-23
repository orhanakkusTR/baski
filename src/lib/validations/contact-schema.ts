import { z } from "zod";

/**
 * Contact-form schema. Two factories:
 *
 * `makeContactSchema(t)` — for the client form. Pass in the next-intl
 * `t` function so validation messages render in the user's locale.
 *
 * `contactSchemaServer` — for the API route. Generic messages in English;
 * the client already validated, so server-side failures here mean someone
 * bypassed the UI (e.g. hand-crafted fetch). No need to localize.
 */

const phoneRegex = /^[+\d\s\-()]{6,}$/;

export type ContactFormValues = z.infer<typeof contactSchemaServer>;

export function makeContactSchema(t: (key: string) => string) {
  return z.object({
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
    message: z
      .string()
      .trim()
      .min(10, t("validation.messageMin"))
      .max(2000, t("validation.messageMax")),
  });
}

/** Server schema — structure only, generic messages. */
export const contactSchemaServer = z.object({
  name: z.string().trim().min(2).max(200),
  company: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || phoneRegex.test(v)),
  message: z.string().trim().min(10).max(2000),
});

"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowUpRight, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { buttonVariants } from "@/components/ui/button";
import {
  fieldClass,
  formLabelClass,
  textareaClass,
} from "@/components/forms/form-primitives";
import { FormSuccess } from "@/components/forms/form-success";
import { makeContactSchema } from "@/lib/validations/contact-schema";
import { cn } from "@/lib/utils";

/**
 * Contact form — single-column editorial layout, hairline inputs.
 *
 * Submits JSON to /api/contact. Resend is fired server-side (admin
 * inbox + customer confirmation). On success, the form frame is
 * replaced by a FormSuccess block — not a toast, since the form is
 * itself a page section.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const schema = useMemo(() => makeContactSchema(t), [t]);
  type FormValues = z.infer<ReturnType<typeof makeContactSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", email: "", phone: "", message: "" },
    mode: "onBlur",
  });

  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setSubmitState("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? t("errors.generic"));
        setSubmitState("error");
        return;
      }
      setSubmitState("success");
      form.reset();
    } catch {
      setErrorMessage(t("errors.network"));
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <FormSuccess
        eyebrow={t("success.eyebrow")}
        heading={t("success.heading")}
        body={t("success.body")}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
        <div className="grid gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={formLabelClass}>
                  {t("fields.name")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    autoComplete="name"
                    className={fieldClass}
                    placeholder={t("placeholders.name")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={formLabelClass}>
                  {t("fields.company")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    autoComplete="organization"
                    className={fieldClass}
                    placeholder={t("placeholders.company")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={formLabelClass}>
                  {t("fields.email")}
                </FormLabel>
                <FormControl>
                  <input
                    type="email"
                    autoComplete="email"
                    className={fieldClass}
                    placeholder={t("placeholders.email")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={formLabelClass}>
                  {t("fields.phone")}{" "}
                  <span className="text-stone/60 normal-case">
                    ({t("optional")})
                  </span>
                </FormLabel>
                <FormControl>
                  <input
                    type="tel"
                    autoComplete="tel"
                    className={fieldClass}
                    placeholder={t("placeholders.phone")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>
                {t("fields.message")}
              </FormLabel>
              <FormControl>
                <textarea
                  rows={6}
                  className={textareaClass}
                  placeholder={t("placeholders.message")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitState === "error" && errorMessage ? (
          <p role="alert" className="text-body-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col items-start gap-4 pt-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {submitState === "submitting" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ArrowUpRight className="size-4" aria-hidden />
            )}
            {submitState === "submitting" ? t("submitting") : t("submit")}
          </button>
          <p className="max-w-md text-body-sm text-stone">{t("responseTime")}</p>
        </div>
      </form>
    </Form>
  );
}

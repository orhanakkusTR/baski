"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowLeft, ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";

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
  selectClass,
  textareaClass,
} from "@/components/forms/form-primitives";
import { FormSuccess } from "@/components/forms/form-success";
import { FileUploader } from "@/components/forms/file-uploader";
import {
  BUDGET_RANGES,
  PRODUCT_TYPES,
  makeQuoteSchema,
} from "@/lib/validations/quote-schema";
import { cn } from "@/lib/utils";

type FormValues = z.infer<ReturnType<typeof makeQuoteSchema>>;

/**
 * Which fields belong to which step. Used to target per-step validation
 * with `form.trigger(stepFields)` — advancing to the next step only if
 * the current step's inputs are valid.
 */
const STEP_FIELDS: Record<1 | 2 | 3, Path<FormValues>[]> = {
  1: ["name", "company", "email", "phone", "website"],
  2: [
    "productType",
    "quantity",
    "dimensions",
    "materials",
    "deadline",
    "budget",
  ],
  3: ["notes"],
};

type StepNumber = 1 | 2 | 3;

/**
 * Three-step quote form.
 *
 * Step 1 — person & company
 * Step 2 — project details
 * Step 3 — files + notes + submit
 *
 * All scalar fields live in one React Hook Form instance so moving
 * between steps preserves state without extra plumbing. Files are
 * held in a sibling `useState<File[]>` (RHF + uncontrolled file
 * inputs is finicky); both get assembled into FormData at submit.
 * The `/api/quote` route re-validates server-side.
 */
export function QuoteForm() {
  const t = useTranslations("quote");
  const locale = useLocale();
  const schema = useMemo(() => makeQuoteSchema(t), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      website: "",
      productType: undefined,
      quantity: "",
      dimensions: "",
      materials: "",
      deadline: "",
      budget: undefined,
      notes: "",
    },
    mode: "onBlur",
  });

  const [step, setStep] = useState<StepNumber>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function goNext() {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (!valid) return;
    if (step < 3) setStep((step + 1) as StepNumber);
  }

  function goBack() {
    if (step > 1) setStep((step - 1) as StepNumber);
  }

  async function onSubmit(values: FormValues) {
    setSubmitState("submitting");
    setErrorMessage(null);

    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null || value === "") continue;
      formData.append(key, String(value));
    }
    formData.append("locale", locale);
    for (const file of files) formData.append("file", file);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? t("errors.generic"));
        setSubmitState("error");
        return;
      }
      setSubmitState("success");
      form.reset();
      setFiles([]);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-10"
        noValidate
      >
        <ProgressIndicator step={step} labels={{
          prefix: t("progress.prefix"),
          of: t("progress.of"),
          stepLabels: {
            1: t("steps.contact.label"),
            2: t("steps.project.label"),
            3: t("steps.files.label"),
          }
        }} />

        <div className="flex flex-col gap-10">
          <div className={cn(step === 1 ? "block" : "hidden")}>
            <StepOne />
          </div>
          <div className={cn(step === 2 ? "block" : "hidden")}>
            <StepTwo />
          </div>
          <div className={cn(step === 3 ? "block" : "hidden")}>
            <StepThree files={files} onFilesChange={setFiles} />
          </div>
        </div>

        {submitState === "error" && errorMessage ? (
          <p role="alert" className="text-body-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col items-stretch gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || submitState === "submitting"}
            className={cn(
              "inline-flex items-center gap-2 self-start font-mono text-caption uppercase text-ink transition-colors hover:text-stone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            {t("back")}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
              )}
            >
              {t("next")}
              <ArrowRight className="size-4" aria-hidden />
            </button>
          ) : (
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
          )}
        </div>
      </form>
    </Form>
  );
}

interface ProgressIndicatorProps {
  step: StepNumber;
  labels: {
    prefix: string;
    of: string;
    stepLabels: Record<StepNumber, string>;
  };
}

function ProgressIndicator({ step, labels }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-caption uppercase tracking-[0.18em] text-stone">
          {labels.prefix} {String(step).padStart(2, "0")} {labels.of} 03
        </span>
        <span className="font-mono text-caption uppercase tracking-[0.18em] text-ink">
          {labels.stepLabels[step]}
        </span>
      </div>
      <div
        aria-hidden
        className="relative h-px w-full bg-ink/15"
      >
        <div
          className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

function StepOne() {
  const t = useTranslations("quote");
  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        index="01"
        title={t("steps.contact.heading")}
        description={t("steps.contact.description")}
      />
      <div className="grid gap-8 md:grid-cols-2">
        <FormFieldText name="name" label={t("fields.name")} autoComplete="name" />
        <FormFieldText
          name="company"
          label={t("fields.company")}
          autoComplete="organization"
        />
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <FormFieldText
          name="email"
          type="email"
          label={t("fields.email")}
          autoComplete="email"
        />
        <FormFieldText
          name="phone"
          type="tel"
          label={
            <>
              {t("fields.phone")}{" "}
              <span className="text-stone/60 normal-case">
                ({t("optional")})
              </span>
            </>
          }
          autoComplete="tel"
        />
      </div>
      <FormFieldText
        name="website"
        type="url"
        label={
          <>
            {t("fields.website")}{" "}
            <span className="text-stone/60 normal-case">
              ({t("optional")})
            </span>
          </>
        }
        autoComplete="url"
        placeholder="https://"
      />
    </div>
  );
}

function StepTwo() {
  const t = useTranslations("quote");

  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        index="02"
        title={t("steps.project.heading")}
        description={t("steps.project.description")}
      />
      <div className="grid gap-8 md:grid-cols-2">
        <FormField
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>
                {t("fields.productType")}
              </FormLabel>
              <FormControl>
                <select
                  className={selectClass}
                  {...field}
                  value={field.value ?? ""}
                >
                  <option value="" disabled>
                    {t("placeholders.productType")}
                  </option>
                  {PRODUCT_TYPES.map((key) => (
                    <option key={key} value={key}>
                      {t(`productTypes.${key}`)}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormFieldText
          name="quantity"
          type="number"
          inputMode="numeric"
          min="1"
          label={t("fields.quantity")}
          placeholder={t("placeholders.quantity")}
        />
      </div>

      <FormFieldText
        name="dimensions"
        label={
          <>
            {t("fields.dimensions")}{" "}
            <span className="text-stone/60 normal-case">
              ({t("optional")})
            </span>
          </>
        }
        placeholder={t("placeholders.dimensions")}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <FormFieldText
          name="materials"
          label={
            <>
              {t("fields.materials")}{" "}
              <span className="text-stone/60 normal-case">
                ({t("optional")})
              </span>
            </>
          }
          placeholder={t("placeholders.materials")}
        />
        <FormFieldText
          name="deadline"
          type="date"
          label={
            <>
              {t("fields.deadline")}{" "}
              <span className="text-stone/60 normal-case">
                ({t("optional")})
              </span>
            </>
          }
        />
      </div>

      <FormField
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>
              {t("fields.budget")}{" "}
              <span className="text-stone/60 normal-case">
                ({t("optional")})
              </span>
            </FormLabel>
            <FormControl>
              <select
                className={selectClass}
                {...field}
                value={field.value ?? ""}
              >
                <option value="">
                  {t("placeholders.budget")}
                </option>
                {BUDGET_RANGES.map((key) => (
                  <option key={key} value={key}>
                    {t(`budgetRanges.${key}`)}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

interface StepThreeProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

function StepThree({ files, onFilesChange }: StepThreeProps) {
  const t = useTranslations("quote");
  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        index="03"
        title={t("steps.files.heading")}
        description={t("steps.files.description")}
      />

      <div className="flex flex-col gap-3">
        <span className={formLabelClass}>
          {t("fields.files")}{" "}
          <span className="text-stone/60 normal-case">({t("optional")})</span>
        </span>
        <FileUploader value={files} onChange={onFilesChange} />
      </div>

      <FormField
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>
              {t("fields.notes")}{" "}
              <span className="text-stone/60 normal-case">
                ({t("optional")})
              </span>
            </FormLabel>
            <FormControl>
              <textarea
                rows={5}
                className={textareaClass}
                placeholder={t("placeholders.notes")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function StepHeading({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-caption uppercase tracking-[0.18em] text-stone">
        {index} · {title}
      </span>
      <p className="max-w-xl text-pretty text-body-lg text-stone">
        {description}
      </p>
    </div>
  );
}

interface FormFieldTextProps {
  name: Path<FormValues>;
  label: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "url";
  min?: string;
}

function FormFieldText({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  min,
}: FormFieldTextProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={formLabelClass}>{label}</FormLabel>
          <FormControl>
            <input
              type={type}
              autoComplete={autoComplete}
              inputMode={inputMode}
              min={min}
              placeholder={placeholder}
              className={fieldClass}
              {...field}
              value={(field.value as string | number | undefined) ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

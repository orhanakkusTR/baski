import { CheckCircle2 } from "lucide-react";

interface FormSuccessProps {
  eyebrow: string;
  heading: string;
  body: string;
}

/**
 * Replaces the form on successful submission. Editorial, not a toast —
 * the form is a significant page section so the resolution should live
 * in the same frame, not a ribbon at the top.
 */
export function FormSuccess({ eyebrow, heading, body }: FormSuccessProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-6 border-l-2 border-gold pl-6 md:pl-8"
    >
      <span className="inline-flex items-center gap-3 font-mono text-caption uppercase tracking-[0.15em] text-stone">
        <CheckCircle2 aria-hidden className="size-4 text-gold" strokeWidth={1.5} />
        {eyebrow}
      </span>
      <h2 className="font-display text-h1 text-balance text-ink">{heading}</h2>
      <p className="max-w-xl text-pretty text-body-lg text-stone">{body}</p>
    </div>
  );
}

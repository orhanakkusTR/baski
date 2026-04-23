import { cn } from "@/lib/utils";

/**
 * Editorial form field styling.
 *
 * The shadcn default <Input /> ships with a shorter, rounded box style
 * that reads like an admin panel. AW AB forms use Pentagram-style
 * hairline-underline inputs — single bottom border that warms to ink
 * on focus. These class constants are applied to native <input> /
 * <textarea> / <select> elements rendered inside the react-hook-form
 * primitives.
 */

export const fieldBase =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-body-lg text-ink placeholder:text-stone/60 transition-colors rounded-none";

export const fieldFocus =
  "focus:border-ink focus:outline-none focus-visible:ring-0";

export const fieldInvalid =
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:border-destructive";

export const fieldClass = cn(fieldBase, fieldFocus, fieldInvalid);

/** Textarea gets a top border so multi-line input still feels bounded. */
export const textareaClass = cn(
  "w-full resize-y border border-ink/20 bg-transparent px-4 py-4 text-body-lg text-ink placeholder:text-stone/60 transition-colors rounded-none min-h-[140px]",
  fieldFocus,
  "focus:border-ink",
  fieldInvalid,
);

export const selectClass = cn(fieldBase, fieldFocus, fieldInvalid, "appearance-none pr-8 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238B8680%22 stroke-width=%221.5%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:14px] bg-[right_0.25rem_center] bg-no-repeat");

export const formLabelClass =
  "font-mono text-caption uppercase tracking-[0.15em] text-stone";

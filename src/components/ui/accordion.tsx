"use client";

import { forwardRef } from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Minimal, editorial accordion built on @base-ui/react.
 *
 * Shape:
 *   <Accordion>
 *     <AccordionItem value="q1">
 *       <AccordionTrigger>Question</AccordionTrigger>
 *       <AccordionContent>Answer</AccordionContent>
 *     </AccordionItem>
 *   </Accordion>
 *
 * Styling is typographic only — a hairline rule, serif question, plus
 * icon that rotates to an ×. The panel animates height via the
 * `data-open` attribute that base-ui sets (height transition in CSS)
 * plus opacity for polish. Keyboard + a11y are handled by base-ui.
 */

export const Accordion = BaseAccordion.Root;

interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Item> {}

export const AccordionItem = forwardRef<
  React.ComponentRef<typeof BaseAccordion.Item>,
  AccordionItemProps
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <BaseAccordion.Item
      ref={ref}
      className={cn("border-t border-ink/15 last:border-b", className)}
      {...props}
    />
  );
});

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> {}

export const AccordionTrigger = forwardRef<
  React.ComponentRef<typeof BaseAccordion.Trigger>,
  AccordionTriggerProps
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <BaseAccordion.Header className="flex">
      <BaseAccordion.Trigger
        ref={ref}
        className={cn(
          "group/trigger flex flex-1 items-center justify-between gap-6 py-6 text-left font-display text-h3 text-ink transition-colors md:py-8",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
          className,
        )}
        {...props}
      >
        <span className="flex-1 text-pretty">{children}</span>
        <Plus
          aria-hidden
          strokeWidth={1.5}
          className="size-6 shrink-0 text-ink transition-transform duration-300 ease-out group-data-[panel-open]/trigger:rotate-45"
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
});

interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel> {}

/**
 * base-ui exposes `--accordion-panel-height` as a CSS custom property on
 * the panel element when the accordion measures itself, so we can
 * transition a real height value instead of animating max-height to an
 * arbitrary ceiling.
 */
export const AccordionContent = forwardRef<
  React.ComponentRef<typeof BaseAccordion.Panel>,
  AccordionContentProps
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <BaseAccordion.Panel
      ref={ref}
      className={cn(
        "overflow-hidden transition-[height,opacity] duration-300 ease-out",
        "h-[var(--accordion-panel-height)] opacity-100",
        "data-[ending-style]:h-0 data-[ending-style]:opacity-0",
        "data-[starting-style]:h-0 data-[starting-style]:opacity-0",
      )}
      {...props}
    >
      <div
        className={cn(
          "max-w-2xl pb-6 pr-10 text-pretty text-body-lg text-stone md:pb-8",
          className,
        )}
      >
        {children}
      </div>
    </BaseAccordion.Panel>
  );
});

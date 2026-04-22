import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-[background-color,color,border-color,opacity] duration-150 ease-out outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "rounded-sm bg-ink text-paper hover:bg-ink/90 active:bg-ink",
        outline:
          "rounded-sm border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
        ghost:
          "rounded-sm bg-transparent text-ink hover:bg-bone",
        link:
          "h-auto rounded-none px-0 py-0 text-ink underline-offset-[6px] decoration-[1px] hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm tracking-wide",
        md: "h-11 px-5 text-base tracking-wide",
        lg: "h-12 px-6 text-base tracking-wide md:h-14 md:px-8 md:text-lg",
        icon: "size-11",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        size: ["sm", "md", "lg", "icon"],
        className: "h-auto px-0 py-0",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };

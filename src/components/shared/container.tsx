import { cn } from "@/lib/utils";

interface ContainerProps extends React.ComponentProps<"div"> {
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
  bleed?: boolean;
}

export function Container({
  as: Tag = "div",
  bleed = false,
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(!bleed && "container-edge", className)}
      {...props}
    />
  );
}

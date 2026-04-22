"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
  splitBy?: "word" | "line";
}

export function TextReveal({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.08,
  once = true,
  amount = 0.5,
  splitBy = "word",
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const segments =
    splitBy === "line" ? text.split("\n") : text.split(/(\s+)/);

  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{text}</StaticTag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {segments.map((segment, i) => {
        const isWhitespace = /^\s+$/.test(segment);
        if (isWhitespace) return segment;

        return (
          <span
            key={i}
            className={cn(
              "inline-block overflow-hidden align-[0.1em]",
              splitBy === "line" && "block",
            )}
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: { y: "0%", opacity: 1 },
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {segment}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}

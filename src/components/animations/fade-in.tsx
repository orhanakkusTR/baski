"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition" | "whileInView" | "viewport"> {
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  amount?: number;
  as?: keyof typeof motion;
}

export function FadeIn({
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  amount = 0.2,
  children,
  ...props
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const { className, style, id } =
      props as unknown as React.HTMLAttributes<HTMLDivElement>;
    return (
      <div className={className} style={style} id={id}>
        {children as React.ReactNode}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

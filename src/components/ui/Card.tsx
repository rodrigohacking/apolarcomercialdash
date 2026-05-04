import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = ({ children, className, hover = false, ...props }: CardProps) => {
  return (
    <motion.div
      className={cn(
        "surface-card relative overflow-hidden p-6 transition-all duration-300",
        hover && "hover:border-white/20 hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

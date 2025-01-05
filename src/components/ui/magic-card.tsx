"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientColor?: string;
  glowColor?: string;
  children: React.ReactNode;
}

export function MagicCard({
  children,
  className,
  gradientColor = "rgba(0, 255, 255, 0.05)",
  glowColor = "rgba(0, 255, 255, 0.2)",
  ...props
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const { left, top } = ref.current.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    },
    [mouseX, mouseY]
  );

  const background = useMotionTemplate`radial-gradient(
    600px circle at ${mouseX}px ${mouseY}px,
    ${gradientColor},
    transparent 80%
  )`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-xl bg-black/40 backdrop-blur-sm transition-all",
        "border border-white/10 hover:border-white/20",
        className
      )}
      style={{
        background,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

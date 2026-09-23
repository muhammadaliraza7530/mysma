import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Card that lights its border/glow on hover (desktop) and automatically —
 * one at a time — as it passes the centre of the viewport (mobile).
 */
export function GlowCard({
  children,
  className = "",
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const active = useInView(ref, { margin: "-42% 0px -42% 0px" });

  return (
    <motion.div
      ref={ref}
      whileHover={tilt ? { y: -10, rotateX: 6, rotateY: -6 } : { y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformPerspective: 900 }}
      className={`glass-card transition-shadow duration-500 hover:edge-glow ${
        active ? "edge-glow" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

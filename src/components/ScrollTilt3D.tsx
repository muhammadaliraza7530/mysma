import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Scroll-driven 3D card: as the element travels through the viewport it
 * rotates on X/Y, moves in Z and fades — creating a depth "3D scroll" feel.
 */
export function ScrollTilt3D({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const dir = index % 2 === 0 ? 1 : -1;

  const rotateX = useTransform(p, [0, 0.5, 1], [26, 0, -18]);
  const rotateY = useTransform(p, [0, 0.5, 1], [dir * 20, 0, dir * -12]);
  const z = useTransform(p, [0, 0.5, 1], [-180, 0, -90]);
  const y = useTransform(p, [0, 0.5, 1], [70 + index * 8, 0, -40]);
  const scale = useTransform(p, [0, 0.5, 1], [0.86, 1, 0.94]);
  const opacity = useTransform(p, [0, 0.22, 0.8, 1], [0, 1, 1, 0.45]);

  return (
    <div ref={ref} className={`h-full [perspective:1400px] ${className}`}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          z,
          y,
          scale,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

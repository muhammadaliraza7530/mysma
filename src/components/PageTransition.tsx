import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({
  children,
  locationKey,
}: {
  children: React.ReactNode;
  locationKey?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey ?? "page"}
        initial={{ opacity: 0, scale: 0.97, rotateX: 2, translateZ: -20 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
          translateZ: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        }}
        exit={{
          opacity: 0,
          scale: 0.97,
          rotateX: -2,
          translateZ: -30,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          willChange: "opacity, transform",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

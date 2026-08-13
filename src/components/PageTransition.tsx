import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({ children, locationKey }: { children: React.ReactNode; locationKey?: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey ?? "page"}
        initial={{ opacity: 0, scale: 0.992 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, scale: 0.992, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } }}
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "How fast is delivery?",
    a: "Orders ship the same working day and reach most cities nationwide within 48 hours, fully insured and tracked.",
  },
  {
    q: "Is cash on delivery available?",
    a: "Yes. You can pay online or choose cash on delivery at checkout — both options carry the same warranty.",
  },
  {
    q: "What warranty do I get?",
    a: "Every machine includes a one-year warranty covering motors, electronics and manufacturing defects.",
  },
  {
    q: "Can I return a product?",
    a: "You have 7 days from delivery to request a return, as long as the product and packaging are intact.",
  },
  {
    q: "Do these run on standard power?",
    a: "All products run on regular 220V household power. The Electronic Badge charges over USB-C.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="eyebrow text-primary">FAQs</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Everything you asked.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.06}>
                <div
                  className={`glass-card overflow-hidden rounded-2xl transition-shadow duration-500 ${
                    isOpen ? "edge-glow" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="text-sm font-semibold sm:text-base">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-primary"
                    >
                      <Plus className="size-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground sm:px-6 sm:pb-6">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

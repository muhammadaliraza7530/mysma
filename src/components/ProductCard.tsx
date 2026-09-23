import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { QtyStepper } from "./QtyStepper";
import { Watermark } from "./Watermark";

export function ProductCard({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.94, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -12, rotateX: 6, rotateY: -6, scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      style={{ transformPerspective: 1000 }}
      className="glass-card group relative flex flex-col overflow-hidden rounded-3xl transition-shadow duration-500 hover:edge-glow"
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden"
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,color-mix(in_oklab,var(--primary)_30%,transparent),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="shine-strip opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="shine-strip-inner" />
        </span>
        <div className="absolute inset-0 pt-5 sm:pt-6">
          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="product-float size-full scale-[0.92]"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <Watermark size="sm" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 border-t border-border/60 p-4">
        <div>
          <h3 className="text-sm font-semibold leading-snug break-words">{product.name}</h3>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">{product.eyebrow}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center">
          <QtyStepper value={qty} onChange={setQty} />
          <button
            type="button"
            onClick={() => {
              add(product.slug, qty);
              setOpen(true);
            }}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:w-auto"
          >
            <ShoppingCart className="size-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

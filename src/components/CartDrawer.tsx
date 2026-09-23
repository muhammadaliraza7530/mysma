import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { formatPKR } from "@/data/products";
import { useCart } from "@/lib/cart";
import { QtyStepper } from "./QtyStepper";

export function CartDrawer() {
  const { open, setOpen, items, count, subtotal, setQty, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-primary" />
                <h2 className="text-base font-semibold">Shopping Cart</h2>
                <span className="grid size-5 place-items-center rounded-full bg-secondary text-[0.65rem]">
                  {count}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Your cart is empty.
                </p>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ product, qty }) => (
                    <li key={product.slug} className="flex gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="size-16 shrink-0 rounded-xl border border-border object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{product.eyebrow}</p>
                        <p className="mt-1 text-sm font-semibold text-primary">
                          {formatPKR(product.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <QtyStepper value={qty} onChange={(v) => setQty(product.slug, v)} />
                          <button
                            type="button"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => remove(product.slug)}
                            className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-3 border-t border-border px-5 py-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary">FREE Nationwide</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01]"
              >
                Checkout
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

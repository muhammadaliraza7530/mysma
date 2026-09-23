import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";
import { QtyStepper } from "@/components/QtyStepper";
import { formatPKR } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | My Small Things by Mishel" },
      {
        name: "description",
        content: "Review the compact machines in your cart and continue to secure checkout.",
      },
      { property: "og:title", content: "Your Cart | My Small Things by Mishel" },
      { property: "og:description", content: "Review your cart and continue to checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();

  return (
    <div className="min-h-[70vh] pt-28 pb-24 sm:pt-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <span className="eyebrow text-primary">Your cart</span>
        <h1 className="light-sweep mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="glass-card mt-10 rounded-3xl p-14 text-center">
            <ShoppingBag className="mx-auto size-8 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Your cart is currently empty.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-ring"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <ul className="space-y-4">
              {items.map(({ product, qty }, i) => (
                <motion.li
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card flex gap-4 rounded-3xl p-4"
                >
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="size-24 shrink-0 overflow-hidden rounded-2xl bg-surface-2/40"
                  >
                    <img src={product.image} alt={product.name} loading="lazy" className="size-full object-contain" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{product.eyebrow}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <QtyStepper value={qty} onChange={(v) => setQty(product.slug, v)} />
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        aria-label={`Remove ${product.name}`}
                        className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <span className="self-center text-sm font-semibold text-primary">
                    {formatPKR(product.price * qty)}
                  </span>
                </motion.li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Clear cart
                </button>
              </li>
            </ul>

            <div className="glass-card h-fit rounded-3xl p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary">FREE nationwide</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block rounded-full bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.01]"
              >
                Checkout
              </Link>

              <div className="mt-6 rounded-2xl border border-border bg-surface/40 p-4">
                <p className="eyebrow text-muted-foreground">Bank transfer</p>
                <p className="mt-2 text-sm font-semibold">Bank Alfalah</p>
                <p className="mt-0.5 break-all text-sm tracking-wide">04251011256733</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Mishel Usman</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Cash on delivery requires a 10% advance to this account.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

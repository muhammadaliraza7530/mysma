import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, ShoppingCart, Zap, Check } from "lucide-react";
import { products, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function ProductGrid2x2() {
  return (
    <section className="relative mx-auto max-w-7xl px-3 sm:px-5 py-12 md:py-24">
      <div data-reveal className="mx-auto mb-8 sm:mb-12 max-w-2xl text-center">
        <span className="text-xs tracking-[0.3em] text-primary uppercase">Featured Collection</span>
        <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold md:text-5xl">
          Compact Power. Unmatched Design.
        </h2>
        <p className="mt-2 sm:mt-3 text-muted-foreground text-xs sm:text-sm md:text-base">
          Select your quantity and order directly with instant checkout.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductGridCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductGridCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart, buyNow } = useCart();

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    buyNow(product, quantity);
  };

  return (
    <div className="glass-panel group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 p-2.5 sm:p-5 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:glow-ring">
      <div>
        {/* Product Image & Link */}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="relative block aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-brand-deep"
        >
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <img
            src="/images/logo.png"
            alt=""
            aria-hidden
            width={200}
            height={60}
            loading="lazy"
            className="pointer-events-none absolute bottom-2 right-2 h-3.5 sm:h-5 w-auto opacity-70 mix-blend-screen"
          />
          <span className="absolute left-1.5 top-1.5 sm:left-3 sm:top-3 rounded-full bg-background/85 backdrop-blur-md px-1.5 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[11px] font-semibold text-primary border border-primary/20 max-w-[85%] truncate shadow-sm">
            {product.short}
          </span>
        </Link>

        {/* Title, Subtitle, Price */}
        <div className="mt-2.5 sm:mt-5">
          <div className="flex flex-col justify-between gap-0.5 sm:gap-2">
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              className="text-sm font-semibold sm:text-lg md:text-xl text-foreground transition-colors hover:text-primary line-clamp-1"
              title={product.name}
            >
              {product.name}
            </Link>
            <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-1 hidden sm:block">
              {product.tagline}
            </p>
            <span className="text-xs sm:text-xl md:text-2xl font-extrabold text-gradient mt-0.5">
              {product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Sleek Compact Action Row (Mobile & Desktop) */}
      <div className="mt-2.5 sm:mt-6 border-t border-border/40 pt-2 sm:pt-5 space-y-2">
        {/* Mobile Single-Row Action Controls (Qty + Add + Buy) */}
        <div className="grid grid-cols-12 gap-1 items-center sm:hidden">
          {/* Mobile Qty Stepper */}
          <div className="col-span-4 flex items-center justify-between rounded-full border border-border bg-card/80 px-1 py-0.5">
            <button
              onClick={handleDecrement}
              className="flex size-4.5 items-center justify-center rounded-full text-muted-foreground active:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus className="size-2.5" />
            </button>
            <span className="text-[11px] font-bold text-foreground">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="flex size-4.5 items-center justify-center rounded-full text-muted-foreground active:bg-muted"
              aria-label="Increase quantity"
            >
              <Plus className="size-2.5" />
            </button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="col-span-8 grid grid-cols-2 gap-1">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 rounded-full border border-primary/50 bg-primary/10 py-1.5 text-[10px] font-semibold text-foreground transition-all duration-300 hover:bg-primary/20 active:scale-95 ${
                addedAnimation ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" : ""
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="size-3 text-primary" />
                  <span>Add</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1 rounded-full bg-primary py-1.5 text-[10px] font-semibold text-primary-foreground transition-all duration-300 hover:glow-ring active:scale-95"
            >
              <Zap className="size-3" />
              <span>Buy</span>
            </button>
          </div>
        </div>

        {/* Desktop Controls (Qty Row + Full Buttons) */}
        <div className="hidden sm:block space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Quantity
            </span>
            <div className="flex items-center rounded-full border border-border bg-card/80 p-1">
              <button
                onClick={handleDecrement}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-foreground">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 py-3 text-xs md:text-sm font-semibold text-foreground transition-all duration-300 hover:bg-primary/20 ${
                addedAnimation ? "border-emerald-500 text-emerald-400" : ""
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="size-4 text-emerald-400" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4 text-primary" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs md:text-sm font-semibold text-primary-foreground transition-all duration-300 hover:glow-ring hover:scale-[1.02]"
            >
              <Zap className="size-4" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

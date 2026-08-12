import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel py-2" : "py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src="/images/logo.png"
            alt="My Small Things logo"
            width={160}
            height={48}
            className="h-9 w-auto mix-blend-screen"
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/products" className="transition-colors hover:text-foreground">
            Collection
          </Link>
          {products.slice(0, 2).map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              className="transition-colors hover:text-foreground"
            >
              {p.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:glow-ring"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="size-4 text-primary" />
            <span className="hidden md:inline">Cart</span>
            {cartCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-border p-2 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-panel mx-4 mt-3 rounded-2xl p-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm">
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm"
            >
              Collection
            </Link>
            {products.map((p) => (
              <Link
                key={p.slug}
                to="/products/$slug"
                params={{ slug: p.slug }}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-muted-foreground"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

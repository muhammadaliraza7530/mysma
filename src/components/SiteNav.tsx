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
      className={`fixed inset-x-0 top-0 z-[100] w-full max-w-[100vw] bg-black border-b border-neutral-900 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-5">
        <Link to="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          <img
            src="/images/logo.png"
            alt="My Small Things logo"
            width={240}
            height={80}
            className="h-14 sm:h-16 w-auto object-contain mix-blend-screen transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <Link to="/products" className="transition-colors hover:text-white">
            Collection
          </Link>
          {products.slice(0, 2).map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              className="transition-colors hover:text-white"
            >
              {p.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="size-4 text-white" />
            <span className="hidden md:inline">Cart</span>
            {cartCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
                {cartCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-white/20 p-2 text-white bg-black hover:bg-neutral-900 md:hidden"
          >
            {open ? <X className="size-5 text-white" /> : <Menu className="size-5 text-white" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-4 mt-3 rounded-2xl border border-neutral-800 bg-black p-5 shadow-2xl md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Collection
            </Link>
            <div className="my-2 h-px bg-neutral-800" />
            <span className="px-4 text-xs font-semibold tracking-wider text-white/70 uppercase">
              Products
            </span>
            {products.map((p) => (
              <Link
                key={p.slug}
                to="/products/$slug"
                params={{ slug: p.slug }}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span>{p.name}</span>
                <span className="text-xs font-semibold text-white">${p.price}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

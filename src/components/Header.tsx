import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/context/CatalogContext";
import { Logo } from "@/components/Logo";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Shop", to: "/products" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
  { label: "Cart", to: "/cart" as const },
  { label: "Login", to: "/admin" as const },
];

export function Header() {
  const { products } = useCatalog();
  const { settings } = useSiteSettings();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [shop, setShop] = useState(false);
  const [mobileShop, setMobileShop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-header transition-shadow duration-300 ${
        scrolled ? "border-b border-border shadow-[0_18px_50px_-30px_rgba(0,0,0,1)]" : ""
      }`}
    >
      {settings.announcement.enabled && (
        <div className="border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-xs font-semibold text-primary">
          {settings.announcement.text}
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="My Small Things home">
          <Logo className="h-9 w-auto lg:h-11" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) =>
            item.label === "Shop" ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setShop(true)}
                onMouseLeave={() => setShop(false)}
              >
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  Shop
                  <ChevronDown className="size-3.5" />
                </Link>
                <AnimatePresence>
                  {shop && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card absolute left-1/2 top-full w-64 -translate-x-1/2 rounded-2xl p-2"
                    >
                      {products.map((p) => (
                        <Link
                          key={p.slug}
                          to="/products/$slug"
                          params={{ slug: p.slug }}
                          onClick={() => setShop(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                        >
                          <img
                            src={p.image}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="product-float size-9 shrink-0"
                          />
                          <span className="leading-tight">{p.name}</span>
                        </Link>
                      ))}
                      <Link
                        to="/products"
                        onClick={() => setShop(false)}
                        className="mt-1 block rounded-xl px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-surface-2"
                      >
                        View all products
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open cart"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-2 transition-colors hover:bg-surface-2"
          >
            <ShoppingBag className="size-4" />
            <span className="grid size-5 place-items-center rounded-full bg-foreground text-[0.65rem] font-semibold text-background">
              {count}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-label="Toggle menu"
            className="grid size-10 place-items-center rounded-full border border-border bg-surface/70 transition-colors hover:bg-surface-2 lg:hidden"
          >
            {menu ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-header lg:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV.map((item) =>
                item.label === "Shop" ? (
                  <div key={item.to} className="border-b border-border">
                    <div className="flex items-center justify-between py-3">
                      <Link
                        to={item.to}
                        onClick={() => setMenu(false)}
                        className="text-sm text-muted-foreground"
                      >
                        Shop
                      </Link>
                      <button
                        type="button"
                        aria-label="Toggle shop categories"
                        onClick={() => setMobileShop((v) => !v)}
                        className="grid size-7 place-items-center rounded-full border border-border"
                      >
                        <ChevronDown
                          className={`size-3.5 transition-transform ${mobileShop ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {mobileShop && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pb-2 pl-3"
                        >
                          {products.map((p) => (
                            <Link
                              key={p.slug}
                              to="/products/$slug"
                              params={{ slug: p.slug }}
                              onClick={() => setMenu(false)}
                              className="block py-2 text-xs text-muted-foreground"
                            >
                              {p.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenu(false)}
                    className="border-b border-border py-3 text-sm text-muted-foreground last:border-0"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

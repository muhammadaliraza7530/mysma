import { Link } from "@tanstack/react-router";
import { products } from "@/data/products";

export function SiteFooter() {
  return (
    <footer className="relative w-full max-w-[100vw] overflow-hidden border-t border-border/60 pt-16 md:pt-20">
      <div className="pointer-events-none absolute inset-0 scene-vignette opacity-70" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img
            src="/images/logo.png"
            alt="My Small Things"
            width={320}
            height={96}
            loading="lazy"
            className="h-12 w-auto mix-blend-screen"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Small Things. Big Impact. A luxury tech house building compact appliances and gadgets
            with obsessive detail, quiet engineering and a cinematic finish.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-widest text-primary uppercase">
            Collection
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="transition-colors hover:text-foreground"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-widest text-primary uppercase">Studio</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>Warranty & support</li>
            <li>Shipping across Pakistan</li>
            <li>hello@mysmallthings.store</li>
            <li>+92 300 0000000</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-border/60 py-6 text-center text-xs tracking-wide text-muted-foreground">
        © {new Date().getFullYear()} My Small Things — Design and develop by{" "}
        <span className="text-gradient font-semibold">Brand Up</span>
      </div>
    </footer>
  );
}

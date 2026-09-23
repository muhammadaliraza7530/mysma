import { Logo } from "@/components/Logo";
import { Link } from "@tanstack/react-router";
import { useCatalog } from "@/context/CatalogContext";
import { WHATSAPP_DISPLAY, waLink } from "@/lib/contact";
import { useSiteSettings } from "@/context/SiteSettingsContext";


export function Footer() {
  const { products } = useCatalog();
  const { settings } = useSiteSettings();
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <Logo className="h-7 w-auto" loading="lazy" />
          <p className="max-w-xs text-sm text-muted-foreground">
            {settings.footer.about}
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-muted-foreground">Collection</h3>
          <ul className="mt-4 space-y-2">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-muted-foreground">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="transition-colors hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition-colors hover:text-foreground">
                Cart
              </Link>
            </li>
            <li>{settings.footer.line1}</li>
            <li>{settings.footer.line2}</li>
            <li>Cash on delivery available</li>
          </ul>

          <h3 className="eyebrow mt-8 text-muted-foreground">Get in touch</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${settings.footer.email}`}
                className="transition-colors hover:text-foreground"
              >
                {settings.footer.email}
              </a>
            </li>
            <li>
              <a
                href={waLink("Hi! I have a question about My Small Things.")}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                 WhatsApp: {settings.footer.phone || WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href="https://maps.google.com/?q=308+Y+Phase+3+DHA+Lahore+Punjab+Pakistan"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                308 Y Phase 3, DHA, Lahore, Punjab, Pakistan
              </a>
            </li>
            <li>Mon–Sat, 10am – 5pm PKT</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} My Small Things by Mishel. All rights reserved.</p>
        <p className="mt-1">Design and develop by brand up.</p>
      </div>
    </footer>
  );
}

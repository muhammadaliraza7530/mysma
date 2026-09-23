import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Rocket,
  ShieldCheck,
  Sparkles,
  Thermometer,
} from "lucide-react";

import { GlowCard } from "@/components/GlowCard";
import { Marquee } from "@/components/Marquee";
import { Hero3D } from "@/components/Hero3D";
import { OrbitCarousel } from "@/components/OrbitCarousel";
import { ProductCard } from "@/components/ProductCard";
import { ProductVideo } from "@/components/ProductVideo";
import { Reveal } from "@/components/Reveal";
import { Starfield } from "@/components/Starfield";
import { FAQ } from "@/components/FAQ";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { useCatalog } from "@/context/CatalogContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Small Things by Mishel | Luxury Compact Tech" },
      {
        name: "description",
        content:
          "Small Things. Big Impact. Four compact machines — Mini washing machine, Mini shoe washer, Mini washing machine Grey and Electronic Badge — engineered with flagship obsession.",
      },
      { property: "og:title", content: "My Small Things by Mishel | Luxury Compact Tech" },
      {
        property: "og:description",
        content: "Four compact machines engineered with flagship obsession. Explore in full 3D.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const PANEL_FEATURES = [
  { icon: Sparkles, title: "Smart programs", copy: "Auto-tuned cycles for every fabric" },
  { icon: ShieldCheck, title: "Child safety", copy: "Instant stop on door open" },
  { icon: Thermometer, title: "Sterilise", copy: "High-temperature deep clean" },
  { icon: Rocket, title: "Fast delivery", copy: "Shipped nationwide in 48h" },
];

const TESTIMONIALS = [
  {
    name: "Ayesha K.",
    role: "Karachi",
    quote:
      "It looks like a piece of art on my shelf and cleans better than machines three times its size.",
  },
  {
    name: "Hamza R.",
    role: "Lahore",
    quote: "The Mini shoe washer saved my collection. Quiet, quick and genuinely premium build.",
  },
  {
    name: "Sana M.",
    role: "Islamabad",
    quote: "Ordered on Monday, delivered Wednesday. Packaging alone felt like a flagship product.",
  },
  {
    name: "Bilal A.",
    role: "Rawalpindi",
    quote: "The grey Mini washing machine looks stunning on my counter — quiet and spotless every cycle.",
  },
];

function Home() {
  const { products } = useCatalog();
  const { settings } = useSiteSettings();
  return (
    <div>
      <Hero3D />

      <Marquee />

      {/* ORBIT */}
      <section id="orbit" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 eyebrow text-primary">
              <Sparkles className="size-3" /> 3D orbit
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-4xl">
              See them in orbit
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              A smooth circular carousel of our compact machines.
            </p>
          </Reveal>

          <div className="mt-12">
            <OrbitCarousel />
          </div>
        </div>
      </section>

      <Marquee />

      {/* COLLECTION */}
      <section id="collection" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-xl">
            <span className="eyebrow text-primary">Our Products</span>
            <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Compact machines.
              <br className="sm:hidden" /> Zero compromise.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Four premium small devices designed for modern living.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.18} y={44}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[800px]">
              <ProductVideo
                src="/videos/shoe-washer.mp4"
                label="Mini shoe washer in action"
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <span className="eyebrow text-primary">Our studio</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">
              One tap. Everything handled.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Glass command surfaces, constellation lighting and intelligent programs. We obsess over
              details most brands skip, then shrink the result until it fits on a shelf.
            </p>

          </Reveal>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-xl">
            <span className="eyebrow text-primary">Why us</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">
              Small size. Flagship build.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PANEL_FEATURES.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <GlowCard className="h-full rounded-3xl p-6">
                  <Icon className="size-6 text-primary" />
                  <p className="mt-4 text-base font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="eyebrow text-primary">Reviews</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">
              Loved across Pakistan
            </h2>
          </Reveal>
          <div className="mt-12">
            <TestimonialsCarousel items={TESTIMONIALS} />
          </div>
        </div>
      </section>

      <FAQ />

      {/* CONTACT CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-3xl border border-border p-10 text-center sm:p-16"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Starfield count={18} />
              <div className="relative z-10">
                <BadgeCheck className="mx-auto size-8 text-primary" />
                <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-4xl">
                  {settings.cta.title} <span className="text-primary">{settings.cta.highlight}</span>?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
                  {settings.cta.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
                  >
                    {settings.cta.button}
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="glass-chip inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium transition-transform hover:scale-[1.03]"
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

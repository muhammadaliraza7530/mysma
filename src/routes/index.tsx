import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Cpu } from "lucide-react";
import { products } from "@/data/products";
import { ClientOnly, useIsMobile } from "@/components/ClientOnly";
import { ProductCard3D } from "@/components/ProductCard3D";
import { ProductGrid2x2 } from "@/components/ProductGrid2x2";
import { ScrollReveal } from "@/components/ScrollReveal";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Small Things — Small Things. Big Impact." },
      {
        name: "description",
        content:
          "Luxury compact tech: mini washing machine, shoe washer, precision blower and electronic badge. Cinematic 3D shopping experience.",
      },
      { property: "og:title", content: "My Small Things — Small Things. Big Impact." },
      {
        property: "og:description",
        content: "Four compact machines, engineered like flagship tech. Explore the 3D collection.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const mobile = useIsMobile();

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[100svh] w-full max-w-[100vw] overflow-hidden">
        <div className="absolute inset-0 scene-vignette" />
        <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_55%_34%_at_50%_52%,color-mix(in_oklab,var(--background)_88%,transparent)_30%,transparent_72%)]" />
        <div className="absolute inset-0">
          <ClientOnly>
            <HeroScene key={mobile ? "m" : "d"} mobile={mobile} />
          </ClientOnly>
        </div>

        <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 sm:px-5 text-center">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="glass-panel rounded-full px-4 py-1.5 text-[11px] tracking-[0.28em] text-primary uppercase">
              Luxury compact tech
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="mt-6 text-[13vw] leading-[0.92] font-semibold md:text-[7rem]">
              <span className="block">My Small</span>
              <span className="text-gradient block">Things</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <p className="mt-5 max-w-md text-base text-muted-foreground md:max-w-xl md:text-lg">
              Small Things. Big Impact. Four machines, engineered with flagship obsession —
              floating, rotating and ready to be explored in full 3D.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:glow-ring"
              >
                Explore the collection
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#collection"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:border-primary/60"
              >
                See it move
              </a>
            </div>
          </ScrollReveal>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* MARQUEE */}
      <div className="relative w-full max-w-[100vw] overflow-hidden border-y border-border/60 py-4">
        <div className="marquee-track flex w-max gap-12 text-sm tracking-[0.3em] text-muted-foreground uppercase">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12">
              {[
                "Small Things. Big Impact.",
                "Cinematic engineering",
                "1-year warranty",
                "Nationwide delivery",
                "Quiet by design",
                "Premium materials",
              ].map((t) => (
                <span key={t} className="flex items-center gap-12">
                  {t} <Sparkles className="size-3 text-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* COLLECTION GRID */}
      <section
        id="collection"
        className="relative mx-auto max-w-7xl px-4 sm:px-5 py-20 md:py-32 overflow-hidden"
      >
        <ScrollReveal direction="up">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs tracking-[0.3em] text-primary uppercase">The collection</span>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-6xl">
              Four objects. Zero compromise.
            </h2>
            <p className="mt-4 text-xs sm:text-sm md:text-base text-muted-foreground">
              Hover, tilt and rotate. Every card is a real 3D surface — the way a premium product
              page should feel.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 sm:mt-14 grid grid-cols-2 items-start gap-2.5 sm:gap-7 lg:grid-cols-4 overflow-hidden">
          {products.map((p, i) => (
            <ScrollReveal
              key={p.slug}
              delay={i * 0.15}
              direction="up"
              distance={40}
              className={
                i % 2 === 0
                  ? "translate-y-2 sm:translate-y-6 lg:translate-y-10"
                  : "-translate-y-2 sm:-translate-y-4 lg:-translate-y-8"
              }
            >
              <ProductCard3D product={p} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 2X2 PRODUCT GRID SECTION */}
      <ProductGrid2x2 />

      {/* FEATURE SPLIT */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-5 py-16 md:py-28 overflow-hidden">
        <div className="grid items-center gap-10 md:gap-14 md:grid-cols-2">
          <ScrollReveal direction="left" distance={40}>
            <div className="relative">
              <div className="glass-panel relative overflow-hidden rounded-[28px] sm:rounded-[36px] p-3 sm:p-4 float-slow">
                <img
                  src="/images/washer-panel.jpg"
                  alt="Smart Sky Panel control interface"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full rounded-2xl sm:rounded-3xl object-cover"
                />
                <img
                  src="/images/logo.png"
                  alt=""
                  aria-hidden
                  width={220}
                  height={66}
                  loading="lazy"
                  className="pointer-events-none absolute bottom-4 right-4 sm:bottom-7 sm:right-7 h-5 sm:h-7 w-auto opacity-70 mix-blend-screen"
                />
              </div>
              <div className="spin-ring pointer-events-none absolute -inset-2 sm:-inset-8 -z-10 rounded-full border border-primary/20" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" distance={40} delay={0.15}>
            <div>
              <span className="text-xs tracking-[0.3em] text-primary uppercase">
                Smart Sky Panel
              </span>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl">
                One tap. <span className="text-gradient">Everything handled.</span>
              </h2>
              <p className="mt-4 text-sm text-muted-foreground md:text-base">
                A glass command surface with constellation lighting, eight intelligent programs and
                a child lock that halts the drum the instant the door opens.
              </p>
              <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2">
                {[
                  { icon: Cpu, t: "Smart programs", d: "Auto-tuned cycles for every fabric" },
                  { icon: ShieldCheck, t: "Child safety", d: "Instant stop on door open" },
                  { icon: Sparkles, t: "Sterilise", d: "High-temperature deep clean" },
                  { icon: Truck, t: "Fast delivery", d: "Shipped nationwide in 48h" },
                ].map((f, idx) => (
                  <ScrollReveal key={f.t} delay={0.2 + idx * 0.1} direction="up" distance={20}>
                    <div className="glass-panel rounded-2xl p-4 transition-transform duration-500 hover:-translate-y-1.5">
                      <f.icon className="size-5 text-primary" />
                      <p className="mt-3 text-sm font-semibold">{f.t}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{f.d}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-5 pb-20 sm:pb-28 overflow-hidden">
        <ScrollReveal direction="up" distance={40}>
          <div className="glass-panel relative overflow-hidden rounded-[28px] sm:rounded-[40px] px-5 py-12 sm:px-6 sm:py-16 text-center">
            <div className="pointer-events-none absolute inset-0 scene-vignette" />
            <h2 className="relative text-3xl font-semibold sm:text-4xl md:text-5xl">
              Ready for the <span className="text-gradient">small upgrade</span>?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
              Free delivery, one-year warranty and a support team that actually answers.
            </p>
            <Link
              to="/products"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:glow-ring"
            >
              Shop My Small Things
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

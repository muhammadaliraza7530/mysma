import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, useEffect, useRef } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Cpu } from "lucide-react";
import { products } from "@/data/products";
import { ClientOnly, useIsMobile } from "@/components/ClientOnly";
import { ProductCard3D } from "@/components/ProductCard3D";
import { ProductGrid2x2 } from "@/components/ProductGrid2x2";

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

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = ref.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!nodes) return;
    nodes.forEach((n) => {
      n.style.opacity = "0";
      n.style.transform = "translateY(42px) scale(0.97)";
      n.style.transition =
        "opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0) scale(1)";
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function Home() {
  const mobile = useIsMobile();
  const page = useReveal();

  return (
    <div ref={page}>
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 scene-vignette" />
        <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_55%_34%_at_50%_52%,color-mix(in_oklab,var(--background)_88%,transparent)_30%,transparent_72%)]" />
        <div className="absolute inset-0">
          <ClientOnly>
            <HeroScene key={mobile ? "m" : "d"} mobile={mobile} />
          </ClientOnly>
        </div>

        <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
          <span className="glass-panel rounded-full px-4 py-1.5 text-[11px] tracking-[0.28em] text-primary uppercase">
            Luxury compact tech
          </span>
          <h1 className="mt-6 text-[13vw] leading-[0.92] font-semibold md:text-[7rem]">
            <span className="block">My Small</span>
            <span className="text-gradient block">Things</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground md:max-w-xl md:text-lg">
            Small Things. Big Impact. Four machines, engineered with flagship obsession — floating,
            rotating and ready to be explored in full 3D.
          </p>
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
        </div>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* MARQUEE */}
      <div className="relative overflow-hidden border-y border-border/60 py-4">
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
      <section id="collection" className="relative mx-auto max-w-7xl px-5 py-24 md:py-32">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs tracking-[0.3em] text-primary uppercase">The collection</span>
          <h2 className="mt-4 text-4xl font-semibold md:text-6xl">
            Four objects. Zero compromise.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hover, tilt and rotate. Every card is a real 3D surface — the way a premium product page
            should feel.
          </p>
        </div>

        <div className="mt-8 sm:mt-14 grid grid-cols-2 items-start gap-2.5 sm:gap-7 lg:grid-cols-4">
          {products.map((p, i) => (
            <div
              key={p.slug}
              className={
                i % 2 === 0 ? "translate-y-6 lg:translate-y-10" : "-translate-y-4 lg:-translate-y-8"
              }
            >
              <ProductCard3D product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* 2X2 PRODUCT GRID SECTION */}
      <ProductGrid2x2 />

      {/* FEATURE SPLIT */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div data-reveal className="relative">
            <div className="glass-panel relative overflow-hidden rounded-[36px] p-4 float-slow">
              <img
                src="/images/washer-panel.jpg"
                alt="Smart Sky Panel control interface"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full rounded-3xl object-cover"
              />
              <img
                src="/images/logo.png"
                alt=""
                aria-hidden
                width={220}
                height={66}
                loading="lazy"
                className="pointer-events-none absolute bottom-7 right-7 h-7 w-auto opacity-70 mix-blend-screen"
              />
            </div>
            <div className="spin-ring pointer-events-none absolute -inset-8 -z-10 rounded-full border border-primary/20" />
          </div>
          <div data-reveal>
            <span className="text-xs tracking-[0.3em] text-primary uppercase">Smart Sky Panel</span>
            <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
              One tap. <span className="text-gradient">Everything handled.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              A glass command surface with constellation lighting, eight intelligent programs and a
              child lock that halts the drum the instant the door opens.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Cpu, t: "Smart programs", d: "Auto-tuned cycles for every fabric" },
                { icon: ShieldCheck, t: "Child safety", d: "Instant stop on door open" },
                { icon: Sparkles, t: "Sterilise", d: "High-temperature deep clean" },
                { icon: Truck, t: "Fast delivery", d: "Shipped nationwide in 48h" },
              ].map((f) => (
                <div
                  key={f.t}
                  className="glass-panel rounded-2xl p-4 transition-transform duration-500 hover:-translate-y-1.5"
                >
                  <f.icon className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold">{f.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-5 pb-28">
        <div
          data-reveal
          className="glass-panel relative overflow-hidden rounded-[40px] px-6 py-16 text-center"
        >
          <div className="pointer-events-none absolute inset-0 scene-vignette" />
          <h2 className="relative text-4xl font-semibold md:text-5xl">
            Ready for the <span className="text-gradient">small upgrade</span>?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
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
      </section>
    </div>
  );
}

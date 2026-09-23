import { Watermark } from "@/components/Watermark";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gem, Layers, Rocket } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Starfield } from "@/components/Starfield";
import { useCatalog } from "@/context/CatalogContext";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | My Small Things by Mishel" },
      {
        name: "description",
        content:
          "The studio behind My Small Things — compact machines designed with flagship obsession, premium materials and quiet engineering.",
      },
      { property: "og:title", content: "About | My Small Things by Mishel" },
      {
        property: "og:description",
        content: "Compact machines designed with flagship obsession.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  { icon: Gem, title: "Premium materials", copy: "Stainless drums, glass panels, soft-touch shells." },
  { icon: Layers, title: "Considered depth", copy: "Every surface is layered, lit and shadowed on purpose." },
  { icon: Rocket, title: "Quiet engineering", copy: "Big machine performance in a desktop footprint." },
];

const STATS = [
  { value: "4", label: "Flagship products" },
  { value: "48h", label: "Nationwide delivery" },
  { value: "1 yr", label: "Full warranty" },
  { value: "100+", label: "Prototypes refined" },
];

const TIMELINE = [
  {
    year: "2023",
    title: "The first sketch",
    copy: "A single question: why do small appliances always feel cheap? We started drawing.",
  },
  {
    year: "2024",
    title: "Materials first",
    copy: "Glass fronts, stainless drums and soft-touch shells replaced hollow plastic shortcuts.",
  },
  {
    year: "2025",
    title: "Four machines",
    copy: "The Mini washing machine, Mini shoe washer, Mini washing machine Grey and Electronic Badge shipped as one coherent family.",
  },
  {
    year: "2026",
    title: "Loved across Pakistan",
    copy: "Thousands of homes later, we still tune every cycle by hand before release.",
  },
];

function AboutPage() {
  const { products } = useCatalog();
  const featured = products[0];
  return (
    <div className="pb-24">
      <section
        className="relative overflow-hidden pt-32 pb-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Starfield count={26} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span className="eyebrow text-primary">About the studio</span>
          <h1 className="light-sweep mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            Small Things. Big Impact.
          </h1>
          <p className="mt-6 text-sm text-muted-foreground sm:text-base">
            My Small Things by Mishel builds compact machines that behave like flagship products —
            intelligent programs, premium finishes and a level of detail usually reserved for
            objects ten times their size.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, copy }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="glass-card h-full rounded-3xl p-7">
                <Icon className="size-6 text-primary" />
                <h2 className="mt-4 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="glass-card relative overflow-hidden rounded-3xl p-8">
            {featured && (
              <img
                src={featured.image}
                alt={featured.name}
                loading="lazy"
                className="product-float mx-auto w-full max-w-sm"
              />
            )}
            <Watermark />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <span className="eyebrow text-primary">Our approach</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Designed once. Refined a hundred times.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            We prototype every machine until it disappears into your space — silent, small and
            beautiful. Four products, zero filler, each one built to be kept for years.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
          >
            Shop the collection <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="glass-card edge-glow h-full rounded-3xl p-6 text-center transition-transform duration-500 hover:-translate-y-2">
                <p className="text-3xl font-semibold text-primary sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto mt-24 max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="eyebrow text-primary">The journey</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            From one sketch to four machines.
          </h2>
        </Reveal>
        <div className="relative mt-12 space-y-5 border-l border-border pl-6 sm:pl-10">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.08}>
              <div className="glass-card relative rounded-3xl p-6 transition-transform duration-500 hover:translate-x-2">
                <span className="absolute -left-[1.9rem] top-8 size-3 rounded-full bg-primary glow-ring sm:-left-[2.9rem]" />
                <p className="eyebrow text-primary">{t.year}</p>
                <h3 className="mt-2 text-lg font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CRAFT GRID */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-primary">The craft</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Details you feel before you notice.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="glass-card edge-glow relative block h-full overflow-hidden rounded-3xl p-3 pt-10 transition-transform duration-500 hover:-translate-y-2 sm:pt-12"
              >
                <div className="relative pt-1">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="product-float w-full scale-90"
                  />
                </div>
                <Watermark size="sm" />
                <p className="mt-4 text-sm font-semibold">{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}


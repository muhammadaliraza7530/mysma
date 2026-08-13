import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ProductCard3D } from "@/components/ProductCard3D";
import { ProductGrid2x2 } from "@/components/ProductGrid2x2";
import { CircularProductOrbit } from "@/components/CircularProductOrbit";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollTilt3D } from "@/components/ScrollTilt3D";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Collection — My Small Things" },
      {
        name: "description",
        content:
          "Explore all four My Small Things products in 3D: mini washing machine, shoe washer, precision blower and electronic badge.",
      },
      { property: "og:title", content: "Collection — My Small Things" },
      {
        property: "og:description",
        content: "Four compact machines, presented in a cinematic 3D showroom.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="pt-28 w-full max-w-[100vw] overflow-x-hidden">
      <section className="relative mx-auto max-w-7xl px-4 sm:px-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 scene-vignette" />
        <ScrollReveal direction="up">
          <div className="relative text-center">
            <span className="text-xs tracking-[0.3em] text-primary uppercase">
              The 3D Collection
            </span>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl md:text-7xl">
              Small things, <span className="text-gradient">built big</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm md:text-base text-muted-foreground">
              Every product is presented as an interactive 3D surface. Hover, rotate, and explore in
              real 3D perspective.
            </p>
          </div>
        </ScrollReveal>

        {/* 3D CIRCULAR ORBIT SHOWCASE */}
        <div className="mt-6">
          <CircularProductOrbit />
        </div>

        {/* 3D SCROLL CARD GRID */}
        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 [perspective:1400px]">
          {products.map((p, i) => (
            <ScrollTilt3D key={p.slug} index={i}>
              <ProductCard3D product={p} index={i} />
            </ScrollTilt3D>
          ))}
        </div>
      </section>

      <section className="py-12">
        <ProductGrid2x2 />
      </section>
    </div>
  );
}

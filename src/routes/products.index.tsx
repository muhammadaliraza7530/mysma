import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ProductCard3D } from "@/components/ProductCard3D";
import { ProductGrid2x2 } from "@/components/ProductGrid2x2";
import { ScrollReveal } from "@/components/ScrollReveal";

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
    <div className="pt-32 w-full max-w-[100vw] overflow-x-hidden">
      <section className="relative mx-auto max-w-7xl px-4 sm:px-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 scene-vignette" />
        <ScrollReveal direction="up">
          <div className="relative text-center">
            <span className="text-xs tracking-[0.3em] text-primary uppercase">The collection</span>
            <h1 className="mt-4 text-5xl font-semibold md:text-7xl">
              Small things, <span className="text-gradient">built big</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Every product is presented as a live 3D surface. Tilt, orbit and open any piece for a
              full 360° view.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ScrollReveal key={p.slug} delay={i * 0.12} direction="up" distance={30}>
              <ProductCard3D product={p} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-12">
        <ProductGrid2x2 />
      </section>
    </div>
  );
}

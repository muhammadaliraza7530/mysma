import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { useCatalog } from "@/context/CatalogContext";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "All Products | My Small Things by Mishel" },
      {
        name: "description",
        content:
          "Shop the full My Small Things collection: Mini washing machine, Mini shoe washer, Mini washing machine Grey and Electronic Badge.",
      },
      { property: "og:title", content: "All Products | My Small Things by Mishel" },
      {
        property: "og:description",
        content: "Four compact machines. Instant checkout, free nationwide delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { products } = useCatalog();
  return (
    <div className="pt-28 pb-24 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-primary">Small Things. Big Impact.</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Engineered for the Small Design.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Select your quantity and order directly with instant checkout.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.15} y={44}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

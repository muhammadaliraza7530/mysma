import { Watermark } from "@/components/Watermark";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Download, ShoppingCart, Sparkles } from "lucide-react";
import { GalleryRail } from "@/components/GalleryRail";
import { ProductRail } from "@/components/ProductRail";
import { ProductVideo } from "@/components/ProductVideo";
import { QtyStepper } from "@/components/QtyStepper";
import { Reveal } from "@/components/Reveal";
import { getProduct } from "@/data/products";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => getProduct(params.slug) ?? null,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} | My Small Things by Mishel` },
          { name: "description", content: loaderData.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.name} | My Small Things` },
          { property: "og:description", content: loaderData.tagline },
           { property: "og:type", content: "website" },
           { name: "twitter:card", content: "summary_large_image" },
        ]
      : [],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  // Remount on slug change so image/qty state never carries over between products.
  return <ProductDetailView key={slug} />;
}

function ProductDetailView() {
  const seedProduct = Route.useLoaderData();
  const { slug } = Route.useParams();
  const { getBySlug, products } = useCatalog();
  const product = getBySlug(slug) ?? seedProduct;
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const initialImage = product?.gallery?.[0] ?? product?.image ?? "";
  const [activeImage, setActiveImage] = useState(initialImage);
  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 pt-24 text-center">
        <div>
          <h1 className="text-3xl font-semibold">This product is no longer available</h1>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            View all products
          </Link>
        </div>
      </div>
    );
  }
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);


  return (
    <div className="pt-24 pb-24 sm:pt-32">
      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Hero product */}
        <Reveal>
          <div className="glass-card relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-3xl select-none sm:aspect-square">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]" />
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={product.name}
              draggable={false}
              className="product-float pointer-events-none absolute inset-0 size-full object-contain p-5 sm:p-12"
              initial={{ opacity: 0, scale: 1.04, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <Watermark />
          </div>

          {/* Gallery rail */}
          {gallery.length > 1 ? (
            <div className="mt-5 min-w-0 max-w-full">
              <GalleryRail
                images={gallery}
                name={product.name}
                activeSrc={activeImage}
                onSelect={setActiveImage}
              />
            </div>
          ) : null}

        </Reveal>



        {/* Info */}
        <Reveal delay={0.1}>
          <span className="eyebrow text-primary">{product.eyebrow}</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-sm text-muted-foreground sm:text-base">{product.description}</p>

          <ul className="mt-6 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-4">
            <span className="eyebrow text-muted-foreground">Quantity</span>
            <QtyStepper value={qty} onChange={setQty} size="md" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                add(product.slug, qty);
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
            >
              <ShoppingCart className="size-4" /> Add to Cart
            </button>
          </div>

        </Reveal>
      </div>

      {/* Video */}
      {product.video ? (
        <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Sparkles className="size-5 text-primary" /> See it in action
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Real product footage — tap the speaker icon for sound.
            </p>
          </Reveal>
          <div className="mt-8">
            <ProductVideo src={product.video} poster={product.image} label={`${product.name} video`} />
          </div>
        </section>
      ) : null}

      {product.slug === "electronic-badge" ? (
        <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="glass-card rounded-3xl p-8 text-center sm:p-12">
              <h2 className="text-2xl font-semibold tracking-tight">Electronic Badge brochure</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Full product catalogue, specifications and usage guide.
              </p>
              <a
                href="/api/public/brochure"
                download="mysmallthings-brochure.pdf"
                className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-base font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.02] sm:w-auto sm:text-lg"
              >
                <Download className="size-5 transition-transform group-hover:translate-y-0.5" />
                Download Brochure
              </a>
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* Specs */}
      <section className="mx-auto mt-20 min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Sparkles className="size-5 text-primary" /> Product Feature Details
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {product.specs.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="glass-card rounded-2xl p-5">
                <p className="eyebrow text-primary">{s.label}</p>
                <p className="mt-2 text-lg font-semibold">{s.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Sparkles className="size-5 text-primary" /> More Small Things
          </h2>
        </Reveal>
        <div className="mt-8">
          <ProductRail products={related} />
        </div>
        <div className="mt-10">
          <Link to="/products" className="text-sm text-primary hover:underline">
            View the full collection →
          </Link>
        </div>
      </section>
    </div>
  );
}

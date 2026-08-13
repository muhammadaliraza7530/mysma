import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, useState } from "react";
import {
  ArrowLeft,
  Check,
  RotateCw,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Sparkles,
  Video,
} from "lucide-react";
import { getProduct, products, type Product } from "@/data/products";
import { ClientOnly, useIsMobile } from "@/components/ClientOnly";
import { useCart } from "@/context/CartContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollTilt3D } from "@/components/ScrollTilt3D";
import { ProductCard3D } from "@/components/ProductCard3D";

const ProductViewer = lazy(() => import("@/components/three/ProductViewer"));

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found — My Small Things" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — My Small Things` },
        { name: "description", content: `${p.tagline}. ${p.short}. ${p.price}.` },
        { property: "og:title", content: `${p.name} — My Small Things` },
        { property: "og:description", content: p.tagline },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const mobile = useIsMobile();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, buyNow } = useCart();

  return (
    <div className="pt-28 w-full max-w-[100vw] overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-5">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to collection
        </Link>
      </div>

      <section className="relative mx-auto mt-8 grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:items-center">
        <div className="pointer-events-none absolute inset-0 scene-vignette" />
        <ScrollReveal direction="left" distance={40}>
          <div className="relative h-[54vh] min-h-[340px] w-full">
            <ClientOnly
              fallback={
                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  className="size-full rounded-[32px] object-cover"
                />
              }
            >
              <ProductViewer url={product.image} mobile={mobile} />
            </ClientOnly>
            <p className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 text-xs tracking-widest text-muted-foreground uppercase">
              <RotateCw className="size-3" /> Drag for 360° view
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" distance={40} delay={0.15}>
          <div className="relative">
            <span className="text-xs tracking-[0.3em] text-primary uppercase">{product.short}</span>
            <h1 className="mt-4 text-4xl font-semibold md:text-6xl">{product.name}</h1>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
            <p className="mt-7 text-3xl font-semibold text-gradient">{product.price}</p>

            <ul className="mt-7 space-y-3">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Quantity
              </span>
              <div className="flex items-center rounded-full border border-border bg-card/80 p-1">
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => buyNow(product, quantity)}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:glow-ring"
              >
                <Zap className="size-4" />
                Buy Now
              </button>
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:border-primary/60"
              >
                <ShoppingCart className="size-4 text-primary" />
                Add to cart
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [perspective:1200px]">
          {product.specs.map((s, idx) => (
            <ScrollTilt3D key={s.label} index={idx}>
              <div className="glass-panel rounded-3xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-ring">
                <p className="text-xs tracking-widest text-primary font-semibold uppercase">
                  {s.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </ScrollTilt3D>
          ))}
        </div>

        {/* Additional Product Feature Images Grid */}
        {product.gallery && product.gallery.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Product Feature Details
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [perspective:1400px]">
              {product.gallery.map((g, idx) => (
                <ScrollTilt3D key={g} index={idx}>
                  <div className="bg-[#0c1425] border border-slate-800 rounded-3xl p-3 overflow-hidden shadow-xl relative group transition-all duration-300 hover:border-primary/50">
                    <img
                      src={g}
                      alt={`${product.name} detail ${idx + 1}`}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <img
                      src="/images/logo.png"
                      alt=""
                      aria-hidden
                      width={200}
                      height={60}
                      loading="lazy"
                      className="pointer-events-none absolute bottom-5 right-5 h-5 w-auto opacity-70 mix-blend-screen"
                    />
                  </div>
                </ScrollTilt3D>
              ))}
            </div>
          </div>
        )}

        {/* Video Container at the End */}
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Video className="size-5 text-primary" /> Product Video
          </h2>
          <div className="rounded-3xl border border-slate-800 bg-[#0c1425] p-3 shadow-xl">
            <video
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-contain rounded-2xl"
            >
              <source src={product.video || "/images/shoeVideo.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">More Small Things</h2>
          </div>
        </ScrollReveal>
        <div className="mt-6 grid gap-5 sm:grid-cols-3 [perspective:1400px]">
          {products
            .filter((p) => p.slug !== product.slug)
            .map((p, idx) => (
              <ScrollTilt3D key={p.slug} index={idx}>
                <ProductCard3D product={p} index={idx} />
              </ScrollTilt3D>
            ))}
        </div>
      </section>
    </div>
  );
}

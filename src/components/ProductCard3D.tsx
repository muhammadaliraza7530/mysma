import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";

export function ProductCard3D({ product, index = 0 }: { product: Product; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const direction = index % 2 === 0 ? -1 : 1;
  const entranceX = direction * (24 + index * 6);
  const entranceY =
    (index % 3 === 0 ? -32 : index % 3 === 1 ? 26 : -18) + (index % 2 === 0 ? 8 : -8);
  const baseRotate = index % 2 === 0 ? -6 - (index % 3) * 1.5 : 6 + (index % 3) * 1.5;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({
      transform: `perspective(1100px) rotateY(${px * 16}deg) rotateX(${-py * 16}deg) translateZ(38px) scale(1.03)`,
    });
  };

  const reset = () => setStyle({ transform: "perspective(1100px) rotateY(0) rotateX(0)" });

  return (
    <motion.div
      initial={{ opacity: 0, x: entranceX, y: entranceY, rotate: baseRotate, scale: 0.93 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.11 }}
      whileHover={{ y: -10, scale: 1.015 }}

      style={{ perspective: "1200px" }}
      className="h-full w-full max-w-full overflow-hidden"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={style}
        className="tilt-3d group glass-panel relative h-full w-full max-w-full overflow-hidden rounded-2xl sm:rounded-[28px] p-2.5 sm:p-5 hover:glow-ring"
      >
        <div className="pointer-events-none absolute inset-0 scene-vignette opacity-60" />
        <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-3xl bg-brand-deep">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ transform: "translateZ(40px)" }}
          />
          <img
            src="/images/logo.png"
            alt=""
            aria-hidden
            width={200}
            height={60}
            loading="lazy"
            className="pointer-events-none absolute bottom-2 right-2 h-3.5 sm:h-6 w-auto opacity-70 mix-blend-screen"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="relative mt-2.5 sm:mt-6 flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
          <div>
            <h3 className="text-xs sm:text-lg font-semibold line-clamp-1">{product.name}</h3>
            <p className="mt-0.5 text-[10px] sm:text-sm text-muted-foreground line-clamp-1 hidden sm:block">
              {product.tagline}
            </p>
          </div>
          <span className="shrink-0 self-start text-xs sm:text-sm font-bold text-primary sm:rounded-full sm:border sm:border-primary/40 sm:px-3 sm:py-1">
            {product.price}
          </span>
        </div>

        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="relative mt-3 sm:mt-6 inline-flex w-full items-center justify-between rounded-xl sm:rounded-2xl border border-border bg-secondary/40 px-2.5 py-1.5 sm:px-5 sm:py-3 text-[10px] sm:text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/15"
        >
          <span>Explore</span>
          <ArrowUpRight className="size-3 sm:size-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

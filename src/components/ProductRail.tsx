import { useCallback, useEffect, useRef, useState } from "react";
import { type Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

/** Auto-scrolling, finger/cursor draggable rail of product cards (uniform size). */
export function ProductRail({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef(0);
  const paused = useRef(false);
  const drag = useRef({ active: false, x: 0, moved: 0 });
  const [width, setWidth] = useState(0);
  const loop = products.length > 1 ? [...products, ...products] : products;

  const apply = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${-offset.current}px,0,0)`;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setWidth(el.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [products.length]);

  useEffect(() => {
    if (!width || products.length < 2) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      if (!paused.current && !drag.current.active) offset.current += dt * 0.095;
      if (offset.current >= width) offset.current -= width;
      if (offset.current < 0) offset.current += width;
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [width, products.length, apply]);

  return (
    <div
      className="relative w-full min-w-0 max-w-full overflow-hidden rounded-3xl [contain:inline-size]"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => {
        paused.current = false;
        drag.current.active = false;
      }}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-background to-transparent sm:w-14" />
      <span className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-background to-transparent sm:w-14" />

      <div
        ref={trackRef}
        className="flex w-max gap-4 py-2 will-change-transform sm:gap-6"
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => {
          drag.current = { active: true, x: e.clientX, moved: 0 };
        }}
        onPointerMove={(e) => {
          if (!drag.current.active) return;
          const dx = e.clientX - drag.current.x;
          drag.current.x = e.clientX;
          drag.current.moved += Math.abs(dx);
          offset.current -= dx;
          if (width) {
            if (offset.current >= width) offset.current -= width;
            if (offset.current < 0) offset.current += width;
          }
          apply();
        }}
        onPointerUp={() => (drag.current.active = false)}
        onPointerCancel={() => (drag.current.active = false)}
        onClickCapture={(e) => {
          if (drag.current.moved > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {loop.map((p, i) => (
          <div key={`${p.slug}-${i}`} className="w-[68vw] max-w-[300px] shrink-0 sm:w-[300px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

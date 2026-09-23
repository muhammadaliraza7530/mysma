import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCatalog } from "@/context/CatalogContext";
import { Watermark } from "./Watermark";

const AUTO_SPEED = 0.035; // deg per ms — noticeably faster, still smooth

export function OrbitCarousel() {
  const { products } = useCatalog();
  const [angle, setAngle] = useState(0);
  const [radius, setRadius] = useState(260);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const moved = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      setRadius(w < 640 ? 175 : w < 1024 ? 280 : 340);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      if (dragging.current) {
        // angle driven by pointer
      } else {
        // inertia decays into the constant auto-rotation
        velocity.current *= Math.pow(0.94, dt / 16);
        setAngle((a) => a + dt * AUTO_SPEED + velocity.current * dt);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const step = 360 / products.length;

  return (
    <div
      className="relative mx-auto h-[360px] w-full max-w-5xl cursor-grab select-none active:cursor-grabbing sm:h-[440px]"
      style={{ perspective: "1400px", touchAction: "none" }}
      onPointerDown={(e) => {
        dragging.current = true;
        moved.current = 0;
        lastX.current = e.clientX;
        velocity.current = 0;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        moved.current += Math.abs(dx);
        velocity.current = (dx * 0.3) / 16;
        setAngle((a) => a + dx * 0.3);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onClickCapture={(e) => {
        if (moved.current > 8) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(-6deg) rotateY(${angle}deg)`,
        }}
      >
        {products.map((product, i) => {
          const theta = i * step;
          const normalized = (((theta + angle) % 360) + 360) % 360;
          const facing = Math.cos((normalized * Math.PI) / 180);
          const front = Math.max(facing, 0);
          const active = facing > 0.72;
          return (
            <Link
              key={product.slug}
              to="/products/$slug"
              params={{ slug: product.slug }}
              className="absolute left-1/2 top-1/2 block w-[190px] sm:w-[260px]"
              style={{
                transform: `translate(-50%, -50%) rotateY(${theta}deg) translateZ(${radius}px) scale(${0.86 + front * 0.14})`,
                opacity: 0.25 + front * 0.75,
                backfaceVisibility: "hidden",
                touchAction: "none",
                zIndex: Math.round(front * 100),
              }}
            >
              <div
                className={`glass-card relative overflow-hidden rounded-3xl transition-shadow duration-500 ${
                  active ? "edge-glow" : ""
                }`}
              >
                {active && (
                  <span className="shine-strip">
                    <span className="shine-strip-inner" />
                  </span>
                )}
                <span
                  className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500"
                  style={{
                    opacity: front,
                    background:
                      "radial-gradient(circle at 50% 15%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 62%)",
                  }}
                />
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="product-float relative aspect-square w-full"
                />
                <Watermark size="sm" />
                <div className="relative border-t border-border/60 p-3 text-center">
                  <p className="text-sm font-medium leading-snug">{product.name}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

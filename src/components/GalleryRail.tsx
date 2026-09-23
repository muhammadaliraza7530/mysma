import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  images: string[];
  name: string;
  onSelect?: (src: string) => void;
  activeSrc?: string;
};

/** Premium auto-scrolling, drag/cursor-controlled thumbnail rail. */
export function GalleryRail({ images, name, onSelect, activeSrc }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef(0);
  const paused = useRef(false);
  const drag = useRef({ active: false, x: 0, moved: 0 });
  const [width, setWidth] = useState(0);
  const loop = images.length > 1 ? [...images, ...images] : images;

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
  }, [images.length]);

  useEffect(() => {
    if (!width || images.length < 2) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      if (!paused.current && !drag.current.active) offset.current += dt * 0.085;
      if (offset.current >= width) offset.current -= width;
      if (offset.current < 0) offset.current += width;
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [width, images.length, apply]);

  return (
    <div
      className="relative w-full min-w-0 max-w-full overflow-hidden rounded-3xl [contain:inline-size]"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => {
        paused.current = false;
        drag.current.active = false;
      }}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-background to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-background to-transparent" />

      <div
        ref={trackRef}
        className="flex w-max gap-3 will-change-transform sm:gap-4"
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
      >
        {loop.map((src, i) => {
          const isActive = activeSrc === src;
          return (
            <motion.button
              key={`${src}-${i}`}
              type="button"
              onClick={() => {
                if (drag.current.moved > 6) return;
                onSelect?.(src);
              }}
              whileHover={{ y: -8, scale: 1.05, rotateX: 6 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformPerspective: 900 }}
              aria-label={`${name} view ${(i % images.length) + 1}`}
              className={`glass-card group relative aspect-square w-32 shrink-0 cursor-pointer overflow-hidden rounded-2xl sm:w-40 ${
                isActive ? "glow-ring ring-1 ring-primary/60" : "opacity-80 hover:opacity-100"
              }`}
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]" />
              <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-foreground/12 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
              <img
                src={src}
                alt={`${name} detail view ${(i % images.length) + 1}`}
                loading="lazy"
                draggable={false}
                className="relative size-full object-contain p-2"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

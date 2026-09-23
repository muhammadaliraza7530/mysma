import { useEffect, useRef } from "react";
import { Quote, Star } from "lucide-react";

export type Testimonial = { name: string; role: string; quote: string };

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const paused = useRef(false);
  const down = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      if (!paused.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += dt * 0.12;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft -= el.scrollWidth / 2;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const loop = [...items, ...items];

  return (
    <div
      ref={ref}
      className="hide-scrollbar flex cursor-grab gap-5 overflow-x-auto pb-2 active:cursor-grabbing"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => {
        paused.current = false;
        down.current = false;
      }}
      onPointerDown={(e) => {
        down.current = true;
        paused.current = true;
        startX.current = e.clientX;
        startScroll.current = e.currentTarget.scrollLeft;
      }}
      onPointerMove={(e) => {
        if (!down.current || !ref.current) return;
        ref.current.scrollLeft = startScroll.current - (e.clientX - startX.current);
      }}
      onPointerUp={() => {
        down.current = false;
        paused.current = false;
      }}
      onTouchStart={() => (paused.current = true)}
      onTouchEnd={() => (paused.current = false)}
    >
      {loop.map((t, i) => (
        <figure
          key={`${t.name}-${i}`}
          className="glass-card group relative w-[85vw] shrink-0 overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:edge-glow sm:w-[360px]"
        >
          <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_70%)] opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--primary)_70%,transparent)] to-transparent" />
          <Quote className="size-6 text-primary" />
          <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-[var(--gradient-blue)] text-sm font-semibold text-primary-foreground">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
            <span className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="size-3.5 fill-current" />
              ))}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Starfield } from "./Starfield";

/** Bare products orbiting in a circle around the headline — no boxes, no rings, no glow. */
function OrbitStage() {
  const { products } = useCatalog();
  const items = useRef<Array<HTMLDivElement | null>>([]);
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();
    const n = products.length;

    const frame = (now: number) => {
      const t = ((now - start) / 26000) % 1;
      const el0 = wrap.current;
      const w = el0?.clientWidth ?? window.innerWidth;
      const h = el0?.clientHeight ?? window.innerHeight;
      const mobile = w < 640;

      // circle (slightly elliptical) that surrounds the headline
      const rx = mobile ? Math.min(w * 0.46, 205) : Math.min(w * 0.34, 460);
      const ry = mobile ? Math.min(h * 0.34, 260) : Math.min(h * 0.34, 290);

      // keep-out zone around the text block
      const tx = mobile ? w * 0.52 : w * 0.32;
      const ty = mobile ? h * 0.24 : h * 0.2;


      items.current.forEach((el, i) => {
        if (!el) return;
        const a = (t + i / n) * Math.PI * 2;
        const x = Math.sin(a) * rx;
        const y = -Math.cos(a) * ry;
        const depth = Math.cos(a); // 1 top/back .. -1 bottom/front
        const front = 1 - (depth + 1) / 2;
        const scale = 0.72 + front * 0.5;
        const float = Math.sin(a * 2 + i) * 8;

        // fade out where the orbit crosses the headline area
        const d = Math.hypot(x / tx, (y + float) / ty);
        const clear = Math.min(Math.max((d - 0.72) / 0.34, 0), 1);

        el.style.transform =
          `translate(-50%, -50%) translate3d(${x}px, ${y + float}px, 0) ` +
          `rotateY(${-Math.sin(a) * 16}deg) scale(${scale})`;
        el.style.opacity = String((0.55 + front * 0.45) * clear);
        el.style.zIndex = String(Math.round(front * 20));
      });

      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      items.current.forEach((el, i) => {
        if (!el) return;
        const a = (i / n) * Math.PI * 2;
        el.style.transform = `translate(-50%, -50%) translate3d(${Math.sin(a) * 170}px, ${-Math.cos(a) * 210}px, 0)`;
      });
      return;
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [products]);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {products.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              items.current[i] = el;
            }}
            style={{ width: "clamp(78px, 22vw, 190px)" }}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-[62%] -z-10 h-[38%] w-[85%] -translate-x-1/2 rounded-[50%] bg-primary/20 blur-2xl"
            />
            <motion.img
              src={`/images/hero/${p.image.split("/").pop()}`}
              alt=""
              width={320}
              height={320}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="block w-full object-contain drop-shadow-[0_26px_34px_rgba(0,0,0,0.6)]"
            />

          </div>
        ))}
      </div>
    </div>
  );
}




export function Hero3D() {
  const { settings } = useSiteSettings();
  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden py-24"
      style={{ background: "var(--gradient-hero)" }}
    >
      <Starfield count={30} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[62vw] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />


      <OrbitStage />


      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 font-logo text-[clamp(2.9rem,14vw,6.6rem)] font-bold leading-[1.16] tracking-[-0.01em]"
        >
          <span className="light-sweep block pb-[0.16em]">{settings.hero.titleTop}</span>
          <span
            className="light-sweep -mt-[0.28em] block pb-[0.18em]"
            style={{ ["--sweep-color" as string]: "var(--primary)" }}
          >
            {settings.hero.titleBottom}
          </span>


        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground sm:text-lg"
        >
          {settings.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.03]"
          >
            {settings.hero.primaryCta}
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

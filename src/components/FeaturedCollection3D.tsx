"use client";

import React, { useRef, useEffect } from "react";
import { products } from "@/data/products";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturedCollection3D() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });

      if (headingRef.current) {
        tl.from(headingRef.current as HTMLElement, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      const gridChildren = gridRef.current
        ? (Array.from(gridRef.current.children) as HTMLElement[])
        : [];
      if (gridChildren.length) {
        tl.from(
          gridChildren,
          {
            y: 20,
            opacity: 0,
            stagger: 0.09,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=.45",
        );
      }

      const validCards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (validCards.length) {
        tl.from(validCards, { scale: 0.98, duration: 0.6, ease: "power3.out" }, "-=.5");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // pointer tilt handlers
  const handlePointerMove = (e: React.PointerEvent, el: HTMLDivElement | null) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    const rotateY = (px - 0.5) * 22; // -11 .. 11 deg
    const rotateX = (0.5 - py) * 14; // -7 .. 7 deg

    el.style.setProperty("--card-tilt-x", `${rotateX}deg`);
    el.style.setProperty("--card-tilt-y", `${rotateY}deg`);
    el.style.setProperty("--card-pop", `translateZ(18px)`);
    el.classList.add("is-hovered");
  };

  const handlePointerLeave = (el: HTMLDivElement | null) => {
    if (!el) return;
    // smooth reset
    el.style.setProperty("--card-tilt-x", `0deg`);
    el.style.setProperty("--card-tilt-y", `0deg`);
    el.style.setProperty("--card-pop", `translateZ(0)`);
    el.classList.remove("is-hovered");
  };

  return (
    <section ref={sectionRef} className="relative py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headingRef} className="pointer-events-none text-center mb-8 md:mb-12">
          <span className="text-[10px] tracking-[0.38em] text-primary uppercase">
            The collection
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            Four objects. Zero compromise.
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Hover, tilt and rotate. Every card is a real 3D surface — the way a premium product page
            should feel.
          </p>
        </div>

        <div
          ref={gridRef}
          className="scene-3d grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.slice(0, 4).map((p, i) => (
            <div
              key={p.slug}
              ref={(el) => {
                cardRefs.current[i] = el ?? null;
              }}
              className="card-3d glass-card relative overflow-hidden rounded-2xl p-4"
              onPointerMove={(e) => handlePointerMove(e, cardRefs.current[i] ?? null)}
              onPointerLeave={() => handlePointerLeave(cardRefs.current[i] ?? null)}
            >
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div
                  className="absolute -inset-0.5 rounded-2xl border"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>

              <div className="flex h-full flex-col md:flex-row gap-4 items-center md:items-start">
                <div className="w-full md:w-1/2 flex items-center justify-center">
                  <img src={p.image} alt={p.name} className="w-full h-40 object-contain" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">{p.short}</div>
                  <div className="text-lg font-semibold text-white">{p.name}</div>
                  <div className="text-sm text-primary font-semibold">{p.price}</div>
                  <div className="mt-3">
                    <button className="px-4 py-2 rounded-full bg-primary text-white shadow-sm">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

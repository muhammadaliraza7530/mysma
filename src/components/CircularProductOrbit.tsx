import React, { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { products } from "@/data/products";
import { useIsMobile } from "@/components/ClientOnly";

export function CircularProductOrbit() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mobile = useIsMobile();
  const totalProducts = products.length;

  // Non-stop smooth continuous linear rotation (~14 seconds per full 360° circle)
  useEffect(() => {
    let animId: number;
    const speedDegreesPerSecond = 24; // Linear speed in deg/s

    const update = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (now - lastTimeRef.current) / 1000;
        if (!isHovered && !isDragging) {
          setRotationAngle((prev) => (prev + speedDegreesPerSecond * delta) % 360000);
        }
      }
      lastTimeRef.current = now;
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(animId);
      lastTimeRef.current = null;
    };
  }, [isHovered, isDragging]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 360 / totalProducts;
      if (e.key === "ArrowLeft") {
        setRotationAngle((prev) => prev - step);
      }
      if (e.key === "ArrowRight") {
        setRotationAngle((prev) => prev + step);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalProducts]);

  // Drag / Swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = rotationAngle;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dragX = e.clientX - dragStartXRef.current;
    const dragSensitivity = mobile ? 0.6 : 0.4;
    setRotationAngle(dragStartAngleRef.current - dragX * dragSensitivity);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  // Click card to rotate front & center
  const handleCardClick = (index: number) => {
    const stepAngle = 360 / totalProducts;
    const targetBaseAngle = index * stepAngle;

    let diff = (targetBaseAngle - (rotationAngle % 360)) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    setRotationAngle((prev) => prev + diff);
  };

  // 3D Orbital Radius
  const radius = mobile ? 220 : 360;

  return (
    <section className="relative w-full max-w-[100vw] overflow-hidden py-14 md:py-22 bg-[#070c16] text-foreground border-y border-blue-950/40">
      {/* Clean background with subtle ambient central glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] sm:size-[650px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            <Sparkles className="size-3.5" />
            <span>3D Circular Orbit</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl tracking-tight text-white">
            Auto-Rotating 3D Orbit
          </h2>

          <p className="mt-3 text-sm md:text-base text-slate-400">
            Smooth 3D circular carousel showcasing our flagship compact products.
          </p>
        </div>

        {/* 3D CIRCULAR CAROUSEL STAGE */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative mt-8 sm:mt-12 h-[340px] sm:h-[390px] md:h-[430px] w-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-pan-y overflow-visible"
          style={{ perspective: mobile ? "900px" : "1300px" }}
        >
          {/* 3D Ring Orbit Center */}
          <div className="relative w-full max-w-[260px] sm:max-w-[310px] md:max-w-[350px] h-[280px] sm:h-[330px] md:h-[370px] flex items-center justify-center [transform-style:preserve-3d]">
            {products.map((product, index) => {
              const stepAngle = 360 / totalProducts;
              const cardBaseAngle = index * stepAngle;

              // Calculate shortest angular offset relative to rotationAngle
              let rawDiff = (cardBaseAngle - rotationAngle) % 360;
              if (rawDiff > 180) rawDiff -= 360;
              if (rawDiff < -180) rawDiff += 360;

              const angleRad = (rawDiff * Math.PI) / 180;

              // 3D Circular Ring Math
              const translateX = radius * Math.sin(angleRad);
              const translateZ = radius * Math.cos(angleRad) - radius;
              const rotateY = -rawDiff * 0.75;

              // Distance factor from active front (0° = front center)
              const absAngle = Math.abs(rawDiff);
              const dist = Math.min(2, absAngle / 90);

              // Scale & Opacity calculations
              const scale = 1 - dist * 0.15;
              const opacity = Math.max(0.15, 1 - dist * 0.45);
              const zIndex = Math.round(30 - dist * 10);

              const isActive = Math.abs(rawDiff) < 22;

              return (
                <Link
                  key={product.slug}
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                      handleCardClick(index);
                    }
                  }}
                  className={`absolute inset-0 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-between text-center transition-colors duration-300 ${
                    isActive
                      ? "bg-slate-900/90 border-2 border-blue-500/80 shadow-[0_20px_50px_rgba(59,130,246,0.25)] cursor-pointer"
                      : "bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 cursor-pointer"
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transformStyle: "preserve-3d",
                    transition: isDragging ? "none" : "transform 0.08s linear, opacity 0.15s ease",
                  }}
                >
                  {/* Glowing background halo for active card */}
                  {isActive && (
                    <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-blue-600/30 to-sky-400/20 blur-xl opacity-80 z-[-1]" />
                  )}

                  {/* Product Image Cutout */}
                  <div className="relative my-auto aspect-square max-h-[160px] sm:max-h-[190px] w-full flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`max-h-full object-contain transition-transform duration-500 ${
                        isActive
                          ? "scale-105 drop-shadow-[0_15px_25px_rgba(59,130,246,0.3)]"
                          : "scale-95 opacity-80"
                      }`}
                    />
                    <img
                      src="/images/logo.png"
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute bottom-1 right-2 h-4 w-auto opacity-50 mix-blend-screen"
                    />
                  </div>

                  {/* Product Title (Centered & Balanced) */}
                  <div className="pt-2">
                    <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Aliases for compatibility
export const PerspectiveCardSlider = CircularProductOrbit;
export const CoverflowCardSlider = CircularProductOrbit;

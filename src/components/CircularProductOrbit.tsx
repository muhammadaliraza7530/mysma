import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles as SparklesIcon,
  ArrowRight,
  ShoppingCart,
  Eye,
  Pause,
  Play,
  Layers,
  MoveHorizontal,
  Zap,
  ShieldCheck,
  Check,
} from "lucide-react";
import { products, Product } from "@/data/products";
import { useIsMobile } from "@/components/ClientOnly";
import { useCart } from "@/context/CartContext";

export function CircularProductOrbit() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mobile = useIsMobile();
  const { addToCart } = useCart();
  const totalProducts = products.length;

  const activeProduct = products[activeIndex] || products[0]!;

  // Handle switching active index smoothly
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalProducts);
  }, [totalProducts]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalProducts) % totalProducts);
  }, [totalProducts]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || isDragging) return;
    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 4500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, isDragging, handleNext]);

  // Keyboard arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Pointer/Touch Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    setDragX(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - dragStartX.current;
    setDragX(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const duration = Math.max(1, Date.now() - dragStartTime.current);
    const velocity = dragX / duration; // px/ms

    // Threshold check for switching card
    if (dragX < -40 || velocity < -0.35) {
      handleNext();
    } else if (dragX > 40 || velocity > 0.35) {
      handlePrev();
    }

    setDragX(0);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 1800);
  };

  return (
    <section className="relative w-full max-w-[100vw] overflow-hidden py-12 md:py-20 bg-gradient-to-b from-background via-card/20 to-background border-b border-border/40">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-primary/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <SparklesIcon className="size-3.5" />
            <span>3D Perspective Coverflow</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl tracking-tight text-foreground">
            Stacked 3D Product Slider
          </h2>

          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Swipe or drag horizontally to switch products. Active card sits in high-definition
            foreground with stacked 3D depth.
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto px-2">
          {/* Touch / Drag guide badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/60">
            <MoveHorizontal className="size-3.5 text-primary animate-pulse" />
            <span>Drag or swipe left/right</span>
          </div>

          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground hover:border-primary/50"
            title={isPaused ? "Resume Auto-Slide" : "Pause Auto-Slide"}
          >
            {isPaused ? (
              <>
                <Play className="size-3 text-primary" />
                <span>Play Slider</span>
              </>
            ) : (
              <>
                <Pause className="size-3 text-primary" />
                <span>Pause Slider</span>
              </>
            )}
          </button>
        </div>

        {/* 3D PERSPECTIVE COVERFLOW STAGE */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative mt-8 sm:mt-12 h-[420px] sm:h-[480px] md:h-[540px] w-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-pan-y overflow-visible"
          style={{ perspective: mobile ? "800px" : "1200px" }}
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 md:left-12 z-40 flex size-11 sm:size-14 items-center justify-center rounded-full border border-primary/30 bg-card/80 text-foreground backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white hover:glow-ring shadow-xl"
            aria-label="Previous Product"
          >
            <ChevronLeft className="size-6 sm:size-7" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 md:right-12 z-40 flex size-11 sm:size-14 items-center justify-center rounded-full border border-primary/30 bg-card/80 text-foreground backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white hover:glow-ring shadow-xl"
            aria-label="Next Product"
          >
            <ChevronRight className="size-6 sm:size-7" />
          </button>

          {/* Stacked 3D Cards */}
          <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] h-[360px] sm:h-[410px] md:h-[460px] flex items-center justify-center [transform-style:preserve-3d]">
            {products.map((product, index) => {
              // Calculate shortest relative 3D offset
              let offset = index - activeIndex;
              if (offset > totalProducts / 2) offset -= totalProducts;
              if (offset < -totalProducts / 2) offset += totalProducts;

              // Factor in active live dragging offset
              const dragNorm = isDragging ? dragX / (mobile ? 180 : 280) : 0;
              const effectiveOffset = offset + dragNorm;
              const absOffset = Math.abs(effectiveOffset);

              const isActive = Math.abs(effectiveOffset) < 0.4;

              // 3D Perspective Transformations
              let translateX = 0;
              let translateZ = 0;
              let rotateY = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 10;
              let filter = "none";

              if (isActive) {
                // FOREGROUND ACTIVE CARD: scale-100/105, fully opaque, zIndex 30
                translateX = effectiveOffset * (mobile ? 140 : 260);
                translateZ = 30 - absOffset * 40;
                rotateY = effectiveOffset * -22;
                scale = 1 - absOffset * 0.1;
                opacity = 1;
                zIndex = 30;
                filter = "none";
              } else if (effectiveOffset < 0) {
                // LEFT STACKED BACKGROUND CARDS: negative translateZ, lower opacity, lower zIndex
                translateX = -120 - Math.abs(effectiveOffset) * (mobile ? 70 : 130);
                translateZ = -150 - Math.abs(effectiveOffset) * 90;
                rotateY = 32 + Math.abs(effectiveOffset) * 10;
                scale = Math.max(0.6, 0.82 - (absOffset - 1) * 0.15);
                opacity = Math.max(0.18, 0.55 - (absOffset - 1) * 0.25);
                zIndex = Math.round(20 - absOffset * 8);
                filter = "brightness(0.65) blur(0.6px)";
              } else {
                // RIGHT STACKED BACKGROUND CARDS: negative translateZ, lower opacity, lower zIndex
                translateX = 120 + Math.abs(effectiveOffset) * (mobile ? 70 : 130);
                translateZ = -150 - Math.abs(effectiveOffset) * 90;
                rotateY = -32 - Math.abs(effectiveOffset) * 10;
                scale = Math.max(0.6, 0.82 - (absOffset - 1) * 0.15);
                opacity = Math.max(0.18, 0.55 - (absOffset - 1) * 0.25);
                zIndex = Math.round(20 - absOffset * 8);
                filter = "brightness(0.65) blur(0.6px)";
              }

              return (
                <div
                  key={product.slug}
                  onClick={() => {
                    if (!isActive) setActiveIndex(index);
                  }}
                  className={`absolute inset-0 rounded-3xl p-5 sm:p-6 transition-all duration-500 ease-out flex flex-col justify-between ${
                    isActive
                      ? "glass-panel border-2 border-primary/60 shadow-2xl shadow-primary/20 cursor-pointer"
                      : "bg-card/90 border border-border/70 hover:border-primary/40 cursor-pointer"
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    filter,
                    transformStyle: "preserve-3d",
                    transition: isDragging ? "none" : "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {/* Glowing halo behind active card */}
                  {isActive && (
                    <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-primary/30 to-accent/20 blur-xl opacity-80 z-[-1]" />
                  )}

                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-[11px] font-bold text-primary">
                      <span>0{index + 1}</span>
                      <span>/</span>
                      <span>0{totalProducts}</span>
                    </span>

                    {isActive ? (
                      <span className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-semibold text-primary uppercase tracking-wider">
                        <SparklesIcon className="size-3" />
                        <span>Foreground Active</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Click to Focus
                      </span>
                    )}
                  </div>

                  {/* 3D Product Image Cutout */}
                  <div className="relative my-auto aspect-square max-h-[190px] sm:max-h-[220px] w-full flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`max-h-full object-contain transition-transform duration-500 ${
                        isActive
                          ? "scale-105 drop-shadow-[0_20px_30px_rgba(59,130,246,0.28)]"
                          : "scale-95 opacity-80"
                      }`}
                    />
                    <img
                      src="/images/logo.png"
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute bottom-1 right-2 h-4 w-auto opacity-60 mix-blend-screen"
                    />
                  </div>

                  {/* Product Title & Details */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-sm sm:text-base font-extrabold text-primary shrink-0">
                        {product.price}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {product.tagline}
                    </p>

                    {/* Active Card Interactive Buttons */}
                    {isActive && (
                      <div className="mt-4 flex items-center gap-2 pt-2 border-t border-border/50">
                        <Link
                          to="/products/$slug"
                          params={{ slug: product.slug }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:glow-ring"
                        >
                          <Eye className="size-3.5" />
                          <span>3D Details</span>
                        </Link>

                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/40 bg-card/80 px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-primary/20 hover:border-primary"
                        >
                          {addedSlug === product.slug ? (
                            <>
                              <Check className="size-3.5 text-green-400" />
                              <span className="text-green-400">Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="size-3.5 text-primary" />
                              <span>Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {products.map((p, idx) => (
            <button
              key={p.slug}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "w-8 h-2.5 bg-primary shadow-md shadow-primary/30"
                  : "w-2.5 h-2.5 bg-muted border border-border hover:bg-primary/50"
              }`}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>

        {/* ACTIVE PRODUCT SPOTLIGHT BANNER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-8 mx-auto max-w-4xl glass-panel rounded-3xl p-5 sm:p-7 border border-primary/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
                <div className="size-20 sm:size-24 shrink-0 rounded-2xl bg-background/80 p-2.5 border border-primary/30 flex items-center justify-center shadow-lg">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="size-full object-contain"
                  />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-bold">
                    <Zap className="size-3.5 text-primary" />
                    <span>Featured Compact Tech</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground mt-0.5 truncate">
                    {activeProduct.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
                    {activeProduct.short}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 border border-border">
                      <ShieldCheck className="size-3 text-primary" /> 1-Year Warranty
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 border border-border">
                      Free Express Shipping
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border/60">
                <div className="text-left md:text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Price
                  </div>
                  <div className="text-2xl font-black text-primary">{activeProduct.price}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleAddToCart(activeProduct, e)}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/90 px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-primary/20 hover:border-primary"
                  >
                    <ShoppingCart className="size-3.5 text-primary" />
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    to="/products/$slug"
                    params={{ slug: activeProduct.slug }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:glow-ring"
                  >
                    <span>View 3D Page</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// Aliases for compatibility
export const PerspectiveCardSlider = CircularProductOrbit;
export const CoverflowCardSlider = CircularProductOrbit;

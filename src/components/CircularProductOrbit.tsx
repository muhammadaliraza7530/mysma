import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";
import { products, Product } from "@/data/products";
import { ClientOnly, useIsMobile } from "@/components/ClientOnly";
import { Link } from "@tanstack/react-router";
import { ArrowRight, RotateCw, Pause, Play, Sparkles as SparklesIcon } from "lucide-react";

interface OrbitItemProps {
  product: Product;
  index: number;
  count: number;
  rotationOffset: number;
  activeSlug: string;
  onSelect: (p: Product) => void;
  radius: number;
}

function OrbitItem({
  product,
  index,
  count,
  rotationOffset,
  activeSlug,
  onSelect,
  radius,
}: OrbitItemProps) {
  const texture = useLoader(THREE.TextureLoader, product.cutout);
  const groupRef = useRef<THREE.Group>(null);
  const baseAngle = (index / count) * Math.PI * 2;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const currentAngle = baseAngle + rotationOffset;

    const x = Math.cos(currentAngle) * radius;
    const z = Math.sin(currentAngle) * (radius * 0.6);
    const y = Math.sin(currentAngle * 2) * 0.25;

    // smooth position
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, x, 6, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, z, 6, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, y, 6, delta);

    // face forward with slight tilt
    const facing = (Math.sin(currentAngle) + 1) / 2; // 0..1 (1 is closest to camera)
    const scaleFactor = 0.75 + facing * 0.45;
    groupRef.current.scale.setScalar(scaleFactor);

    // subtle rotation toward camera
    groupRef.current.rotation.y = Math.sin(currentAngle) * 0.25;
  });

  const isActive = activeSlug === product.slug;

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh onClick={() => onSelect(product)} className="cursor-pointer">
          <planeGeometry args={[1.4, 1.4]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>

        {/* Glow ring base under each floating product */}
        <mesh position={[0, -0.85, -0.05]} rotation={[-Math.PI / 2.1, 0, 0]}>
          <circleGeometry args={[0.65, 32]} />
          <meshBasicMaterial
            color={isActive ? "#3B82F6" : "#60A5FA"}
            transparent
            opacity={isActive ? 0.4 : 0.18}
          />
        </mesh>
      </Float>
    </group>
  );
}

function CircularOrbitCanvas({
  activeProduct,
  setActiveProduct,
  mobile,
}: {
  activeProduct: Product;
  setActiveProduct: (p: Product) => void;
  mobile: boolean;
}) {
  const [rotationOffset, setRotationOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const targetRotationRef = useRef(0);

  // continuous circular movement
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPaused) {
        targetRotationRef.current += delta * 0.35; // speed of orbit circular movement
      }

      setRotationOffset((prev) => {
        const diff = targetRotationRef.current - prev;
        return prev + diff * 0.1;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // handle direct select of a product to bring it front
  const handleSelectProduct = (p: Product) => {
    setActiveProduct(p);
    const index = products.findIndex((prod) => prod.slug === p.slug);
    if (index !== -1) {
      // calculate angle to bring this product to the front (angle = Math.PI / 2)
      const targetAngle = Math.PI / 2 - (index / products.length) * Math.PI * 2;
      // find nearest multiple of 2PI
      const current = targetRotationRef.current;
      const k = Math.round((current - targetAngle) / (Math.PI * 2));
      targetRotationRef.current = targetAngle + k * Math.PI * 2;
    }
  };

  const radius = mobile ? 2.4 : 3.4;

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] md:h-[560px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0.4, mobile ? 8.5 : 7.2], fov: 42 }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ powerPreference: "high-performance", alpha: true }}
      >
        <Suspense
          fallback={
            <Html center className="text-xs text-muted-foreground">
              Loading 3D Orbit...
            </Html>
          }
        >
          <ambientLight intensity={1.4} />
          <pointLight position={[5, 6, 5]} intensity={35} color="#3B82F6" />
          <pointLight position={[-5, -4, -5]} intensity={20} color="#60A5FA" />

          {/* Sparkles particle aura around the circle */}
          <Sparkles
            count={mobile ? 50 : 120}
            scale={[radius * 2.2, 4, radius * 1.8]}
            size={2.2}
            speed={0.5}
            color="#60A5FA"
            opacity={0.65}
          />

          {/* The 4 Products orbiting in a circle */}
          <group position={[0, 0.2, 0]}>
            {products.slice(0, 4).map((product, index) => (
              <OrbitItem
                key={product.slug}
                product={product}
                index={index}
                count={4}
                rotationOffset={rotationOffset}
                activeSlug={activeProduct.slug}
                onSelect={handleSelectProduct}
                radius={radius}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>

      {/* Orbit Pause/Play Toggle */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground hover:border-primary/50"
        title={isPaused ? "Resume Circular Motion" : "Pause Motion"}
      >
        {isPaused ? (
          <>
            <Play className="size-3 text-primary" />
            <span>Play Circle</span>
          </>
        ) : (
          <>
            <Pause className="size-3 text-primary" />
            <span>Pause Circle</span>
          </>
        )}
      </button>
    </div>
  );
}

export function CircularProductOrbit() {
  const [activeProduct, setActiveProduct] = useState<Product>(products[0]!);
  const mobile = useIsMobile();

  return (
    <section className="relative w-full max-w-[100vw] overflow-hidden py-12 md:py-20 bg-gradient-to-b from-background via-card/30 to-background border-b border-border/40">
      {/* Background radial highlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <SparklesIcon className="size-3.5" />
            <span>Circular 3D Showcase</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl md:text-5xl tracking-tight text-foreground">
            4 Compact Tech Products in Orbit
          </h2>

          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Watch all four machines revolve in a continuous 3D circle. Click any product or pill
            below to inspect details.
          </p>
        </div>

        {/* 3D Circular Motion Orbit View */}
        <div className="mt-4 sm:mt-6">
          <ClientOnly
            fallback={
              <div className="h-[420px] flex items-center justify-center text-sm text-muted-foreground">
                Loading 3D Circular Motion...
              </div>
            }
          >
            <CircularOrbitCanvas
              activeProduct={activeProduct}
              setActiveProduct={setActiveProduct}
              mobile={mobile}
            />
          </ClientOnly>
        </div>

        {/* Product selector buttons / navigation */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {products.slice(0, 4).map((p, idx) => {
            const isActive = activeProduct.slug === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => setActiveProduct(p)}
                className={`flex items-center gap-2.5 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/40 scale-105"
                    : "bg-card/90 text-muted-foreground border border-border hover:bg-card hover:text-foreground hover:border-primary/40"
                }`}
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary dark:text-white">
                  {idx + 1}
                </span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Product Highlight Card Banner */}
        <div className="mt-8 mx-auto max-w-3xl glass-panel rounded-2xl p-4 sm:p-6 border border-primary/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-16 sm:size-20 shrink-0 rounded-xl bg-background/60 p-2 border border-border flex items-center justify-center">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="size-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Selected Product
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {activeProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                  {activeProduct.short}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-border/60 pt-3 sm:pt-0">
              <span className="text-base sm:text-lg font-bold text-primary">
                {activeProduct.price}
              </span>
              <Link
                to="/products/$slug"
                params={{ slug: activeProduct.slug }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:glow-ring"
              >
                View Details
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

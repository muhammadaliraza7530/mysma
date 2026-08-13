import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, RoundedBox, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { products } from "@/data/products";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Starfield({ count = 800 }: { count?: number }) {
  const points = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={points}
          count={points.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#A8D8FF"
        size={0.6}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
        transparent
      />
    </points>
  );
}

interface GlassCardProps {
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  texture: string;
}

function GlassCard({ index, position, rotation, texture }: GlassCardProps) {
  const cardRef = useRef<THREE.Group>(null);
  const imgTex = useLoader(THREE.TextureLoader, texture);

  useFrame((state, delta) => {
    if (!cardRef.current) return;
    // subtle floating
    cardRef.current.rotation.y = cardRef.current.rotation.y * 0.98 + (rotation[1] || 0) * 0.02;
    cardRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.0005;
  });

  return (
    <group ref={cardRef} position={position} rotation={rotation}>
      <RoundedBox args={[3.8, 2.6, 0.18]} radius={0.18} smoothness={6} castShadow receiveShadow>
        <meshPhysicalMaterial
          transmission={0.65}
          thickness={0.5}
          roughness={0.05}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
          color="#ffffff09"
          reflectivity={0.6}
        />
      </RoundedBox>

      {/* Product platform (slightly above the card) */}
      <group position={[0, 0.45, 0.28]}>
        {/* simple reflective pedestal */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.26, 0.36, 0.12, 32]} />
          <meshStandardMaterial color="#0B0F17" metalness={0.6} roughness={0.25} />
        </mesh>

        {/* use the product image as a front-facing plane to stand in as the model */}
        <mesh position={[0, 0.15, 0.28]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1.1, 0.28]} />
          <meshPhysicalMaterial map={imgTex} metalness={0.15} roughness={0.3} />
        </mesh>
      </group>

      {/* embedded 3D label text on the card */}
      <Text
        position={[-1.62, -0.62, 0.11]}
        fontSize={0.18}
        color="#FFFFFF"
        anchorX="left"
        anchorY="middle"
      >
        {products[index].name}
      </Text>

      {/* price */}
      <Text
        position={[1.62, -0.62, 0.11]}
        fontSize={0.14}
        color="#A8CFFD"
        anchorX="right"
        anchorY="middle"
      >
        {products[index].price}
      </Text>

      {/* Explore button rendered as a small rounded plate */}
      <mesh position={[0, -0.9, 0.12]}>
        <boxGeometry args={[1.2, 0.36, 0.06]} />
        <meshPhysicalMaterial color="#3B82F6" metalness={0.6} roughness={0.15} />
      </mesh>
      <Text
        position={[0, -0.9, 0.17]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        Explore
      </Text>
    </group>
  );
}

export default function CollectionShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
    // create a scroll-driven subtle tilt or rotation for the full assembly
    const ctx = gsap.context(() => {
      const obj = { ry: 0.0 };
      gsap.to(obj, {
        ry: Math.PI * 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
        onUpdate: () => {
          // nothing direct here, read by useFrame via ref if needed
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const positions = useMemo(() => {
    const baseRadius = 6; // depth radius
    const list = products.slice(0, 4).map((p, i) => {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 6;
      return [Math.cos(angle) * baseRadius * 0.6, 0, Math.sin(angle) * baseRadius * 0.9];
    });
    return list;
  }, []);

  return (
    <div ref={containerRef} className="w-screen h-screen fixed inset-0 z-50 pointer-events-auto">
      <Canvas camera={{ position: [0, 2.4, 10], fov: 38 }} shadows>
        <color attach="background" args={["#071028"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 8, 6]} intensity={1.6} color="#BFDFFF" />
        <spotLight position={[-6, 6, -4]} intensity={0.9} color="#3B82F6" penumbra={0.6} />

        <Starfield />

        <group position={[0, 0.3, 0]}>
          {products.slice(0, 4).map((p, i) => (
            <GlassCard
              key={p.slug}
              index={i}
              position={positions[i]}
              rotation={[0, (i / 4) * Math.PI * 2, 0]}
              texture={p.image}
            />
          ))}
        </group>

        <Environment preset="sunset" />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxPolarAngle={Math.PI * 0.49}
          minPolarAngle={Math.PI * 0.2}
        />
      </Canvas>

      {/* top UI overlays in HTML so text is crisp and accessible */}
      <div className="absolute inset-x-0 top-12 z-60 flex flex-col items-center pointer-events-none">
        <div className="text-center max-w-3xl px-4">
          <div className="text-sm tracking-wider text-primary uppercase">The Collection</div>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold text-white">
            Four objects. Zero compromise.
          </h1>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-60 pointer-events-auto">
        <button className="bg-primary text-white px-6 py-3 rounded-full shadow-lg">
          Explore the collection
        </button>
      </div>
    </div>
  );
}

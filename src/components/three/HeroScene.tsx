import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Sparkles, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { products } from "@/data/products";

function ProductPlane({
  url,
  radius,
  index,
  count,
  speed,
  sizeScale = 1,
}: {
  url: string;
  radius: number;
  index: number;
  count: number;
  speed: number;
  sizeScale?: number;
}) {
  const texture = useLoader(THREE.TextureLoader, url);
  const ref = useRef<THREE.Group>(null);
  const offset = (index / count) * Math.PI * 2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (!ref.current) return;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius * 0.55;
    ref.current.position.y = Math.sin(t * 1.3) * 0.55;
    ref.current.rotation.y = Math.sin(t) * 0.35;
    const depth = (Math.sin(t) + 1) / 2;
    const s = (0.8 + depth * 0.3) * sizeScale;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.35} floatIntensity={0.6}>
        <mesh>
          <planeGeometry args={[1.35, 1.35]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.95, -0.05]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <circleGeometry args={[0.5, 48]} />
          <meshBasicMaterial color="#4CA1FF" transparent opacity={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

function Rig({ intensity = 1 }: { intensity?: number }) {
  useFrame((state, delta) => {
    const x = (state.pointer.x * 1.1 + 0) * intensity;
    const y = (state.pointer.y * 0.6 + 0.2) * intensity;
    state.camera.position.x += (x - state.camera.position.x) * Math.min(1, delta * 2);
    state.camera.position.y += (y - state.camera.position.y) * Math.min(1, delta * 2);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ mobile = false }: { mobile?: boolean }) {
  const items = useMemo(() => products.map((p) => p.cutout), []);
  return (
    <Canvas
      dpr={mobile ? [1, 1.6] : [1, 2]}
      gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0.2, mobile ? 12 : 8.4], fov: 40 }}
    >
      <Suspense fallback={<Html center />}>
        <ambientLight intensity={1.2} />
        <pointLight position={[4, 4, 4]} intensity={40} color="#4CA1FF" />
        {items.map((url, i) => (
          <ProductPlane
            key={url}
            url={url}
            index={i}
            count={items.length}
            radius={mobile ? 2.7 : 2.9}
            sizeScale={mobile ? 0.8 : 1}
            speed={0.22}
          />
        ))}
        <Sparkles
          count={mobile ? 60 : 140}
          scale={[12, 7, 6]}
          size={2.4}
          speed={0.4}
          color="#4CA1FF"
          opacity={0.7}
        />
      </Suspense>
      <Rig intensity={mobile ? 0.35 : 1} />
    </Canvas>
  );
}

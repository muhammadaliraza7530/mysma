import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { PresentationControls, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Panel({ url }: { url: string }) {
  const texture = useLoader(THREE.TextureLoader, url);
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.3;
  });
  return (
    <group ref={ref}>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7}>
        <mesh castShadow>
          <boxGeometry args={[2.6, 2.6, 0.14]} />
          <meshStandardMaterial color="#0d1626" metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.08]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ProductViewer({ url, mobile = false }: { url: string; mobile?: boolean }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.6] : [1, 2]}
      gl={{ antialias: !mobile, alpha: true }}
      camera={{ position: [0, 0, 5.2], fov: 45 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.1} />
        <spotLight position={[5, 6, 5]} angle={0.4} intensity={80} color="#7fd8ff" />
        <PresentationControls
          global
          snap
          speed={1.4}
          polar={[-0.3, 0.3]}
          azimuth={[-Math.PI, Math.PI]}
        >
          <Panel url={url} />
        </PresentationControls>
      </Suspense>
    </Canvas>
  );
}

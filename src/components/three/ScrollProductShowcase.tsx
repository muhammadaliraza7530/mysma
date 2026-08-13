import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function ProductModel({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const washerTexture = useLoader(THREE.TextureLoader, "/images/hero/washer.png");
  const panelTexture = useLoader(THREE.TextureLoader, "/images/washer-panel.jpg");

  return (
    <group ref={groupRef} scale={1.2} position={[0, 0.2, 0]}>
      {/* Main Body Cylindrical Appliance Chassis */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.25, 2.0, 64]} />
        <meshStandardMaterial color="#0b121e" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Top Cap */}
      <mesh castShadow position={[0, 1.02, 0]}>
        <cylinderGeometry args={[1.22, 1.2, 0.08, 64]} />
        <meshStandardMaterial color="#1a273b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Control Glass Screen on Top */}
      <mesh position={[0, 1.07, 0.2]} rotation={[-Math.PI / 12, 0, 0]}>
        <planeGeometry args={[1.1, 1.1]} />
        <meshBasicMaterial map={panelTexture} toneMapped={false} />
      </mesh>

      {/* Chrome Bezel Rim */}
      <mesh position={[0, 0, 1.22]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.78, 0.05, 32, 64]} />
        <meshStandardMaterial color="#4CA1FF" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Front Door Glass displaying product cut-out */}
      <mesh position={[0, 0, 1.26]}>
        <circleGeometry args={[0.76, 64]} />
        <meshBasicMaterial map={washerTexture} transparent toneMapped={false} />
      </mesh>

      {/* Glowing LED Ring */}
      <mesh position={[0, 0, 1.24]}>
        <ringGeometry args={[0.78, 0.82, 64]} />
        <meshBasicMaterial color="#4CA1FF" toneMapped={false} />
      </mesh>

      {/* Base Accent */}
      <mesh castShadow position={[0, -1.05, 0]}>
        <cylinderGeometry args={[1.3, 1.35, 0.12, 64]} />
        <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Subtle Orbital Halo */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.0, 0.015, 16, 100]} />
        <meshBasicMaterial color="#4CA1FF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function ScrollRig({
  modelRef,
  sectionRef,
}: {
  modelRef: React.RefObject<THREE.Group | null>;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 0.55, 5.8));
  const target = useRef({ x: 0, y: 0.2, z: 0, rx: -0.45, ry: 0.3 });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          target.current,
          {
            x: 0.75,
            y: 0.45,
            z: 0.55,
            rx: 0.52,
            ry: Math.PI * 1.8,
            ease: "none",
          },
          0,
        )
        .to(
          cameraTarget.current,
          {
            x: 1.2,
            y: 0.8,
            z: 4.4,
            ease: "none",
          },
          0,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    modelRef.current.position.x = THREE.MathUtils.damp(
      modelRef.current.position.x,
      target.current.x,
      3.5,
      delta,
    );
    modelRef.current.position.y = THREE.MathUtils.damp(
      modelRef.current.position.y,
      target.current.y,
      3.5,
      delta,
    );
    modelRef.current.position.z = THREE.MathUtils.damp(
      modelRef.current.position.z,
      target.current.z,
      3.5,
      delta,
    );
    modelRef.current.rotation.x = THREE.MathUtils.damp(
      modelRef.current.rotation.x,
      target.current.rx,
      4.2,
      delta,
    );
    modelRef.current.rotation.y = THREE.MathUtils.damp(
      modelRef.current.rotation.y,
      target.current.ry,
      4.2,
      delta,
    );

    camera.position.lerp(cameraTarget.current, 1 - Math.exp(-delta * 2.6));
    camera.lookAt(0, 0, 0);

    const floatOffset = Math.sin(state.clock.elapsedTime * 1.1) * 0.18;
    modelRef.current.position.y += floatOffset * 0.12;
  });

  return null;
}

export function ScrollProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group>(null);

  return (
    <section ref={sectionRef} className="relative h-[220vh] overflow-hidden">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,208,255,0.18),transparent_48%)]" />

        <div className="pointer-events-none absolute inset-x-0 top-14 z-10 mx-auto max-w-3xl px-5 text-center">
          <span className="text-[10px] tracking-[0.38em] text-primary uppercase">
            Scroll system
          </span>
          <h2 className="mt-4 text-4xl font-semibold md:text-6xl">Move with the product.</h2>
        </div>

        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0.55, 5.8], fov: 32 }} shadows dpr={[1, 1.8]}>
            <color attach="background" args={["#050816"]} />
            <fog attach="fog" args={["#050816", 7, 14]} />
            <ambientLight intensity={1.15} />
            <directionalLight position={[3, 4, 3]} intensity={2.4} castShadow />
            <pointLight position={[-4, 2, 4]} intensity={30} color="#4CA1FF" />
            <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
              <ProductModel groupRef={modelRef} />
            </Float>
            <Environment preset="city" />
            <ScrollRig modelRef={modelRef} sectionRef={sectionRef} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 mx-auto max-w-2xl px-5 text-center text-sm text-muted-foreground md:text-base">
          A fluid product reveal that rotates with the scroll while the camera glides between reveal
          states.
        </div>
      </div>
    </section>
  );
}

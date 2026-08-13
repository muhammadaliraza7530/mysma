import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { products } from "@/data/products";

function ProductModel({ groupRef, cutout }: { groupRef: React.RefObject<THREE.Group | null>; cutout: string }) {
  const texture = useLoader(THREE.TextureLoader, cutout);

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 1.2, 64]} />
        <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.66]}>
        <circleGeometry args={[0.86, 64]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
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
  const rotation = useRef({ value: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // rotation control via GSAP ScrollTrigger: full 360 over the section
  useEffect(() => {
    // register GSAP plugins client-side only
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(rotation.current, {
        value: Math.PI * 2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Reusable product instance that positions itself on an orbit and reacts to rotation.value
  function ProductInstance({ index }: { index: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();
    const step = (Math.PI * 2) / products.length;
    const base = index * step;

    const cutout = products[index]?.cutout || "/images/hero/washer.png";
    const hoverRef = useRef(false);
    const pointerTilt = useRef({ x: 0, y: 0 });

    useFrame((_, delta) => {
      if (!groupRef.current) return;

      const rot = rotation.current.value;
      const angle = base + rot;
      // radius adapts to viewport width, keep models inside circular container
      const radius = Math.max(1.6, Math.min(2.6, viewport.width * 0.9));

      const x = Math.sin(angle) * radius * 0.6;
      const z = Math.cos(angle) * radius * 0.9 - 1.8; // push back enough
      const y = Math.sin(angle * 0.5) * 0.05;

      // smooth position/rotation
      groupRef.current.position.x += (x - groupRef.current.position.x) * Math.min(12 * delta, 1);
      groupRef.current.position.z += (z - groupRef.current.position.z) * Math.min(12 * delta, 1);
      groupRef.current.position.y += (y - groupRef.current.position.y) * Math.min(8 * delta, 1);

      // apply hover tilt offset when interacting
      const tiltY = hoverRef.current ? pointerTilt.current.y : 0;
      const tiltX = hoverRef.current ? pointerTilt.current.x : 0;
      const desiredRy = -angle + tiltY;
      groupRef.current.rotation.y += (desiredRy - groupRef.current.rotation.y) * Math.min(4 * delta, 1);
      groupRef.current.rotation.x += (tiltX - groupRef.current.rotation.x) * Math.min(6 * delta, 1);

      // depth factor: 1 when facing camera, 0 when at back
      const facing = (Math.cos(angle) + 1) / 2;
      let scale = 0.6 + 0.6 * facing; // 0.6 .. 1.2
      if (hoverRef.current) scale *= 1.06; // slight pop on hover
      groupRef.current.scale.x += (scale - groupRef.current.scale.x) * Math.min(8 * delta, 1);
      groupRef.current.scale.y = groupRef.current.scale.x;

      // set opacity on child materials to simulate depth/blur
      groupRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (!Array.isArray(child.material)) {
            child.material.transparent = true;
            const targetOpacity = 0.35 + 0.65 * facing; // 0.35 .. 1
            const hoverBoost = hoverRef.current ? 0.12 : 0;
            child.material.opacity += (targetOpacity + hoverBoost - child.material.opacity) * Math.min(10 * delta, 1);
            child.material.needsUpdate = true;
          }
        }
      });
    });

    // pointer handlers for tilt effect
    const onPointerMove = (e: any) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      // tilt values in radians
      pointerTilt.current.x = THREE.MathUtils.clamp(-ny * 0.18, -0.35, 0.35);
      pointerTilt.current.y = THREE.MathUtils.clamp(nx * 0.28, -0.7, 0.7);
    };

    const onPointerEnter = () => {
      hoverRef.current = true;
    };

    const onPointerLeave = () => {
      hoverRef.current = false;
      pointerTilt.current.x = 0;
      pointerTilt.current.y = 0;
    };

    return (
      <group ref={groupRef} onPointerMove={onPointerMove} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
        <ProductModel groupRef={groupRef} cutout={cutout} />
      </group>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[220vh] overflow-hidden">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,208,255,0.18),transparent_48%)]" />

        <div className="pointer-events-none absolute inset-x-0 top-14 z-10 mx-auto max-w-3xl px-5 text-center">
          <span className="text-[10px] tracking-[0.38em] text-primary uppercase">Scroll system</span>
          <h2 className="mt-4 text-4xl font-semibold md:text-6xl">Move with the product.</h2>
        </div>

        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div ref={containerRef} className="w-[min(86vw,420px)] max-w-[420px] aspect-square rounded-full overflow-hidden bg-transparent shadow-2xl md:w-full md:max-w-none md:aspect-auto md:rounded-none">
            <Canvas className="w-full h-full" camera={{ position: [0, 0.55, 5.8], fov: 38 }} shadows dpr={[1, 1.8]}>
              <color attach="background" args={["#050816"]} />
              <fog attach="fog" args={["#050816", 6, 14]} />
              <ambientLight intensity={0.9} />
              <directionalLight position={[3, 4, 3]} intensity={2.2} castShadow />
              <pointLight position={[-4, 2, 4]} intensity={18} color="#4CA1FF" />

              {/* Render 4 products around an orbit */}
              {products.slice(0, 4).map((p, i) => (
                <ProductInstance key={p.slug} index={i} />
              ))}

              <Environment preset="city" />
            </Canvas>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 mx-auto max-w-2xl px-5 text-center text-sm text-muted-foreground md:text-base">
          A fluid product reveal that rotates with the scroll while the camera glides between reveal states.
        </div>
      </div>
    </section>
  );
}

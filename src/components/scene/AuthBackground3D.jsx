import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function GlowingOrb({ position, color, size = 0.5, speed = 1.0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (document.hidden || !ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.2;
    ref.current.position.x = position[0] + Math.cos(t * 0.8) * 0.15;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function FloatingLeftKnot() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (document.hidden || !ref.current) return;
    ref.current.rotation.x += delta * 0.18;
    ref.current.rotation.y += delta * 0.24;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref} position={[-2.0, 0.1, -1.2]}>
        <torusKnotGeometry args={[0.85, 0.24, 128, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#2563eb"
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.75}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function MouseGroup({ children }) {
  const ref = useRef();
  useFrame((state) => {
    if (document.hidden || !ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.05, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.03, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} color="#6366f1" intensity={1.5} />
      <pointLight position={[-8, 6, 2]} color="#06b6d4" intensity={2.0} />
      <pointLight position={[-8, -6, 2]} color="#a855f7" intensity={1.8} />

      <MouseGroup>
        {/* Full viewport stars */}
        <Stars radius={50} depth={50} count={1200} factor={3} saturation={0.8} fade speed={0.5} />

        {/* 3D shapes on the left side matching Image 1 */}
        <GlowingOrb position={[-2.4, 1.6, -0.6]} color="#06b6d4" size={0.85} speed={0.7} />
        <FloatingLeftKnot />
        <GlowingOrb position={[-2.2, -1.7, -0.6]} color="#8b5cf6" size={0.75} speed={0.8} />
      </MouseGroup>
    </>
  );
}

export default function AuthBackground3D() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const handleVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        background: "radial-gradient(ellipse at center, #0f0c29 0%, #080816 55%, #020208 100%)",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        frameloop={active ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

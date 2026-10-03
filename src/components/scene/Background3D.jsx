import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
  position,
  geometry,
  color,
  wireframe = false,
  glossy = false,
  speed = 0.3,
  floatSpeed = 1.8,
}) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (document.hidden || !ref.current) return;
    ref.current.rotation.x += delta * speed * 0.4;
    ref.current.rotation.y += delta * speed * 0.3;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh ref={ref} position={position}>
        {geometry}
        {glossy ? (
          <meshStandardMaterial
            color={color}
            roughness={0.15}
            metalness={0.85}
            transparent
            opacity={0.35}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            wireframe={wireframe}
            transparent
            opacity={wireframe ? 0.28 : 0.1}
          />
        )}
      </mesh>
    </Float>
  );
}

function MouseParallaxGroup({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (document.hidden || !groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.07,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.04,
      0.03
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[10, 10, 10]} color="#6366f1" intensity={0.7} />
      <pointLight position={[-10, -10, -5]} color="#ec4899" intensity={0.5} />
      <pointLight position={[0, 8, -6]} color="#06b6d4" intensity={0.4} />

      <MouseParallaxGroup>
        {/* Starfield Particles */}
        <Stars
          radius={60}
          depth={50}
          count={900}
          factor={2.5}
          saturation={0.5}
          fade
          speed={0.4}
        />

        {/* Floating Wireframe & Glossy Shapes */}
        <FloatingShape
          position={[-5.5, 2.8, -6]}
          geometry={<icosahedronGeometry args={[1.6, 0]} />}
          color="#6366f1"
          wireframe={true}
          speed={0.25}
          floatSpeed={1.4}
        />

        <FloatingShape
          position={[5.5, -2, -5]}
          geometry={<torusGeometry args={[1.2, 0.35, 16, 32]} />}
          color="#8b5cf6"
          glossy={true}
          speed={0.18}
          floatSpeed={1.2}
        />

        <FloatingShape
          position={[-3.5, -3.8, -6]}
          geometry={<octahedronGeometry args={[1.0, 0]} />}
          color="#06b6d4"
          wireframe={true}
          speed={0.35}
          floatSpeed={2.2}
        />

        <FloatingShape
          position={[4.5, 3.8, -7]}
          geometry={<dodecahedronGeometry args={[0.85, 0]} />}
          color="#ec4899"
          glossy={true}
          speed={0.3}
          floatSpeed={1.9}
        />

        <FloatingShape
          position={[0, -5.2, -8]}
          geometry={<tetrahedronGeometry args={[0.7, 0]} />}
          color="#38bdf8"
          wireframe={true}
          speed={0.45}
          floatSpeed={2.8}
        />

        <FloatingShape
          position={[-6.5, -0.5, -8]}
          geometry={<torusKnotGeometry args={[0.6, 0.2, 64, 8]} />}
          color="#a855f7"
          glossy={true}
          speed={0.2}
          floatSpeed={1.6}
        />
      </MouseParallaxGroup>
    </>
  );
}

export default function Background3D() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const handleVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 45 }}
        frameloop={active ? "always" : "never"}
        style={{
          background:
            "radial-gradient(ellipse at top, #0f1026 0%, #060714 60%, #03030a 100%)",
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

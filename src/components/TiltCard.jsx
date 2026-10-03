import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function TiltCard({
  children,
  className = "",
  style = {},
  onClick,
  maxTilt = 10,
  glow = false,
  glowColor = "#6366f1",
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * maxTilt;
    const rX = -((y - centerY) / centerY) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.2,
    });
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((p) => ({ ...p, opacity: 0 }));
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{
        transformStyle: "preserve-3d",
        boxShadow: glow
          ? `0 0 25px ${glowColor}, 0 0 50px rgba(99, 102, 241, 0.15)`
          : undefined,
        ...style,
      }}
    >
      {children}

      {/* Subtle Glare overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)`,
          opacity: glarePos.opacity,
          transition: "opacity 0.25s ease",
          zIndex: 10,
        }}
      />
    </motion.div>
  );
}

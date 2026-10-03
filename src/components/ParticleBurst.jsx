import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ParticleBurst({ active, x, y, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const count = 36;
    const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#ec4899", "#38bdf8", "#a855f7"];
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 140;
      const size = 4 + Math.random() * 6;
      return {
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size,
        color: colors[i % colors.length],
        duration: 0.7 + Math.random() * 0.4,
      };
    });

    setParticles(newParticles);
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1100);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: x || window.innerWidth / 2,
        top: y || window.innerHeight / 2,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: p.dx,
              y: p.dy,
              opacity: 0,
              scale: 0.1,
            }}
            transition={{ duration: p.duration, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

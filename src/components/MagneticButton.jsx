import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({
  children,
  className = "",
  onClick,
  disabled = false,
  strength = 18,
  style = {},
  ...props
}) {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    if (disabled || !btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = ((e.clientX - (left + width / 2)) / (width / 2)) * strength;
    const y = ((e.clientY - (top + height / 2)) / (height / 2)) * strength;
    setPosition({ x, y });
  }

  function handleMouseLeave() {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <motion.button
      ref={btnRef}
      className={className}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 18, mass: 0.5 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      style={style}
      {...props}
    >
      {children}
    </motion.button>
  );
}

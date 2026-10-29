'use client';

import React, { useRef, createContext, useContext } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ParallaxContext = createContext<{
  mouseX: any;
  mouseY: any;
}>({
  mouseX: null,
  mouseY: null,
});

interface ParallaxHoverContainerProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function ParallaxHoverContainer({
  children,
  className = '',
  intensity = 20,
}: ParallaxHoverContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - left) / width - 0.5;
    const yPct = (e.clientY - top) / height - 0.5;
    mouseX.set(xPct * intensity);
    mouseY.set(yPct * intensity);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <ParallaxContext.Provider value={{ mouseX: smoothX, mouseY: smoothY }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative ${className}`}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth?: number; // 1 = normal, 2 = 2x depth, -1 = reverse
  className?: string;
}

export function ParallaxLayer({
  children,
  depth = 1,
  className = '',
}: ParallaxLayerProps) {
  const { mouseX, mouseY } = useContext(ParallaxContext);
  const x = useTransform(mouseX || useMotionValue(0), (val: number) => val * depth);
  const y = useTransform(mouseY || useMotionValue(0), (val: number) => val * depth);

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

export const ParallaxHover = ParallaxHoverContainer;
export default ParallaxHoverContainer;

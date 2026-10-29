'use client';

import React, { useRef, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  distance?: number;
  radius?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  distance,
  radius = 24,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const activeStrength = distance !== undefined ? distance : strength;

  const springConfig = { stiffness: 250, damping: 18, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const deltaX = (e.clientX - centerX) * activeStrength;
      const deltaY = (e.clientY - centerY) * activeStrength;

      const clampedX = Math.max(-radius, Math.min(radius, deltaX));
      const clampedY = Math.max(-radius, Math.min(radius, deltaY));

      x.set(clampedX);
      y.set(clampedY);
    },
    [radius, activeStrength, x, y]
  );

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

export default MagneticButton;

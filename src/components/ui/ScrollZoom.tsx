'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollZoomProps {
  src: string;
  alt: string;
  className?: string;
  minScale?: number;
  maxScale?: number;
  children?: React.ReactNode;
}

export function ScrollZoom({
  src,
  alt,
  className = '',
  minScale = 0.9,
  maxScale = 1.15,
  children,
}: ScrollZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [minScale, maxScale]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], ['2rem', '1rem', '2rem']);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ scale, borderRadius }}
        className="w-full h-full overflow-hidden will-change-transform"
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
      {children && <div className="absolute inset-0 z-10 flex items-center justify-center">{children}</div>}
    </div>
  );
}

export default ScrollZoom;

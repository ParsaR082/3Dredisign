'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ImageRevealProps {
  src?: string;
  primarySrc?: string;
  secondarySrc?: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  mode?: 'hover-zoom' | 'curtain' | 'circular-mask';
}

export function ImageReveal({
  src,
  primarySrc,
  secondarySrc,
  alt,
  className = '',
  aspectRatio = 'aspect-[16/10]',
  mode = 'hover-zoom',
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeSrc = src || primarySrc || '';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x: xPct, y: yPct });
    if (mode === 'curtain') {
      setSliderPos(xPct);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl ${aspectRatio} group select-none cursor-pointer ${className}`}
      data-cursor="view"
    >
      {/* Primary Image */}
      <motion.img
        src={activeSrc}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: isHovered && mode === 'hover-zoom' ? 1.08 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Secondary Image with Curtain / Before-After Reveal */}
      {secondarySrc && mode === 'curtain' && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-75"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={secondarySrc}
            alt={`${alt} - Alternate`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Circular Mask Reveal on Hover */}
      {secondarySrc && mode === 'circular-mask' && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          animate={{
            clipPath: isHovered
              ? `circle(140px at ${mousePos.x}% ${mousePos.y}%)`
              : `circle(0px at ${mousePos.x}% ${mousePos.y}%)`,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <img
            src={secondarySrc}
            alt={`${alt} - Revealed`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

export default ImageReveal;

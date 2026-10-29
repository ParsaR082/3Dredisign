'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Distance multiplier
}

export function HorizontalScroll({
  children,
  className = '',
  speed = 1,
}: HorizontalScrollProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Calculate track movement
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-65%']);

  return (
    <section ref={targetRef} className={`relative h-[280vh] ${className}`}>
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 sm:gap-8 px-4 sm:px-12 will-change-transform">
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export default HorizontalScroll;

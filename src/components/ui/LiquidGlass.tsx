'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface LiquidGlassProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'deep';
  glowColor?: string;
}

export function LiquidGlass({
  children,
  className = '',
  intensity = 'medium',
  glowColor = 'rgba(16, 185, 129, 0.15)',
  ...props
}: LiquidGlassProps) {
  const blurClasses = {
    subtle: 'backdrop-blur-md bg-white/[0.03] border-white/10',
    medium: 'backdrop-blur-xl bg-dark-card/60 border-white/15 shadow-2xl',
    deep: 'backdrop-blur-2xl bg-dark-base/80 border-emerald-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
  }[intensity];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative rounded-3xl p-6 sm:p-8 border overflow-hidden ${blurClasses} ${className}`}
      {...props}
    >
      {/* Specular Ambient Edge Gradient */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[70px] opacity-60"
        style={{ background: glowColor }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 rounded-full blur-[80px] opacity-40"
        style={{ background: 'rgba(20, 184, 166, 0.12)' }}
      />

      {/* Glass Top Highlight Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default LiquidGlass;

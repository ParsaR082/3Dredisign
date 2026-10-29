'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface KineticTypographyProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  type?: 'words' | 'chars';
  stagger?: number;
  delay?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: { stagger: number; delay: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: i.stagger,
      delayChildren: i.delay,
    },
  }),
};

const itemVariants: Variants = {
  hidden: { y: '120%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function KineticTypography({
  text,
  className = '',
  as: Component = 'h1',
  type = 'words',
  stagger = 0.04,
  delay = 0,
}: KineticTypographyProps) {
  const items = type === 'words' ? text.split(' ') : text.split('');

  return (
    <Component className={`flex flex-wrap items-baseline gap-x-[0.28em] ${className}`}>
      <motion.span
        variants={containerVariants}
        custom={{ stagger, delay }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        className="inline-flex flex-wrap items-baseline gap-x-[0.25em]"
      >
        {items.map((item, index) => (
          <span key={index} className="inline-block overflow-hidden py-[0.1em] leading-tight">
            <motion.span variants={itemVariants} className="inline-block will-change-transform">
              {item === ' ' ? '\u00A0' : item}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

export default KineticTypography;

'use client';

import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps, Transition, Variants } from 'framer-motion';

// Animation transition curves with explicit Transition typing
export const transitionSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

export const transitionSmooth: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

export const transitionFast: Transition = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1],
};

// Motion Variants typed as Variants
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSmooth,
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionSmooth,
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSmooth,
  },
};

// Reusable Motion Wrapper
interface MotionDivProps extends HTMLMotionProps<'div'> {
  variant?: 'fade-up' | 'fade-in' | 'scale-up' | 'stagger-item';
  delay?: number;
}

export function MotionDiv({
  children,
  variant = 'fade-up',
  delay = 0,
  className,
  ...props
}: MotionDivProps) {
  let selectedVariant: Variants = fadeInUpVariants;
  if (variant === 'fade-in') selectedVariant = fadeInVariants;
  if (variant === 'scale-up') selectedVariant = scaleUpVariants;
  if (variant === 'stagger-item') selectedVariant = staggerItemVariants;

  return (
    <motion.div
      variants={selectedVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...transitionSmooth, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  delayChildren?: number;
  staggerChildren?: number;
}

export function StaggerContainer({
  children,
  delayChildren = 0.04,
  staggerChildren = 0.08,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item
export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Interactive Hover Card
interface InteractiveCardProps extends HTMLMotionProps<'div'> {
  hoverY?: number;
}

export function InteractiveCard({
  children,
  hoverY = -6,
  className,
  ...props
}: InteractiveCardProps) {
  return (
    <motion.div
      whileHover={{
        y: hoverY,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.985 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Interactive Button
export function InteractiveButton({
  children,
  className,
  ...props
}: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Accordion with Smooth Height AnimatePresence
interface MotionAccordionProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export function MotionAccordion({
  isOpen,
  children,
  className,
}: MotionAccordionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.25, delay: 0.05 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.15 },
            },
          }}
          className={`overflow-hidden ${className || ''}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Glowing/Pulsing Badge
export function MotionBadge({
  children,
  className,
  ...props
}: HTMLMotionProps<'span'>) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.span>
  );
}

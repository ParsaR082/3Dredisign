'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SvgDrawProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function SvgDraw({
  children,
  className = '',
  duration = 1.8,
  delay = 0.2,
}: SvgDrawProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`inline-block ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        const childProps = child.props as any;
        return React.cloneElement(child, {
          ...childProps,
          children: React.Children.map(childProps.children, (svgChild) => {
            if (
              React.isValidElement(svgChild) &&
              (svgChild.type === 'path' ||
                svgChild.type === 'circle' ||
                svgChild.type === 'rect' ||
                svgChild.type === 'polyline')
            ) {
              const MotionEl = motion(svgChild.type as any);
              return (
                <MotionEl
                  {...(svgChild.props as any)}
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: {
                        pathLength: {
                          duration,
                          delay,
                          ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
                        },
                        opacity: { duration: 0.3, delay },
                      },
                    },
                  }}
                />
              );
            }
            return svgChild;
          }),
        });
      })}
    </motion.div>
  );
}

// Ready-to-use decorative geometric animated icon
export function AnimatedSparkle({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.path
        d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: 'easeInOut' },
          },
        }}
      />
    </motion.svg>
  );
}

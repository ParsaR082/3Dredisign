'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'view' | 'play' | 'drag'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for outer ring
  const ringX = useSpring(cursorX, { stiffness: 400, damping: 28 });
  const ringY = useSpring(cursorY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    // Detect touch device or reduced motion
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touchCheck || prefersReducedMotion || isHomePage) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Inspect target element for cursor type
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr) {
        setCursorType(cursorAttr as any);
        if (cursorAttr === 'view') setCursorText('مشاهده');
        else if (cursorAttr === 'play') setCursorText('پخش');
        else if (cursorAttr === 'drag') setCursorText('بکشید');
        else setCursorText('');
        return;
      }

      const isInteractive = Boolean(
        target.closest('a, button, input, textarea, select, [role="button"]')
      );
      if (isInteractive) {
        setCursorType('pointer');
        setCursorText('');
      } else {
        setCursorType('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isHomePage, isVisible]);

  if (isTouch || isHomePage || !isVisible) {
    return null;
  }

  const isExpanded = cursorType !== 'default';

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Central dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-emerald-400 pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isExpanded ? 0 : 1,
          opacity: isExpanded ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing Outer Ring / Badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-emerald-400/60 bg-emerald-500/10 backdrop-blur-[2px] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[10px] font-bold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          width: cursorText ? 64 : isExpanded ? 44 : 26,
          height: cursorText ? 64 : isExpanded ? 44 : 26,
          borderColor: isExpanded ? 'rgba(52, 211, 153, 0.8)' : 'rgba(52, 211, 153, 0.4)',
          backgroundColor: isExpanded ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.05)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="tracking-tight select-none"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}

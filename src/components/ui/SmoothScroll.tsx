'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  // Do not enable window smooth scroll on the 3D campus to avoid interfering with 3D canvas controls
  const is3DPage = Boolean(
    pathname && (pathname === '/campus-3d' || pathname.startsWith('/campus-3d'))
  );

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || is3DPage) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      prevent: (node: any) => {
        if (!node || typeof node.closest !== 'function') return false;
        const scrollable = node.closest(
          '[data-lenis-prevent], .allow-card-scroll, .overflow-y-auto, .overflow-x-auto, .overflow-auto, [data-scrollable], .leaflet-container'
        );
        if (scrollable) {
          if (
            scrollable.hasAttribute('data-lenis-prevent') ||
            scrollable.classList.contains('leaflet-container') ||
            scrollable.scrollHeight > scrollable.clientHeight ||
            scrollable.scrollWidth > scrollable.clientWidth
          ) {
            return true;
          }
        }
        return false;
      },
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [is3DPage, pathname]);

  return <>{children}</>;
}

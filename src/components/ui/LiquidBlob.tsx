'use client';

import React, { useEffect, useRef } from 'react';

interface LiquidBlobProps {
  className?: string;
  size?: number;
  color?: string;
  secondaryColor?: string;
}

export function LiquidBlob({
  className = '',
  size = 400,
  color = '#3b82f6',
  secondaryColor = '#8b5cf6',
}: LiquidBlobProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let animId: number;
    let step = 0;
    const numPoints = 6;
    const rad = size / 2.6;
    const center = size / 2;

    const render = () => {
      step += 0.02;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        // Harmonic offsets for organic, flowing motion
        const variance =
          Math.sin(step + i * 1.5) * 18 + Math.cos(step * 0.7 + i * 2.1) * 12;
        const currentRad = rad + variance;
        points.push({
          x: center + Math.cos(angle) * currentRad,
          y: center + Math.sin(angle) * currentRad,
        });
      }

      // Build smooth cubic Bezier curve around points
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length; i++) {
        const p0 = points[i];
        const p1 = points[(i + 1) % points.length];
        const midX = (p0.x + p1.x) / 2;
        const midY = (p0.y + p1.y) / 2;
        d += ` Q ${p0.x} ${p0.y}, ${midX} ${midY}`;
      }
      d += ' Z';

      if (pathRef.current) {
        pathRef.current.setAttribute('d', d);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible filter drop-shadow-[0_10px_35px_rgba(59,130,246,0.3)]"
      >
        <defs>
          <linearGradient id="blob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="url(#blob-grad)"
          className="transition-transform duration-700 ease-out"
        />
      </svg>
    </div>
  );
}

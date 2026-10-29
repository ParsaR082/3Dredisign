'use client';

import React, { useRef } from 'react';

interface CursorSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
}

export function CursorSpotlight({
  children,
  className = '',
  size = 350,
  color = 'rgba(16, 185, 129, 0.15)',
  ...props
}: CursorSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--spotlight-x', `${x}px`);
    containerRef.current.style.setProperty('--spotlight-y', `${y}px`);
    containerRef.current.style.setProperty('--spotlight-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--spotlight-opacity', '0');
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group ${className}`}
      style={
        {
          '--spotlight-x': '-500px',
          '--spotlight-y': '-500px',
          '--spotlight-opacity': '0',
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Dynamic Spotlight Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: 'var(--spotlight-opacity)',
          background: `radial-gradient(${size}px circle at var(--spotlight-x) var(--spotlight-y), ${color}, transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default CursorSpotlight;

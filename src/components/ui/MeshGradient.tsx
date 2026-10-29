'use client';

import React, { useEffect, useRef } from 'react';

interface MeshGradientProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
  speed?: number;
}

export function MeshGradient({
  className = '',
  intensity = 'subtle',
  speed = 0.001,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Color palettes tuned to UrumSima aesthetic
    const alphas = {
      subtle: 0.12,
      medium: 0.22,
      vibrant: 0.35,
    }[intensity];

    const blobs = [
      { x: 0.2, y: 0.3, r: 0.4, color: [59, 130, 246] }, // Blue
      { x: 0.8, y: 0.2, r: 0.45, color: [139, 92, 246] }, // Purple
      { x: 0.5, y: 0.7, r: 0.5, color: [6, 182, 212] }, // Cyan
      { x: 0.1, y: 0.8, r: 0.35, color: [236, 72, 153] }, // Pink/Magenta
    ];

    const render = () => {
      time += speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      blobs.forEach((blob, i) => {
        const offsetX = Math.sin(time + i * 1.5) * 0.12 * w;
        const offsetY = Math.cos(time * 0.8 + i * 2) * 0.12 * h;

        const currentX = blob.x * w + offsetX;
        const currentY = blob.y * h + offsetY;
        const radius = blob.r * Math.min(w, h);

        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          radius
        );

        const [r, g, b] = blob.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alphas})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alphas * 0.4})`);
        gradient.addColorStop(1, 'rgba(11, 15, 23, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 blur-3xl ${className}`}
    />
  );
}

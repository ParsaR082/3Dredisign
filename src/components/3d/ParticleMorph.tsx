'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Play, Sparkles } from 'lucide-react';

const NUM_PARTICLES = 1800;

type ShapeType = 'sphere' | 'torus' | 'helix' | 'wave';

// Generate geometric positions
function generateShapePositions(shape: ShapeType, count: number): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    if (shape === 'sphere') {
      const radius = 1.6;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.3 + 0.7; // shell bias
      positions[i3] = radius * r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * r * Math.cos(phi);
    } else if (shape === 'torus') {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const R = 1.4; // Major radius
      const r = 0.45; // Minor radius
      positions[i3] = (R + r * Math.cos(v)) * Math.cos(u);
      positions[i3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      positions[i3 + 2] = r * Math.sin(v);
    } else if (shape === 'helix') {
      const t = (i / count) * Math.PI * 10 - Math.PI * 5;
      const radius = 1.1;
      const strand = i % 2 === 0 ? 1 : -1;
      positions[i3] = Math.cos(t) * radius * strand;
      positions[i3 + 1] = t * 0.3;
      positions[i3 + 2] = Math.sin(t) * radius * strand;
    } else if (shape === 'wave') {
      const row = Math.floor(i / 42);
      const col = i % 42;
      const x = (col - 21) * 0.1;
      const z = (row - 21) * 0.1;
      const y = Math.sin(x * 2) * Math.cos(z * 2) * 0.5;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }
  }

  return positions;
}

function Particles({ currentShape }: { currentShape: ShapeType }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const spherePos = useMemo(() => generateShapePositions('sphere', NUM_PARTICLES), []);
  const torusPos = useMemo(() => generateShapePositions('torus', NUM_PARTICLES), []);
  const helixPos = useMemo(() => generateShapePositions('helix', NUM_PARTICLES), []);
  const wavePos = useMemo(() => generateShapePositions('wave', NUM_PARTICLES), []);

  const targets = useMemo(
    () => ({
      sphere: spherePos,
      torus: torusPos,
      helix: helixPos,
      wave: wavePos,
    }),
    [spherePos, torusPos, helixPos, wavePos]
  );

  // Buffer holding current interpolated positions
  const currentPositions = useMemo(() => new Float32Array(spherePos), [spherePos]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const target = targets[currentShape];

    const lerpFactor = Math.min(delta * 2.5, 0.2);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i3 = i * 3;
      // Interpolate towards active target shape
      currentPositions[i3] += (target[i3] - currentPositions[i3]) * lerpFactor;
      currentPositions[i3 + 1] += (target[i3 + 1] - currentPositions[i3 + 1]) * lerpFactor;
      currentPositions[i3 + 2] += (target[i3 + 2] - currentPositions[i3 + 2]) * lerpFactor;
    }

    // Gentle global rotation & mouse responsiveness
    pointsRef.current.rotation.y += delta * 0.2;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      mouse.y * 0.3,
      0.05
    );
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(
      pointsRef.current.rotation.z,
      mouse.x * 0.3,
      0.05
    );

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#38bdf8"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function ParticleMorph({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [shape, setShape] = useState<ShapeType>('sphere');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[400px] w-full rounded-3xl bg-white/5 animate-pulse" />;
  }

  const shapes: { id: ShapeType; label: string }[] = [
    { id: 'sphere', label: 'کره کوانتومی' },
    { id: 'torus', label: 'حلقه انرژی' },
    { id: 'helix', label: 'مارپیچ دی‌ان‌ای' },
    { id: 'wave', label: 'امواج شبکه' },
  ];

  return (
    <div
      className={`relative flex flex-col items-center justify-between rounded-3xl border border-white/10 bg-dark-surface/60 p-6 backdrop-blur-xl overflow-hidden ${className}`}
    >
      {/* 3D Canvas */}
      <div className="relative h-[320px] sm:h-[380px] w-full">
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.5} />
          <Particles currentShape={shape} />
        </Canvas>
      </div>

      {/* Control Buttons */}
      <div className="relative z-10 mt-4 flex items-center justify-center gap-2 flex-wrap">
        {shapes.map((s) => (
          <button
            key={s.id}
            onClick={() => setShape(s.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all border ${
              shape === s.id
                ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/25 scale-105'
                : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25 hover:bg-white/10'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

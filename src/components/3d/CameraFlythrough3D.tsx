'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FlythroughPath({ scrollProgress }: { scrollProgress: number }) {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Scroll progress maps to camera Z depth [10 to -30]
    const targetZ = THREE.MathUtils.lerp(12, -26, scrollProgress);
    const targetY = Math.sin(scrollProgress * Math.PI * 2) * 1.5;
    const targetX = Math.cos(scrollProgress * Math.PI) * 1.2;

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.08);

    state.camera.lookAt(0, 0, state.camera.position.z - 10);
  });

  // Array of 16 neon gateway arches
  const arches = Array.from({ length: 16 }).map((_, i) => ({
    z: -i * 2.8,
    color: i % 2 === 0 ? '#3b82f6' : '#8b5cf6',
  }));

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, 5]} intensity={1} />

      <group ref={ringsRef}>
        {arches.map((arch, i) => (
          <group key={i} position={[0, 0, arch.z]}>
            {/* Hexagonal Arch */}
            <mesh rotation={[0, 0, Math.PI / 6]}>
              <ringGeometry args={[2.8, 2.95, 6]} />
              <meshBasicMaterial color={arch.color} side={THREE.DoubleSide} />
            </mesh>
            {/* Floating ambient glow lights along path */}
            {i % 3 === 0 && (
              <pointLight position={[0, 0, 0]} intensity={1.5} color={arch.color} distance={6} />
            )}
          </group>
        ))}
      </group>
    </>
  );
}

export function CameraFlythrough3D({
  className = '',
  scrollProgress = 0,
}: {
  className?: string;
  scrollProgress?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[400px] w-full rounded-3xl bg-white/5 animate-pulse" />;
  }

  return (
    <div className={`relative h-[420px] w-full rounded-3xl overflow-hidden border border-white/10 bg-dark-base ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <FlythroughPath scrollProgress={scrollProgress} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-base via-transparent to-dark-base opacity-70" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            گذرگاه فضایی اروم سیما
          </span>
          <h4 className="text-2xl font-black text-white mt-1">
            سفر به ابعاد طراحی پیشرفته
          </h4>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveMesh() {
  const meshRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;

    if (torusRef.current) {
      torusRef.current.rotation.z = -t * 0.25;
      torusRef.current.rotation.x = t * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        {/* Core Emerald Hologram Sphere */}
        <Sphere
          args={[1.6, 64, 64]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color={hovered ? '#10B981' : '#0E946E'}
            attach="material"
            distort={0.4}
            speed={2.5}
            roughness={0.15}
            metalness={0.8}
            wireframe={false}
          />
        </Sphere>

        {/* Orbiting Tech Ring */}
        <Torus ref={torusRef} args={[2.5, 0.04, 32, 100]}>
          <meshStandardMaterial
            color="#14B8A6"
            emissive="#14B8A6"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.9}
          />
        </Torus>

        {/* Outer Golden Accents Ring */}
        <Torus args={[3.1, 0.02, 32, 100]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={1}
          />
        </Torus>
      </Float>

      {/* Floating Stardust Particles */}
      <Sparkles
        count={70}
        scale={6}
        size={2.5}
        speed={0.4}
        opacity={0.7}
        color="#34D399"
      />
    </group>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-brand-600/20 blur-3xl animate-pulse" />
      </div>
    );
  }

  if (reducedMotion) {
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-brand-600/40 via-teal-500/30 to-amber-500/20 blur-2xl border border-brand-500/30 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border border-brand-400/40 flex items-center justify-center text-brand-300 text-sm font-semibold">
            URUMSIMA 3D
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} intensity={1} color="#0E946E" />
        <pointLight position={[5, -5, 5]} intensity={0.8} color="#F59E0B" />
        <InteractiveMesh />
      </Canvas>
    </div>
  );
}

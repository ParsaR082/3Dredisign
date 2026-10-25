'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Float } from '@react-three/drei';
import * as THREE from 'three';

interface TechLeadPlanetProps {
  planetType: string;
  accentColor: string;
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window as any).__FORCE_WEBGL_FALLBACK) return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function PlanetMesh({ planetType, accentColor }: TechLeadPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere ref={planetRef} args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color={accentColor}
          roughness={planetType === 'crystal' ? 0.1 : 0.4}
          metalness={planetType === 'gas_giant' ? 0.3 : 0.8}
          wireframe={planetType === 'wireframe' || planetType === 'quantum'}
        />
      </Sphere>
      {(planetType === 'ringed' || planetType === 'gas_giant') && (
        <Torus ref={ringRef} args={[1.9, 0.08, 16, 64]} rotation={[Math.PI / 3, 0, 0]}>
          <meshBasicMaterial color={accentColor} transparent opacity={0.7} />
        </Torus>
      )}
    </Float>
  );
}

export default function TechLeadPlanet({ planetType, accentColor }: TechLeadPlanetProps) {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setMounted(true);
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (!mounted) {
    return <div className="w-full h-full rounded-2xl bg-white/5 animate-pulse" />;
  }

  if (!webglSupported) {
    return (
      <div className="w-full h-full relative flex items-center justify-center rounded-2xl glass-panel-minimal overflow-hidden border border-white/5">
        <div
          className="w-24 h-24 rounded-full blur-xl opacity-40 animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="w-16 h-16 rounded-full border border-white/20 shadow-lg flex items-center justify-center relative z-10"
          style={{ backgroundColor: accentColor + '33' }}
        >
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color={accentColor} />
        <PlanetMesh planetType={planetType} accentColor={accentColor} />
      </Canvas>
    </div>
  );
}

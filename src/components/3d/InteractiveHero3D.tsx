'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return false;
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

// Scene with mouse-reactive camera and floating crystal
function SceneContent({ accentColor }: { accentColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    // Smooth camera parallax based on mouse
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.x * 0.8,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      mouse.y * 0.6,
      0.05
    );
    state.camera.lookAt(0, 0, 0);

    // Dynamic point light tracking
    if (lightRef.current) {
      lightRef.current.position.x = mouse.x * 3;
      lightRef.current.position.y = mouse.y * 3;
    }

    // Geometry rotation
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.35;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.4;
      ringRef1.current.rotation.x += delta * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y += delta * 0.3;
      ringRef2.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 4]} intensity={1.5} color="#ffffff" />
      <pointLight
        ref={lightRef}
        position={[0, 0, 3]}
        intensity={2.5}
        color={accentColor}
        distance={8}
      />
      <pointLight position={[-4, -3, -2]} intensity={1} color="#3b82f6" />

      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1}>
        {/* Core Icosahedron Crystal */}
        <mesh ref={meshRef} scale={1.2}>
          <icosahedronGeometry args={[1.2, 0]} />
          <MeshDistortMaterial
            color={accentColor}
            speed={2}
            distort={0.25}
            roughness={0.15}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Outer Orbiting Rings */}
        <mesh ref={ringRef1} scale={1.9} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.1, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        <mesh ref={ringRef2} scale={2.3} rotation={[0, Math.PI / 3, 0]}>
          <torusGeometry args={[1.1, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </>
  );
}

export function InteractiveHero3D({
  accentColor = '#3b82f6',
  className = '',
}: {
  accentColor?: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(checkWebGL());
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full min-h-[350px] bg-white/5 rounded-3xl animate-pulse ${className}`} />
    );
  }

  if (!hasWebGL) {
    return (
      <div
        className={`w-full h-full min-h-[350px] relative flex items-center justify-center rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-brand-900/20 to-dark-surface/80 backdrop-blur-xl ${className}`}
      >
        <div
          className="w-40 h-40 rounded-full blur-2xl opacity-60 animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <div className="relative z-10 text-center p-6">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-sm font-semibold text-gray-300">طراحی نسل بعد اروم سیما</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[350px] relative select-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <SceneContent accentColor={accentColor} />
      </Canvas>
    </div>
  );
}

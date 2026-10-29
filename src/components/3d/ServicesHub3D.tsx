'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { Code2, MonitorPlay, TrendingUp, Share2, Tv, Sparkles } from 'lucide-react';

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

interface PillarSatelliteProps {
  index: number;
  total: number;
  title: string;
  enTitle: string;
  color: string;
  icon: React.ReactNode;
  activeHover: number | null;
  onHover: (idx: number | null) => void;
}

// 1. Individual 3D Service Satellite
function ServiceSatellite({
  index,
  total,
  title,
  enTitle,
  color,
  activeHover,
  onHover,
}: PillarSatelliteProps) {
  const meshRef = useRef<THREE.Group>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 2.1;
  const isHovered = activeHover === index;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Slow orbital rotation
    const t = state.clock.getElapsedTime() * 0.25;
    const currentAngle = angle + t;
    meshRef.current.position.x = Math.cos(currentAngle) * radius;
    meshRef.current.position.z = Math.sin(currentAngle) * radius;
    meshRef.current.position.y = Math.sin(t * 1.5 + index) * 0.25;

    // Face the camera
    meshRef.current.rotation.y = -currentAngle + Math.PI / 2;
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={() => onHover(index)}
      onPointerOut={() => onHover(null)}
      scale={isHovered ? 1.15 : 1}
    >
      {/* Satellite Body: Sleek Holographic Tablet Panel */}
      <RoundedBox args={[0.7, 0.5, 0.08]} radius={0.03} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={isHovered ? 0.6 : 0.2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Screen Frame */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[0.62, 0.42]} />
        <meshBasicMaterial color="#0b0f17" />
      </mesh>

      {/* Glowing Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
        <ringGeometry args={[0.25, 0.28, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Interactive HTML Tooltip Label pinned in 3D */}
      <Html
        position={[0, 0.42, 0]}
        center
        distanceFactor={6}
        style={{
          transition: 'all 0.2s',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0.85,
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        <div className="flex flex-col items-center select-none whitespace-nowrap">
          <div
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold border backdrop-blur-md shadow-lg transition-colors"
            style={{
              backgroundColor: 'rgba(11, 15, 23, 0.85)',
              borderColor: color,
              color: '#ffffff',
            }}
          >
            <span>{title}</span>
          </div>
          <span className="text-[8px] font-mono tracking-wider uppercase text-gray-400 mt-0.5">
            {enTitle}
          </span>
        </div>
      </Html>
    </group>
  );
}

// 2. Central Core: The 5-Pillar Synergy Reactor
function CentralCore({ activeHover }: { activeHover: number | null }) {
  const coreRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x = THREE.MathUtils.lerp(
        coreRef.current.rotation.x,
        mouse.y * 0.3,
        0.05
      );
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.5;
      ringRef1.current.rotation.x += delta * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y += delta * 0.3;
      ringRef2.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Central Prism Nucleus */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh scale={0.75}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            emissive="#06b6d4"
            emissiveIntensity={activeHover !== null ? 0.6 : 0.3}
            wireframe={false}
          />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh scale={0.4}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>

        {/* Orbit Ring 1 */}
        <mesh ref={ringRef1} scale={1.3} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1, 0.018, 16, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.7} />
        </mesh>

        {/* Orbit Ring 2 */}
        <mesh ref={ringRef2} scale={1.5} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[1, 0.015, 16, 64]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
}

// 3. Complete Scene Container
function Scene({
  activeHover,
  onHover,
}: {
  activeHover: number | null;
  onHover: (idx: number | null) => void;
}) {
  const { mouse } = useThree();

  useFrame((state) => {
    // Smooth camera tilt towards mouse
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 0.8, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.5 + mouse.y * 0.5, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  const satellites = [
    {
      title: 'طراحی وب و ۳D',
      enTitle: 'WEB & 3D DEV',
      color: '#06b6d4',
      icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      title: 'بیلبورد و محیطی',
      enTitle: 'OUTDOOR MEDIA',
      color: '#f59e0b',
      icon: <Tv className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      title: 'تیزر صنعتی و ویدیو',
      enTitle: 'VIDEO PRODUCTION',
      color: '#8b5cf6',
      icon: <MonitorPlay className="w-3.5 h-3.5 text-violet-400" />,
    },
    {
      title: 'سئو تکنیکال و داده',
      enTitle: 'TECHNICAL SEO',
      color: '#10b981',
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      title: 'تولید محتوا و اینستاگرام',
      enTitle: 'SOCIAL & BRANDING',
      color: '#ec4899',
      icon: <Share2 className="w-3.5 h-3.5 text-pink-400" />,
    },
  ];

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#06b6d4" distance={6} />
      <pointLight position={[-4, -3, -2]} intensity={1} color="#8b5cf6" />

      {/* Central Hub Reactor */}
      <CentralCore activeHover={activeHover} />

      {/* 5 Satellites orbiting around */}
      {satellites.map((s, idx) => (
        <ServiceSatellite
          key={s.title}
          index={idx}
          total={satellites.length}
          title={s.title}
          enTitle={s.enTitle}
          color={s.color}
          icon={s.icon}
          activeHover={activeHover}
          onHover={onHover}
        />
      ))}
    </>
  );
}

export function ServicesHub3D({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeHover, setActiveHover] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(checkWebGL());
  }, []);

  const serviceBadges = [
    { title: 'طراحی وب و ۳D', color: '#06b6d4' },
    { title: 'بیلبورد شهری', color: '#f59e0b' },
    { title: 'تیزر صنعتی', color: '#8b5cf6' },
    { title: 'سئو تکنیکال', color: '#10b981' },
    { title: 'سوشال مدیا', color: '#ec4899' },
  ];

  if (!mounted) {
    return <div className={`w-full h-full min-h-[380px] rounded-3xl bg-white/5 animate-pulse ${className}`} />;
  }

  if (!hasWebGL) {
    return (
      <div className={`w-full h-full min-h-[380px] relative flex flex-col items-center justify-center rounded-3xl p-6 bg-dark-surface/80 border border-white/10 ${className}`}>
        <Sparkles className="w-10 h-10 text-brand-400 mb-3 animate-pulse" />
        <h4 className="text-base font-bold text-white mb-2">هاب جامع ۵ خدمت استراتژیک اروم‌سیما</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {serviceBadges.map((b) => (
            <span
              key={b.title}
              className="text-xs px-3 py-1 rounded-full border bg-white/5"
              style={{ borderColor: b.color, color: b.color }}
            >
              {b.title}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[380px] lg:min-h-[440px] flex flex-col justify-between ${className}`}>
      {/* 3D WebGL Canvas */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 0.6, 4.6], fov: 46 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <Scene activeHover={activeHover} onHover={setActiveHover} />
        </Canvas>
      </div>

      {/* Floating Badges Controller along the bottom */}
      <div className="relative z-10 px-3 pb-3 pt-1 flex items-center justify-center gap-1.5 flex-wrap">
        {serviceBadges.map((b, idx) => (
          <button
            key={b.title}
            onMouseEnter={() => setActiveHover(idx)}
            onMouseLeave={() => setActiveHover(null)}
            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all border ${
              activeHover === idx
                ? 'scale-105 shadow-md bg-white/10'
                : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
            }`}
            style={{
              borderColor: activeHover === idx ? b.color : 'rgba(255,255,255,0.1)',
              color: activeHover === idx ? '#ffffff' : undefined,
            }}
          >
            {b.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ServicesHub3D;

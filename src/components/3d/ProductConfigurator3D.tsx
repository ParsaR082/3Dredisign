'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, Sparkles, Layers, Palette } from 'lucide-react';

interface MaterialOption {
  id: string;
  name: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  wireframe?: boolean;
}

const MATERIALS: MaterialOption[] = [
  { id: 'glossy', name: 'کریستال صیقلی', roughness: 0.1, metalness: 0.9, clearcoat: 1 },
  { id: 'matte', name: 'کربن مات', roughness: 0.7, metalness: 0.2 },
  { id: 'titanium', name: 'تیتانیوم آندایز', roughness: 0.3, metalness: 0.8 },
  { id: 'cyber', name: 'سایبر وایرفریم', roughness: 0.2, metalness: 0.5, wireframe: true },
];

const COLORS = [
  { name: 'آبی نئون', hex: '#3b82f6' },
  { name: 'بنفش سلطنتی', hex: '#8b5cf6' },
  { name: 'فیروزه‌ای زمردی', hex: '#06b6d4' },
  { name: 'طلای کهکشانی', hex: '#f59e0b' },
  { name: 'رز کوارتز', hex: '#ec4899' },
];

function ConfiguredObject({
  color,
  material,
  autoRotate,
}: {
  color: string;
  material: MaterialOption;
  autoRotate: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Prism Device */}
      <RoundedBox args={[1.6, 2.2, 0.4]} radius={0.12} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          roughness={material.roughness}
          metalness={material.metalness}
          clearcoat={material.clearcoat || 0}
          wireframe={material.wireframe || false}
        />
      </RoundedBox>

      {/* Screen Inset Accent */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[1.3, 1.8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Futuristic Floating Pedestal Rings */}
      <group position={[0, -1.4, 0]}>
        <Cylinder args={[1.2, 1.3, 0.1, 32]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[1.22, 1.25, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

export function ProductConfigurator3D({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [selectedMat, setSelectedMat] = useState(MATERIALS[0]);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[480px] w-full rounded-3xl bg-white/5 animate-pulse" />;
  }

  return (
    <div
      className={`relative flex flex-col lg:flex-row items-stretch rounded-3xl border border-white/10 bg-dark-surface/80 p-4 lg:p-6 backdrop-blur-2xl overflow-hidden ${className}`}
    >
      {/* 3D Canvas Area */}
      <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] flex-1 rounded-2xl bg-gradient-to-b from-dark-base/80 to-dark-surface/40 overflow-hidden cursor-grab active:cursor-grabbing border border-white/5">
        <Canvas
          camera={{ position: [0, 0.5, 4.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 6, 5]} intensity={1.5} />
          <directionalLight position={[-5, -2, -3]} intensity={0.5} color={selectedColor} />
          <pointLight position={[0, 2, 2]} intensity={1.2} color={selectedColor} />

          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <ConfiguredObject
              color={selectedColor}
              material={selectedMat}
              autoRotate={autoRotate}
            />
          </Float>

          <OrbitControls
            enablePan={false}
            minDistance={2.5}
            maxDistance={7}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>

        {/* Viewport Overlay Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all border ${
              autoRotate
                ? 'border-brand-500/40 bg-brand-500/20 text-brand-300'
                : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>چرخش هوشمند</span>
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-10 text-[11px] text-gray-500 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
          برای چرخش بکشید • اسکرول برای زوم
        </div>
      </div>

      {/* Configurator Controls Sidebar */}
      <div className="w-full lg:w-80 flex flex-col justify-between p-4 lg:p-6 mt-4 lg:mt-0 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-brand-400 mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold">پیکربندی سه‌بعدی محصول و نماد</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">شخصی‌سازی متریال و هویت بصری</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            ساختار مهندسی سه‌بعدی پروژه را به صورت تعاملی تغییر داده و کیفیت نورپردازی و پرداخت سطح را بیازمایید.
          </p>
        </div>

        {/* Color Palette Selection */}
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300 mb-3">
            <Palette className="h-3.5 w-3.5 text-brand-400" />
            <span>پالت رنگ هویت:</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setSelectedColor(c.hex)}
                title={c.name}
                aria-label={c.name}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                  selectedColor === c.hex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-base scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Material Selection */}
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300 mb-3">
            <Layers className="h-3.5 w-3.5 text-brand-400" />
            <span>جنس سطح و پوشش فیزیکی:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MATERIALS.map((mat) => (
              <button
                key={mat.id}
                onClick={() => setSelectedMat(mat)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all text-right border ${
                  selectedMat.id === mat.id
                    ? 'border-brand-500 bg-brand-500/20 text-white shadow-sm'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {mat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Specifications summary */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-xs text-gray-400">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span>رندرینگ:</span>
            <span className="text-white font-mono">PBR Physical Shader</span>
          </div>
          <div className="flex justify-between py-1">
            <span>فریم‌ریت:</span>
            <span className="text-emerald-400 font-mono">۶۰ FPS Adaptive</span>
          </div>
        </div>
      </div>
    </div>
  );
}

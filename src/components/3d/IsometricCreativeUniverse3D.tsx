'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, ContactShadows, Environment, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Preload the 4 creative models
useGLTF.preload('/3Dmodels/laptop.glb');
useGLTF.preload('/3Dmodels/apple_iphone_18_pro_max_burgundy_2026.glb');
useGLTF.preload('/3Dmodels/canon_at-1_retro_camera.glb');
useGLTF.preload('/3Dmodels/clipboard_with_pen_and_paper_low-poly.glb');

// Helper hook for safe cloned scenes with PBR shadow and colorSpace setup
function useClonedModel(path: string) {
  const gltf = useGLTF(path);
  return useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mat = (child as THREE.Mesh).material;
        if (mat) {
          const matList = Array.isArray(mat) ? mat : [mat];
          matList.forEach((m) => {
            const std = m as THREE.MeshStandardMaterial;
            if (std.map) {
              std.map.colorSpace = THREE.SRGBColorSpace;
            }
            // Enhance subtle metallic reflections without over-glossing
            if (std.roughness !== undefined && std.roughness < 0.15) {
              std.roughness = 0.22;
            }
          });
        }
      }
    });
    return cloned;
  }, [gltf]);
}

// 1. Laptop Component (Web & Software Development)
function LaptopModel({
  isActive,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  isActive: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}) {
  const scene = useClonedModel('/3Dmodels/laptop.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle floating levitation with unique timing
    groupRef.current.position.y = 0.32 + Math.sin(t * 0.9) * 0.035 + (isActive ? 0.08 : 0);
    groupRef.current.rotation.y = -Math.PI / 8 + Math.sin(t * 0.6) * 0.025;
  });

  return (
    <group
      ref={groupRef}
      position={[-0.32, 0.32, -0.60]}
      scale={0.01}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Center>
        <primitive object={scene} />
      </Center>
      {/* Subtle indicator ring when active */}
      {isActive && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.26, 32]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// 2. iPhone 18 Pro Max Component (Mobile & Social Media Marketing)
function PhoneModel({
  isActive,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  isActive: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}) {
  const scene = useClonedModel('/3Dmodels/apple_iphone_18_pro_max_burgundy_2026.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Levitation with subtle phase offset
    groupRef.current.position.y = 0.38 + Math.sin(t * 1.15 + 1.2) * 0.04 + (isActive ? 0.08 : 0);
    groupRef.current.rotation.y = -Math.PI / 3.2 + Math.cos(t * 0.75) * 0.03;
  });

  return (
    <group
      ref={groupRef}
      position={[0.76, 0.38, 0.08]}
      rotation={[1, -Math.PI / 3.2, 0]}
      scale={2.25}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Center>
        <primitive object={scene} />
      </Center>
      {isActive && (
        <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.2, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// 3. Retro Camera Component (Videography & Photography)
function CameraModel({
  isActive,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  isActive: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}) {
  const scene = useClonedModel('/3Dmodels/canon_at-1_retro_camera.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = 0.34 + Math.sin(t * 1.0 + 2.4) * 0.035 + (isActive ? 0.08 : 0);
    groupRef.current.rotation.y = Math.PI / 3.8 + Math.sin(t * 0.65) * 0.03;
  });

  return (
    <group
      ref={groupRef}
      position={[-0.78, 0.34, 0.24]}
      rotation={[0.08, Math.PI / 3.8, -0.04]}
      scale={2.2}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Center>
        <primitive object={scene} />
      </Center>
      {isActive && (
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// 4. Clipboard with Pen & Paper (Strategy, Branding & Copywriting)
function ClipboardModel({
  isActive,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  isActive: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}) {
  const scene = useClonedModel('/3Dmodels/clipboard_with_pen_and_paper_low-poly.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = 0.2 + Math.sin(t * 0.85 + 3.8) * 0.03 + (isActive ? 0.08 : 0);
    groupRef.current.rotation.z = -Math.PI / 14 + Math.sin(t * 0.5) * 0.02;
  });

  return (
    <group
      ref={groupRef}
      position={[0.12, 0.2, 0.62]}
      rotation={[1, 0, -Math.PI / 14]}
      scale={1}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Center>
        <primitive object={scene} />
      </Center>
      {isActive && (
        <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[26, 36]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.25} wireframe />
        </mesh>
      )}
    </group>
  );
}

// Floating Isometric Diorama Pedestal Base
function IsometricPedestal() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group position={[0, -0.02, 0]}>
      {/* Upper floating obsidian plate */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.58, 0.12, 64]} />
        <meshStandardMaterial
          color="#090d16"
          roughness={0.28}
          metalness={0.85}
        />
      </mesh>

      {/* Cyan Glowing Chamfer Bevel Ring */}
      <mesh position={[0, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.44, 1.49, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Tech Grid / Isometric Rings on Pedestal Top */}
      <mesh ref={ringRef} position={[0, 0.063, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.35, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} wireframe side={THREE.DoubleSide} />
      </mesh>

      {/* Lower tiered sub-platform */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.65, 1.7, 0.08, 48]} />
        <meshStandardMaterial
          color="#050811"
          roughness={0.4}
          metalness={0.9}
        />
      </mesh>

      {/* Purple underglow rim */}
      <mesh position={[0, -0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.58, 1.66, 48]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Ambient Floating Creative Sparks / Dust Motes
function AmbientSparks({ count = 35 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3 + 0] = (Math.random() - 0.5) * 3.4;
      coords[i * 3 + 1] = Math.random() * 2.2 + 0.1;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 3.4;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.25;
    pointsRef.current.rotation.y = t * 0.15;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t + i) * 0.002;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#38bdf8"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Isometric Scene Root with Smooth Pointer Parallax Tilt
function IsometricScene({
  activeItem,
  setActiveItem,
}: {
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rootGroupRef.current) return;
    // Interactive mouse parallax tilt: controlled to 3-5 degrees maximum
    const targetRotY = state.pointer.x * 0.14;
    const targetRotX = -state.pointer.y * 0.08;

    rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.y,
      targetRotY,
      0.05
    );
    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      targetRotX,
      0.05
    );
  });

  return (
    <group ref={rootGroupRef}>
      {/* Studio Lighting System */}
      <ambientLight color="#0e1726" intensity={1.1} />

      {/* Main Studio Key Light (soft daylight white) */}
      <directionalLight
        position={[6, 9, 5]}
        intensity={2.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Cyan/Teal Fill & Rim Light */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={1.8}
        color="#06b6d4"
      />

      {/* Purple Accent Backlight for rim reflections */}
      <pointLight
        position={[3, 5, -5]}
        intensity={2.8}
        color="#a855f7"
        distance={12}
      />

      {/* Soft blue under-platform ambient bounce */}
      <pointLight
        position={[0, -0.8, 0]}
        intensity={1.2}
        color="#0ea5e9"
        distance={5}
      />

      {/* Photorealistic PBR Environment Reflections */}
      <Environment preset="city" environmentIntensity={0.55} />

      {/* Floating Isometric Studio Pedestal */}
      <IsometricPedestal />

      {/* Soft Contact Shadows on Ground */}
      <ContactShadows
        position={[0, -0.42, 0]}
        opacity={0.85}
        scale={6.5}
        blur={2.6}
        far={3.8}
        color="#000000"
      />

      {/* 4 Creative Hero Models */}
      <LaptopModel
        isActive={activeItem === 'web'}
        onPointerOver={() => setActiveItem('web')}
        onPointerOut={() => setActiveItem(null)}
        onClick={() => setActiveItem(activeItem === 'web' ? null : 'web')}
      />

      <PhoneModel
        isActive={activeItem === 'mobile'}
        onPointerOver={() => setActiveItem('mobile')}
        onPointerOut={() => setActiveItem(null)}
        onClick={() => setActiveItem(activeItem === 'mobile' ? null : 'mobile')}
      />

      <CameraModel
        isActive={activeItem === 'media'}
        onPointerOver={() => setActiveItem('media')}
        onPointerOut={() => setActiveItem(null)}
        onClick={() => setActiveItem(activeItem === 'media' ? null : 'media')}
      />

      <ClipboardModel
        isActive={activeItem === 'branding'}
        onPointerOver={() => setActiveItem('branding')}
        onPointerOut={() => setActiveItem(null)}
        onClick={() => setActiveItem(activeItem === 'branding' ? null : 'branding')}
      />

      {/* Atmospheric Particles */}
      <AmbientSparks count={40} />
    </group>
  );
}

// Creative Discipline Metadata
const DISCIPLINES: Record<
  string,
  { title: string; subtitle: string; icon: string; color: string }
> = {
  web: {
    title: 'توسعه وب و پلتفرم‌های ابری',
    subtitle: 'طراحی UI/UX، سامانه‌های وب پیشرفته و Next.js',
    icon: '💻',
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/70',
  },
  mobile: {
    title: 'دیجیتال مارکتینگ و سوشال مدیا',
    subtitle: 'کمپین‌های عملکردی، محتوای تعاملی و اپلیکیشن',
    icon: '📱',
    color: 'text-purple-400 border-purple-500/40 bg-purple-950/70',
  },
  media: {
    title: 'تولید محتوا، عکاسی و تیزرهای ویدیویی',
    subtitle: 'عکاسی صنعتی، ویدیوگرافی و مستندسازی پروژه‌ها',
    icon: '📷',
    color: 'text-teal-400 border-teal-500/40 bg-teal-950/70',
  },
  branding: {
    title: 'استراتژی برندینگ و کپی‌رایتینگ',
    subtitle: 'طراحی هویت بصری، تدوین سند برند و پلن محتوایی',
    icon: '📝',
    color: 'text-amber-400 border-amber-500/40 bg-amber-950/70',
  },
};

export function IsometricCreativeUniverse3D({
  className = '',
}: {
  className?: string;
}) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const activeData = activeItem ? DISCIPLINES[activeItem] : null;

  return (
    <div className={`relative w-full h-full min-h-[380px] select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        // Long focal-length perspective camera for authentic isometric composition
        // 30-35 degree downward angle, three-quarter view
        camera={{
          position: [5.6, 4.2, 5.6],
          fov: 27,
          near: 0.1,
          far: 50,
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <IsometricScene
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        </Suspense>
      </Canvas>

      {/* Floating Interactive HUD / Badge */}
      <div className="pointer-events-none absolute bottom-4 inset-x-4 flex justify-between items-end gap-2 z-10">
        {/* Dynamic Active Discipline Card */}
        <div
          className={`transition-all duration-300 transform ${
            activeData
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          {activeData && (
            <div
              className={`px-3.5 py-2 rounded-2xl border backdrop-blur-md shadow-xl flex items-center gap-2.5 ${activeData.color}`}
            >
              <span className="text-xl">{activeData.icon}</span>
              <div>
                <p className="text-xs font-bold text-white font-sans">{activeData.title}</p>
                <p className="text-[10px] text-gray-300 font-sans">{activeData.subtitle}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Discipline Switcher Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
          {(
            [
              { id: 'web', icon: '💻', label: 'وب' },
              { id: 'mobile', icon: '📱', label: 'موبایل' },
              { id: 'media', icon: '📷', label: 'رسانه' },
              { id: 'branding', icon: '📝', label: 'برندینگ' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                activeItem === item.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline font-sans">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scene Status Badge */}
      <div className="pointer-events-none absolute top-3 right-3 z-10 flex items-center gap-2">
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          جهان خلاق اوروم‌سیما | Isometric 3D
        </span>
      </div>
    </div>
  );
}

export default IsometricCreativeUniverse3D;

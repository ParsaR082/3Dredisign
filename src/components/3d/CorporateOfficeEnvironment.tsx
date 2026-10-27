import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF, Html } from '@react-three/drei';

interface OfficeEnvironmentProps {
  scrollProgress: number;
}

/**
 * ── ULTRA-PERFORMANT LOW-POLY OFFICE PLANTER (گلدان مینیمال اداری) ──
 * بهینه شده با ۳ مش سبک بدون سایه‌های سنگین
 */
function LowPolyPlant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Faceted Modern Planter (گلدان شش‌ضلعی مینیمال) */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.56, 6]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.4} flatShading />
      </mesh>
      {/* Dark Soil */}
      <mesh position={[0, 0.54, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 6]} />
        <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
      </mesh>
      {/* Faceted Low-Poly Bush (بوته لوپلی چندضلعی) */}
      <mesh position={[0, 0.85, 0]}>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#10B981" roughness={0.5} flatShading />
      </mesh>
      <mesh position={[0.12, 1.1, 0.08]} scale={0.75}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#059669" roughness={0.5} flatShading />
      </mesh>
    </group>
  );
}

/**
 * ── LOW-POLY FRAMED CORPORATE WALL ART (تابلوهای دیواری مینیمال) ──
 * بدون PointLight سنگین، روشن و سبک
 */
function WallArtFrame({
  position,
  rotation,
  themeColor = '#10B981',
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  themeColor?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Dark Modern Aluminum Frame */}
      <mesh>
        <boxGeometry args={[2.4, 1.6, 0.06]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* White Passe-partout (حاشیه سفید تابلو) */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[2.2, 1.4, 0.02]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.8} />
      </mesh>
      {/* Low-Poly Geometric Artwork Center */}
      <group position={[0, 0, 0.05]}>
        {/* Abstract Triangle */}
        <mesh position={[-0.35, -0.1, 0]}>
          <cylinderGeometry args={[0, 0.45, 0.65, 3]} />
          <meshStandardMaterial color={themeColor} roughness={0.4} flatShading />
        </mesh>
        {/* Abstract Diamond */}
        <mesh position={[0.3, 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.42, 0.42, 0.02]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.4} flatShading />
        </mesh>
        {/* Accent Sphere */}
        <mesh position={[0, 0.28, 0.02]}>
          <icosahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.3} flatShading />
        </mesh>
      </group>
    </group>
  );
}

/**
 * ── LOW-POLY OUTDOOR SKYLINE & MOUNTAIN PANORAMA (منظره بیرون پنجره‌ها) ──
 * کامپوننت سبک بدون سربار رندر
 */
function LowPolyOutdoorBackdrop() {
  const mountains = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; args: [number, number, number] }> = [];
    for (let z = 20; z >= -170; z -= 38) {
      list.push({ pos: [-38, 11, z], args: [18, 24, 4] });
      list.push({ pos: [38, 11, z], args: [18, 24, 4] });
    }
    // Terminal Ridge
    list.push({ pos: [0, 14, -185], args: [32, 28, 5] });
    return list;
  }, []);

  const buildings = useMemo(() => {
    const list: Array<{ pos: [number, number, number]; size: [number, number, number]; color: string }> = [];
    const colors = ['#CBD5E1', '#94A3B8', '#64748B'];
    for (let z = 15; z >= -155; z -= 32) {
      list.push({ pos: [-24, 8, z], size: [6, 16, 6], color: colors[0] });
      list.push({ pos: [24, 8, z], size: [6, 16, 6], color: colors[1] });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Low-Poly Mountain Ridges */}
      {mountains.map((m, idx) => (
        <mesh key={`mnt-${idx}`} position={m.pos}>
          <coneGeometry args={m.args} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#93C5FD' : '#A7F3D0'}
            roughness={0.8}
            flatShading
          />
        </mesh>
      ))}

      {/* Low-Poly Minimalist Distant City Skyscrapers */}
      {buildings.map((b, idx) => (
        <mesh key={`bld-${idx}`} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} roughness={0.6} flatShading />
        </mesh>
      ))}

      {/* Distant Low-Poly Sun */}
      <mesh position={[28, 42, -90]}>
        <icosahedronGeometry args={[6, 1]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
    </group>
  );
}

/**
 * ── CONNECTING ARCHWAY & WAYFINDING ROOM PORTAL (درگاه عبور و پلاک نئونی بالای در) ──
 * بدون PointLight های پرهزینه، با پلاک نوری زیبا و بازشوی عریض ۴.۵ متری در مرکز
 */
function RoomConnectingPortal({
  zPos,
  roomNumber,
  roomTitle,
}: {
  zPos: number;
  roomNumber: string;
  roomTitle: string;
}) {
  return (
    <group position={[0, 0, zPos]}>
      {/* Left Partition Wall (از X=-9 تا X=-2.25) */}
      <mesh position={[-5.625, 3.75, 0]}>
        <boxGeometry args={[6.75, 7.5, 0.3]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* Right Partition Wall (از X=+2.25 تا X=+9) */}
      <mesh position={[5.625, 3.75, 0]}>
        <boxGeometry args={[6.75, 7.5, 0.3]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* Doorway Header / Lintel بالای سر دوربین (از Y=5.2 تا Y=7.5) */}
      <mesh position={[0, 6.35, 0]}>
        <boxGeometry args={[4.5, 2.3, 0.35]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Architectural Anthracite Portal Jambs (چهارچوب آلومینیومی درگاه) */}
      <mesh position={[-2.25, 2.6, 0]}>
        <boxGeometry args={[0.12, 5.2, 0.4]} />
        <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[2.25, 2.6, 0]}>
        <boxGeometry args={[0.12, 5.2, 0.4]} />
        <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[4.62, 0.12, 0.4]} />
        <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Luminous Architectural Guide Strip (نوار نوری سبز راهنمای سقف درگاه) */}
      <mesh position={[0, 5.12, 0]}>
        <boxGeometry args={[4.4, 0.04, 0.35]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>

      {/* Floating Low-Poly Wayfinding Sign (پلاک راهنمای اتاق بالای سر درگاه) */}
      <group position={[0, 5.85, 0.22]}>
        {/* Dark Backing Plaque */}
        <mesh>
          <boxGeometry args={[3.8, 0.75, 0.06]} />
          <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Neon Emerald Trim Border */}
        <mesh position={[0, -0.35, 0.04]}>
          <boxGeometry args={[3.6, 0.04, 0.02]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        {/* Crisp Persian Wayfinding Badge */}
        <Html position={[0, 0, 0.08]} center distanceFactor={16}>
          <div className="px-3.5 py-1 rounded-xl bg-[#030712]/90 text-white border border-emerald-500/40 shadow-2xl backdrop-blur-md text-xs font-bold whitespace-nowrap pointer-events-none select-none flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-300 font-bold">{roomNumber}</span>
            <span className="text-gray-400">•</span>
            <span className="text-[11px] font-black">{roomTitle}</span>
          </div>
        </Html>
      </group>

      {/* Potted Plants Flanking the Entrance Doorway */}
      <LowPolyPlant position={[-2.8, 0, 0.6]} scale={1.1} />
      <LowPolyPlant position={[2.8, 0, 0.6]} scale={1.1} />
    </group>
  );
}

/**
 * ── 1. MAIN AUTOMATIC SLIDING GLASS DOORS AT BUILDING ENTRANCE (در اتوماتیک ورودی) ──
 * فاقد شیدرهای سنگین transmission؛ استفاده از متریال سبک استاندارد با رفلکشن
 */
function EntranceBuildingFacade({ scrollProgress }: { scrollProgress: number }) {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const logoGltf = useGLTF('/3Dmodels/logo3d.glb');

  // Door opening progress: Between t = 0.00 and t = 0.14
  const openProgress = Math.min(1, Math.max(0, scrollProgress / 0.14));

  useFrame(() => {
    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = -1.1 - openProgress * 2.1;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = 1.1 + openProgress * 2.1;
    }
  });

  return (
    <group position={[0, 0, 4]}>
      {/* ── EXTERIOR FACADE & CANOPY ── */}
      {/* Exterior Plaza Ground Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 6]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
      </mesh>

      {/* Entrance Welcome Steps / Low-Poly Ramp */}
      <mesh position={[0, 0.05, 3]}>
        <boxGeometry args={[7, 0.1, 2.5]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.5} />
      </mesh>

      {/* Grand Entrance Canopy (سایه‌بان مدرن ورودی ساختمان) */}
      <mesh position={[0, 6.2, 2.5]}>
        <boxGeometry args={[11, 0.45, 5]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Canopy Underside Modern Linear Downlight */}
      <mesh position={[0, 5.95, 2.5]}>
        <boxGeometry args={[9, 0.05, 0.4]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Exterior Supporting Architectural Columns */}
      <mesh position={[-4.8, 3.0, 4.8]}>
        <cylinderGeometry args={[0.22, 0.22, 6.0, 6]} />
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[4.8, 3.0, 4.8]}>
        <cylinderGeometry args={[0.22, 0.22, 6.0, 6]} />
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Building Header Signage above Door */}
      <mesh position={[0, 6.8, 0.35]}>
        <boxGeometry args={[7.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 6.45, 0.46]}>
        <boxGeometry args={[6.8, 0.04, 0.02]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>

      {/* 3D Floating Brand Logo on Entrance Header */}
      <group position={[0, 7.1, 0.5]}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <primitive object={logoGltf.scene.clone(true)} rotation={[Math.PI / 2, 0, 0]} scale={[0.85, 0.85, 0.85]} />
        </Float>
        <Html position={[0, -0.75, 0.1]} center distanceFactor={14}>
          <div className="px-4 py-1.5 rounded-full bg-[#030712]/90 text-white border border-emerald-500/40 shadow-2xl backdrop-blur-md text-xs font-bold whitespace-nowrap pointer-events-none select-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-black text-xs text-white">دفتر مرکزی اروم‌سیما • آژانس دیجیتال مارکتینگ</span>
          </div>
        </Html>
      </group>

      {/* ── MAIN ENTRANCE WALL WITH OPENING ── */}
      <mesh position={[-5.625, 3.75, 0]}>
        <boxGeometry args={[6.75, 7.5, 0.4]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
      </mesh>
      <mesh position={[5.625, 3.75, 0]}>
        <boxGeometry args={[6.75, 7.5, 0.4]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 6.35, 0]}>
        <boxGeometry args={[4.5, 2.3, 0.4]} />
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── HIGH PERFORMANCE AUTOMATIC SLIDING GLASS DOORS ── */}
      {/* Left Sliding Door */}
      <group ref={leftDoorRef} position={[-1.1, 2.6, 0]}>
        <mesh>
          <boxGeometry args={[2.15, 5.1, 0.05]} />
          <meshStandardMaterial
            color="#BAE6FD"
            transparent
            opacity={0.25}
            roughness={0.08}
            metalness={0.2}
          />
        </mesh>
        {/* Frame */}
        <mesh position={[-1.05, 0, 0]}>
          <boxGeometry args={[0.06, 5.1, 0.08]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[0.06, 5.1, 0.08]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Stainless Steel Handle */}
        <mesh position={[0.85, 0, 0.05]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.95} />
        </mesh>
        {/* Manifest Decal Strip */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.8, 0.1]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Right Sliding Door */}
      <group ref={rightDoorRef} position={[1.1, 2.6, 0]}>
        <mesh>
          <boxGeometry args={[2.15, 5.1, 0.05]} />
          <meshStandardMaterial
            color="#BAE6FD"
            transparent
            opacity={0.25}
            roughness={0.08}
            metalness={0.2}
          />
        </mesh>
        {/* Frame */}
        <mesh position={[-1.05, 0, 0]}>
          <boxGeometry args={[0.06, 5.1, 0.08]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[0.06, 5.1, 0.08]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.85, 0, 0.05]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.95} />
        </mesh>
        {/* Decal Strip */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.8, 0.1]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Welcome Planters outside */}
      <LowPolyPlant position={[-3.6, 0, 1.2]} scale={1.2} />
      <LowPolyPlant position={[3.6, 0, 1.2]} scale={1.2} />
    </group>
  );
}

/**
 * ── 2. HIGH-PERFORMANCE ARCHITECTURAL ROOM ENCLOSURE ──
 * بدون PointLight های تکراری و بدون متریال‌های کند Transmission
 */
function OfficeRoomEnclosure({
  startZ,
  endZ,
  themeColor = '#10B981',
}: {
  startZ: number;
  endZ: number;
  themeColor?: string;
}) {
  const length = Math.abs(startZ - endZ);
  const midZ = (startZ + endZ) / 2;

  // Window bays along the sides (every 10 meters for fewer meshes)
  const windowBays = useMemo(() => {
    const list: number[] = [];
    for (let z = startZ - 5; z >= endZ + 5; z -= 10) {
      list.push(z);
    }
    return list;
  }, [startZ, endZ]);

  // Suspended ceiling linear light bars
  const ceilingLights = useMemo(() => {
    const list: number[] = [];
    for (let z = startZ - 5; z >= endZ + 5; z -= 10) {
      list.push(z);
    }
    return list;
  }, [startZ, endZ]);

  return (
    <group>
      {/* ── INTERIOR MATTE FLOOR (کف‌پوش اداری لوپلی) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, midZ]} receiveShadow>
        <planeGeometry args={[18, length]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Lateral Walkway Boundary Strips on Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.8, 0.005, midZ]}>
        <planeGeometry args={[0.08, length]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.8, 0.005, midZ]}>
        <planeGeometry args={[0.08, length]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.5} />
      </mesh>

      {/* ── ARCHITECTURAL OFFICE CEILING ── */}
      <mesh position={[0, 7.5, midZ]}>
        <boxGeometry args={[18.2, 0.2, length]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* Suspended Modern Linear Architectural Luminaires (سقف‌روشنایی خطی درخشان بدون PointLight) */}
      {ceilingLights.map((z, idx) => (
        <group key={`clight-${idx}`} position={[0, 7.15, z]}>
          <mesh>
            <boxGeometry args={[9, 0.1, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[8.8, 0.02, 0.24]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* ── HIGH PERFORMANCE FLOOR-TO-CEILING CURTAIN WINDOWS ── */}
      {/* Left Wall Window Panes (X = -9) */}
      <mesh position={[-9, 3.75, midZ]}>
        <boxGeometry args={[0.04, 6.8, length]} />
        <meshStandardMaterial
          color="#BAE6FD"
          transparent
          opacity={0.22}
          roughness={0.06}
          metalness={0.15}
        />
      </mesh>
      {/* Right Wall Window Panes (X = +9) */}
      <mesh position={[9, 3.75, midZ]}>
        <boxGeometry args={[0.04, 6.8, length]} />
        <meshStandardMaterial
          color="#BAE6FD"
          transparent
          opacity={0.22}
          roughness={0.06}
          metalness={0.15}
        />
      </mesh>

      {/* Anthracite Structural Window Mullions / Columns */}
      {windowBays.map((z, idx) => (
        <group key={`mullion-${idx}`}>
          <mesh position={[-9, 3.75, z]}>
            <boxGeometry args={[0.3, 7.5, 0.4]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.85} />
          </mesh>
          <mesh position={[9, 3.75, z]}>
            <boxGeometry args={[0.3, 7.5, 0.4]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.85} />
          </mesh>
          {/* Decorative Corner Plant under window bay */}
          <LowPolyPlant position={[-8.4, 0, z]} scale={1.0} />
          <LowPolyPlant position={[8.4, 0, z]} scale={1.0} />
        </group>
      ))}

      {/* Baseboards along Left & Right */}
      <mesh position={[-8.9, 0.1, midZ]}>
        <boxGeometry args={[0.15, 0.2, length]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} />
      </mesh>
      <mesh position={[8.9, 0.1, midZ]}>
        <boxGeometry args={[0.15, 0.2, length]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * ── 3. MASTER CORPORATE OFFICE ENVIRONMENT EXPORT ──
 * سریع، سبک و ۶۰fps بدون هیچ لگ یا افت فریم
 */
export default function CorporateOfficeEnvironment({ scrollProgress }: OfficeEnvironmentProps) {
  return (
    <group>
      {/* ── 0. LOW-POLY OUTDOOR SKYLINE & MOUNTAIN VIEW OUTSIDE WINDOWS ── */}
      <LowPolyOutdoorBackdrop />

      {/* ── 1. MAIN AUTOMATIC ENTRANCE FACADE & SLIDING DOORS (Z = 4) ── */}
      <EntranceBuildingFacade scrollProgress={scrollProgress} />

      {/* ── 2. ROOM 1: SERVICES CONCOURSE (اتاق خدمات تخصصی - Z: 4 to -44) ── */}
      <OfficeRoomEnclosure startZ={4} endZ={-44} themeColor="#0E946E" />
      <WallArtFrame position={[-8.8, 3.5, -15]} rotation={[0, Math.PI / 2, 0]} themeColor="#10B981" />
      <WallArtFrame position={[8.8, 3.5, -28]} rotation={[0, -Math.PI / 2, 0]} themeColor="#06B6D4" />

      {/* ── 3. PORTAL 1-2: ENTRANCE TO PORTFOLIO SHOWROOM (Z = -44) ── */}
      <RoomConnectingPortal
        zPos={-44}
        roomNumber="۰۲"
        roomTitle="استودیوی نمایش پروژه‌ها"
      />

      {/* ── 4. ROOM 2: PORTFOLIO EXHIBITION SHOWROOM (اتاق نمونه‌کارها - Z: -44 to -84) ── */}
      <OfficeRoomEnclosure startZ={-44} endZ={-84} themeColor="#3B82F6" />
      <WallArtFrame position={[-8.8, 3.5, -60]} rotation={[0, Math.PI / 2, 0]} themeColor="#3B82F6" />
      <WallArtFrame position={[8.8, 3.5, -72]} rotation={[0, -Math.PI / 2, 0]} themeColor="#8B5CF6" />

      {/* ── 5. PORTAL 2-3: ENTRANCE TO COLLABORATION HUB (Z = -84) ── */}
      <RoomConnectingPortal
        zPos={-84}
        roomNumber="۰۳"
        roomTitle="مراحل همکاری و توسعه"
      />

      {/* ── 6. ROOM 3: COLLABORATION WORKFLOW HUB (اتاق مراحل اجرای پروژه - Z: -84 to -132) ── */}
      <OfficeRoomEnclosure startZ={-84} endZ={-132} themeColor="#F59E0B" />
      <WallArtFrame position={[-8.8, 3.5, -100]} rotation={[0, Math.PI / 2, 0]} themeColor="#F59E0B" />
      <WallArtFrame position={[8.8, 3.5, -118]} rotation={[0, -Math.PI / 2, 0]} themeColor="#EC4899" />

      {/* ── 7. PORTAL 3-4: ENTRANCE TO EXECUTIVE SUITE (Z = -132) ── */}
      <RoomConnectingPortal
        zPos={-132}
        roomNumber="۰۴"
        roomTitle="سوئیت مدیریت و مشاوره VIP"
      />

      {/* ── 8. ROOM 4: EXECUTIVE CONSULTATION & VIP RECEPTION (اتاق مشاوره و ارتباط - Z: -132 to -160) ── */}
      <OfficeRoomEnclosure startZ={-132} endZ={-160} themeColor="#10B981" />
      <WallArtFrame position={[-8.8, 3.5, -142]} rotation={[0, Math.PI / 2, 0]} themeColor="#10B981" />
      <WallArtFrame position={[8.8, 3.5, -142]} rotation={[0, -Math.PI / 2, 0]} themeColor="#10B981" />

      {/* ── 9. TERMINAL PANORAMIC GLASS WALL BEHIND 3D LOGO (دیوار شیشه‌ای بزرگ انتهای سالن در Z = -160) ── */}
      <mesh position={[0, 3.75, -160]}>
        <boxGeometry args={[18, 7.5, 0.05]} />
        <meshStandardMaterial
          color="#BAE6FD"
          transparent
          opacity={0.25}
          roughness={0.06}
          metalness={0.15}
        />
      </mesh>
      {/* End Wall Frame */}
      <mesh position={[0, 7.4, -160]}>
        <boxGeometry args={[18.2, 0.25, 0.3]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, -160]}>
        <boxGeometry args={[18.2, 0.25, 0.3]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}

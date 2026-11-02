'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import {
  ExternalLink,
  ChevronLeft,
  Sparkles,
  PhoneCall,
  Layers,
  Compass,
} from 'lucide-react';
import {
  PORTFOLIO_TVS_CONFIG,
  COLLABORATION_STATIONS_CONFIG,
  ProjectTVConfig,
} from './stationsConfig';

// Preload all optimized HQ models via local Draco decoder
useGLTF.preload('/3Dmodels/hq/apple_ipad_pro.glb', '/draco/');
useGLTF.preload('/3Dmodels/hq/apple_iphone_18_pro_max_burgundy_2026.glb', '/draco/');
useGLTF.preload('/3Dmodels/hq/billboard_-_lowpoly.glb', '/draco/');
useGLTF.preload('/3Dmodels/hq/canon_at-1_retro_camera.glb', '/draco/');
useGLTF.preload('/3Dmodels/hq/clipboard_with_pen_and_paper_low-poly.glb', '/draco/');
useGLTF.preload('/3Dmodels/hq/curved_monitor.glb', '/draco/');
useGLTF.preload('/3Dmodels/hq/desk_phone.glb', '/draco/');
useGLTF.preload('/3Dmodels/logo3d.glb', '/draco/');

// Safe cloned GLTF hook with Draco support and PBR setup
function useClonedHqGLTF(path: string) {
  const gltf = useGLTF(path, '/draco/');
  return useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material;
        if (mat) {
          const matList = Array.isArray(mat) ? mat : [mat];
          matList.forEach((m) => {
            const stdMat = m as THREE.MeshStandardMaterial;
            if (stdMat.map) {
              stdMat.map.colorSpace = THREE.SRGBColorSpace;
              stdMat.map.anisotropy = 4;
            }
            if (stdMat.roughness !== undefined) {
              stdMat.roughness = Math.min(0.85, stdMat.roughness * 0.88);
            }
          });
        }
      }
    });
    return cloned;
  }, [gltf.scene]);
}

// Smart Proximity HTML Badge for cosmic stations
function CosmicProximityBadge({
  position = [0, 0, 0],
  children,
  minDist = 1.6,
  maxDist = 16.0,
}: {
  position?: [number, number, number];
  children: React.ReactNode;
  minDist?: number;
  maxDist?: number;
}) {
  const { camera } = useThree();
  const [opacity, setOpacity] = useState(1);
  const posVec = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(() => {
    const dist = camera.position.distanceTo(posVec);
    if (dist > maxDist || dist < minDist) {
      if (opacity !== 0) setOpacity(0);
    } else {
      const alpha = THREE.MathUtils.clamp((maxDist - dist) / (maxDist - minDist - 1.5), 0, 1);
      if (Math.abs(opacity - alpha) > 0.05) setOpacity(alpha);
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <Html
      position={position}
      center
      distanceFactor={16}
      zIndexRange={[100, 0]}
      style={{
        opacity,
        transition: 'opacity 0.25s ease',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      <div className="dir-rtl select-none">{children}</div>
    </Html>
  );
}

// Planetary Celestial Orbit Halo around each station
function StationCelestialHalo({
  color = '#5ef0c4',
  radius = 2.0,
}: {
  color?: string;
  radius?: number;
}) {
  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]}>
      {/* Outer energy ring */}
      <mesh>
        <ringGeometry args={[radius, radius + 0.04, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Soft inner glow disc */}
      <mesh>
        <ringGeometry args={[0.01, radius * 0.85, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface CosmicSectorShowcaseProps {
  scrollProgress: number;
  hoveredServiceSlug?: string | null;
  hoveredProjectSlug?: string | null;
  portfolioProjects?: ProjectTVConfig[];
  onSelectService?: (slug: string) => void;
  onSelectProject?: (slug: string) => void;
  onHoverService?: (slug: string | null) => void;
  onHoverProject?: (slug: string | null) => void;
  isDiving?: boolean;
}

export default function CosmicSectorShowcase({
  scrollProgress,
  hoveredServiceSlug,
  hoveredProjectSlug,
  portfolioProjects,
  onSelectService,
  onSelectProject,
  onHoverService,
  onHoverProject,
  isDiving = false,
}: CosmicSectorShowcaseProps) {
  // Load Cloned Draco Models
  const logoScene = useClonedHqGLTF('/3Dmodels/logo3d.glb');
  const monitorScene = useClonedHqGLTF('/3Dmodels/hq/curved_monitor.glb');
  const iphoneScene = useClonedHqGLTF('/3Dmodels/hq/apple_iphone_18_pro_max_burgundy_2026.glb');
  const cameraScene = useClonedHqGLTF('/3Dmodels/hq/canon_at-1_retro_camera.glb');
  const ipadScene = useClonedHqGLTF('/3Dmodels/hq/apple_ipad_pro.glb');
  const billboardScene = useClonedHqGLTF('/3Dmodels/hq/billboard_-_lowpoly.glb');
  const clipboardScene = useClonedHqGLTF('/3Dmodels/hq/clipboard_with_pen_and_paper_low-poly.glb');
  const phoneScene = useClonedHqGLTF('/3Dmodels/hq/desk_phone.glb');

  const tvProjects = portfolioProjects || PORTFOLIO_TVS_CONFIG;

  return (
    <group name="CosmicSectorShowcase">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 0: WELCOME NEXUS & METALLIC LOGO CORE (Z = 0)         */}
      {/* ──────────────────────────────────────────────────────────── */}
      {(isDiving || scrollProgress <= 0.22) && (
        <group position={[0, 2.0, 0]}>
          <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
            <group scale={3.8}>
              <Center>
                <primitive object={logoScene} />
              </Center>
            </group>
          </Float>

          {/* Luminous Energy Halo */}
          <StationCelestialHalo color="#5ef0c4" radius={2.2} />

          <CosmicProximityBadge position={[0, 2.2, 0.8]} minDist={1.5} maxDist={20.0}>
            <div className="bg-[#050C0A]/85 backdrop-blur-xl border border-emerald-500/40 px-6 py-4 rounded-2xl shadow-[0_0_35px_rgba(14,148,110,0.35)] text-center text-white min-w-[280px]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>پردیس معماری دیجیتال اروم‌سیما</span>
              </div>
              <h2 className="text-xl font-black text-white">سفر سینماتیک در منظومه خلاقیت</h2>
              <p className="text-xs text-gray-300 mt-1">با اسکرول، به سمت کهکشان‌های خدمات و پروژه‌ها سفر کنید</p>
            </div>
          </CosmicProximityBadge>
        </group>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 1: SERVICES CELESTIAL STATIONS (DISTINCT GALAXY ZONES) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {(isDiving || (scrollProgress >= 0.14 && scrollProgress <= 0.50)) && (
        <group name="Sector1_Services">
          {/* 1.1 Web Architecture (Curved OLED Display) -> Upper-Left Sapphire Nebula */}
          <group
            position={[-12.0, 7.0, -40.0]}
            onClick={() => onSelectService?.('corporate-industrial-web-design')}
            onPointerOver={() => onHoverService?.('corporate-industrial-web-design')}
            onPointerOut={() => onHoverService?.(null)}
          >
            <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.3}>
              <group scale={0.115} rotation={[0.08, Math.PI * 0.18, 0]}>
                <Center>
                  <primitive object={monitorScene} />
                </Center>
              </group>
            </Float>
            <StationCelestialHalo color="#38bdf8" radius={1.7} />
            <CosmicProximityBadge position={[0, 1.8, 0]}>
              <div className="bg-[#050C0A]/85 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl shadow-xl min-w-[260px] cursor-pointer hover:border-cyan-300 transition-all">
                <div className="text-xs font-bold text-cyan-400 mb-1">۰۱ • طراحی و معماری وب‌سایت</div>
                <div className="text-sm font-black text-white">توسعه پلتفرم‌های مدرن Next.js و ۳D</div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 text-cyan-300">
                  <span>کلیک جهت مشاهده جزئیات</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>
            </CosmicProximityBadge>
          </group>

          {/* 1.2 Content & Social (Titanium iPhone 18 Pro Max) -> Lower-Right Crimson Sector */}
          <group
            position={[15.0, -5.5, -85.0]}
            onClick={() => onSelectService?.('instagram-content-creation-management')}
            onPointerOver={() => onHoverService?.('instagram-content-creation-management')}
            onPointerOut={() => onHoverService?.(null)}
          >
            <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.35}>
              <group scale={4.2} rotation={[0.15, -Math.PI * 0.22, 0]}>
                <Center>
                  <primitive object={iphoneScene} />
                </Center>
              </group>
            </Float>
            <StationCelestialHalo color="#c084fc" radius={1.6} />
            <CosmicProximityBadge position={[0, 1.8, 0]}>
              <div className="bg-[#050C0A]/85 backdrop-blur-xl border border-purple-500/40 p-4 rounded-2xl shadow-xl min-w-[260px] cursor-pointer hover:border-purple-300 transition-all">
                <div className="text-xs font-bold text-purple-400 mb-1">۰۲ • تولید محتوا و اینستاگرام</div>
                <div className="text-sm font-black text-white">سناریونویسی، ریلز وایرال و هویت بصری</div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 text-purple-300">
                  <span>کلیک جهت مشاهده جزئیات</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>
            </CosmicProximityBadge>
          </group>

          {/* 1.3 Cinema Video & Teaser (Canon Retro Camera) -> Deep-Left Solar Crater */}
          <group
            position={[-16.0, -7.0, -130.0]}
            onClick={() => onSelectService?.('industrial-commercial-video-production')}
            onPointerOver={() => onHoverService?.('industrial-commercial-video-production')}
            onPointerOut={() => onHoverService?.(null)}
          >
            <Float speed={2.0} rotationIntensity={0.25} floatIntensity={0.3}>
              <group scale={4.5} rotation={[0.08, Math.PI * 0.2, 0]}>
                <Center>
                  <primitive object={cameraScene} />
                </Center>
              </group>
            </Float>
            <StationCelestialHalo color="#fbbf24" radius={1.6} />
            <CosmicProximityBadge position={[0, 1.8, 0]}>
              <div className="bg-[#050C0A]/85 backdrop-blur-xl border border-amber-500/40 p-4 rounded-2xl shadow-xl min-w-[260px] cursor-pointer hover:border-amber-300 transition-all">
                <div className="text-xs font-bold text-amber-400 mb-1">۰۳ • تیزر تبلیغاتی و فیلمبرداری</div>
                <div className="text-sm font-black text-white">تصویربرداری هوایی، صنعتی و تدوین سینمایی</div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 text-amber-300">
                  <span>کلیک جهت مشاهده جزئیات</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>
            </CosmicProximityBadge>
          </group>

          {/* 1.4 Branding & Identity (iPad Pro & Stylus) -> Zenith Starfield */}
          <group
            position={[14.0, 11.0, -175.0]}
            onClick={() => onSelectService?.('logo-corporate-identity-design')}
            onPointerOver={() => onHoverService?.('logo-corporate-identity-design')}
            onPointerOut={() => onHoverService?.(null)}
          >
            <Float speed={2.1} rotationIntensity={0.2} floatIntensity={0.35}>
              <group scale={0.95} rotation={[0.3, -Math.PI * 0.15, -0.15]}>
                <Center>
                  <primitive object={ipadScene} />
                </Center>
              </group>
            </Float>
            <StationCelestialHalo color="#34d399" radius={1.7} />
            <CosmicProximityBadge position={[0, 1.8, 0]}>
              <div className="bg-[#050C0A]/85 backdrop-blur-xl border border-emerald-500/40 p-4 rounded-2xl shadow-xl min-w-[260px] cursor-pointer hover:border-emerald-300 transition-all">
                <div className="text-xs font-bold text-emerald-400 mb-1">۰۴ • طراحی لوگو و برندینگ</div>
                <div className="text-sm font-black text-white">هویت بصری یکپارچه، لوگوتایپ و برندبوک</div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 text-emerald-300">
                  <span>کلیک جهت مشاهده جزئیات</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>
            </CosmicProximityBadge>
          </group>

          {/* 1.5 Billboard & Media (Urban LED Billboard) -> Deep-Space Floating Monolith */}
          <group
            position={[-8.0, 6.0, -220.0]}
            onClick={() => onSelectService?.('billboard-outdoor-advertising-design')}
            onPointerOver={() => onHoverService?.('billboard-outdoor-advertising-design')}
            onPointerOut={() => onHoverService?.(null)}
          >
            <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.25}>
              <group scale={0.005} rotation={[0, Math.PI * 0.45, 0]}>
                <Center>
                  <primitive object={billboardScene} />
                </Center>
              </group>
            </Float>
            <StationCelestialHalo color="#2dd4bf" radius={1.8} />
            <CosmicProximityBadge position={[0, 2.0, 0]}>
              <div className="bg-[#050C0A]/85 backdrop-blur-xl border border-teal-500/40 p-4 rounded-2xl shadow-xl min-w-[260px] cursor-pointer hover:border-teal-300 transition-all">
                <div className="text-xs font-bold text-teal-400 mb-1">۰۵ • بیلبورد و تبلیغات شهری</div>
                <div className="text-sm font-black text-white">اکران در پرترددترین نقاط ارومیه و تلویزیون شهری</div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 text-teal-300">
                  <span>کلیک جهت مشاهده جزئیات</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>
            </CosmicProximityBadge>
          </group>
        </group>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 2: MASTERWORKS EXHIBITION (4 SCATTERED COSMIC SCREENS) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {(isDiving || (scrollProgress >= 0.44 && scrollProgress <= 0.68)) && (
        <group name="Sector2_Masterworks">
          {tvProjects.slice(0, 4).map((tv, idx) => {
            const rotY = idx % 2 === 0 ? -Math.PI / 6 : Math.PI / 6;

            return (
              <group
                key={tv.slug}
                position={tv.position}
                onClick={() => onSelectProject?.(tv.slug)}
                onPointerOver={() => onHoverProject?.(tv.slug)}
                onPointerOut={() => onHoverProject?.(null)}
              >
                <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
                  <group scale={0.115} rotation={[0, rotY, 0]}>
                    <Center>
                      <primitive object={monitorScene.clone()} />
                    </Center>
                  </group>
                </Float>
                <StationCelestialHalo color="#38bdf8" radius={1.8} />

                {/* Floating Project KPI Card */}
                <CosmicProximityBadge position={[0, 1.8, 0]}>
                  <div className="bg-[#050C0A]/90 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl shadow-xl min-w-[280px] cursor-pointer hover:border-cyan-300 transition-all">
                    <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                      <span>{tv.category}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                        {tv.kpi}
                      </span>
                    </div>
                    <div className="text-sm font-black text-white">{tv.title}</div>
                    <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between">
                      <span className="text-cyan-300 font-medium">مشاهده پرونده کامل</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                  </div>
                </CosmicProximityBadge>
              </group>
            );
          })}
        </group>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 3: COLLABORATION ORBITAL WAYPOINTS (5 COSMIC STEPS)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      {(isDiving || (scrollProgress >= 0.65 && scrollProgress <= 0.94)) && (
        <group name="Sector3_Workflow">
          {COLLABORATION_STATIONS_CONFIG.map((step, idx) => {
            // Galaxy coordinates for the 5 workflow steps
            const stepPositions: [number, number, number][] = [
              [12.0, 9.0, -500.0],
              [-14.0, 5.0, -555.0],
              [10.0, -12.0, -610.0],
              [-12.0, -10.0, -665.0],
              [14.0, 7.0, -720.0],
            ];
            const pos = stepPositions[idx] || [0, 0, -500 - idx * 50];

            return (
              <group key={step.id} position={pos}>
                <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.3}>
                  {idx === 0 ? (
                    <group scale={0.021} rotation={[0.4, 0.2, 0]}>
                      <Center>
                        <primitive object={clipboardScene} />
                      </Center>
                    </group>
                  ) : (
                    /* Holographic Quantum Beacon */
                    <group>
                      <mesh>
                        <octahedronGeometry args={[0.55, 0]} />
                        <meshStandardMaterial
                          color="#10B981"
                          emissive="#064e3b"
                          roughness={0.2}
                          metalness={0.8}
                          wireframe={idx % 2 !== 0}
                        />
                      </mesh>
                      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                        <torusGeometry args={[0.85, 0.025, 16, 48]} />
                        <meshBasicMaterial color="#5ef0c4" transparent opacity={0.6} />
                      </mesh>
                    </group>
                  )}
                </Float>
                <StationCelestialHalo color="#10b981" radius={1.6} />

                <CosmicProximityBadge position={[0, 1.8, 0]}>
                  <div className="bg-[#050C0A]/90 backdrop-blur-xl border border-emerald-500/40 p-4 rounded-2xl shadow-xl min-w-[280px]">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                      <span>{step.stepTag}</span>
                      <span className="text-gray-400 font-normal">{step.duration}</span>
                    </div>
                    <div className="text-sm font-black text-white">{step.title}</div>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">{step.subtitle}</p>
                  </div>
                </CosmicProximityBadge>
              </group>
            );
          })}
        </group>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 4: EXECUTIVE COMMAND NEXUS (CORE OF THE GALAXY)       */}
      {/* ──────────────────────────────────────────────────────────── */}
      {(isDiving || scrollProgress >= 0.88) && (
        <group name="Sector4_Contact" position={[0, 0, -780.0]}>
          {/* Executive Direct Phone (Left Station) */}
          <group position={[-3.2, 2.6, 0]}>
            <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.35}>
              <group scale={0.038} rotation={[0.3, -Math.PI * 0.22, 0]}>
                <Center>
                  <primitive object={phoneScene} />
                </Center>
              </group>
            </Float>
            <StationCelestialHalo color="#5ef0c4" radius={1.6} />
            <CosmicProximityBadge position={[0, 1.9, 0]}>
              <div className="bg-[#050C0A]/95 backdrop-blur-xl border border-emerald-500/50 p-5 rounded-2xl shadow-[0_0_40px_rgba(14,148,110,0.4)] min-w-[280px] text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>پایانه ارتباط مستقیم مدیریت</span>
                </div>
                <div className="text-base font-black text-white">آماده شروع پروژه‌تان هستید؟</div>
                <p className="text-xs text-gray-300 mt-1 mb-3">مشاوره تخصصی و برآورد فنی رایگان با مدیران اروم‌سیما</p>
                <a
                  href="/contact-us/"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-950/60"
                >
                  <span>ورود به فرم مشاوره و عقد قرارداد</span>
                  <ChevronLeft className="w-4 h-4" />
                </a>
              </div>
            </CosmicProximityBadge>
          </group>

          {/* Consultation Terminal Portal (Right Station) */}
          <group position={[3.2, 2.6, 0]}>
            <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
              <mesh>
                <cylinderGeometry args={[0.9, 0.9, 0.08, 32]} />
                <meshStandardMaterial
                  color="#0E946E"
                  metalness={0.9}
                  roughness={0.15}
                  emissive="#064e3b"
                />
              </mesh>
              <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.82, 0.88, 32]} />
                <meshBasicMaterial color="#5ef0c4" />
              </mesh>
            </Float>
            <StationCelestialHalo color="#38bdf8" radius={1.6} />
            <CosmicProximityBadge position={[0, 1.9, 0]}>
              <div className="bg-[#050C0A]/90 backdrop-blur-xl border border-teal-500/40 p-4 rounded-2xl shadow-xl min-w-[260px] text-center">
                <div className="text-xs font-bold text-teal-400 mb-1">دسترسی VIP کارفرمایان</div>
                <div className="text-sm font-black text-white">رزرو آنلاین جلسات استراتژی</div>
                <div className="text-xs text-gray-400 mt-1">مشاوره حضوری در ارومیه یا آنلاین</div>
              </div>
            </CosmicProximityBadge>
          </group>

          {/* Terminal Celestial Brand Landmark Crest */}
          <group position={[0, 4.8, -12.0]}>
            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
              <group scale={4.5}>
                <Center>
                  <primitive object={logoScene.clone()} />
                </Center>
              </group>
            </Float>
            <pointLight color="#10B981" intensity={2.5} distance={15} />
            <StationCelestialHalo color="#5ef0c4" radius={2.8} />
          </group>
        </group>
      )}
    </group>
  );
}

'use client';

import React, { useMemo } from 'react';
import { Float, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import {
  ExternalLink,
  ChevronLeft,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import {
  PORTFOLIO_TVS_CONFIG,
  COLLABORATION_STATIONS_CONFIG,
  ProjectTVConfig,
} from './stationsConfig';
import { STATIONS_3D, STATION_WAYPOINTS } from './InterstellarFlightPath';

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

// Station Proximity & Fade Helper
function getStationProximity(
  scrollProgress: number,
  targetProgress: number,
  margin: number = 0.045
) {
  const dist = Math.abs(scrollProgress - targetProgress);
  if (dist > margin) {
    return { visible: false, opacity: 0, scale: 0.95 };
  }

  // Smooth cosine fade
  const normalized = dist / margin;
  const opacity = Math.max(0, Math.cos(normalized * Math.PI * 0.5));
  const scale = 0.95 + opacity * 0.05;

  return { visible: opacity > 0.01, opacity, scale };
}

// Planetary Energy Orbit Halo around the station stage
function StageHaloRing({ color = '#5ef0c4' }: { color?: string }) {
  return (
    <group rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -0.65, 0]}>
      {/* Outer energy ring */}
      <mesh>
        <ringGeometry args={[1.65, 1.72, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Soft inner glow disc */}
      <mesh>
        <ringGeometry args={[0.01, 1.5, 32]} />
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
  portfolioProjects,
  onSelectService,
  onSelectProject,
  onHoverService,
  onHoverProject,
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

  // Proximity calculations for each station based on STATION_WAYPOINTS
  const s0 = getStationProximity(scrollProgress, STATION_WAYPOINTS[0], 0.045);
  const s1 = getStationProximity(scrollProgress, STATION_WAYPOINTS[1], 0.045);
  const s2 = getStationProximity(scrollProgress, STATION_WAYPOINTS[2], 0.045);
  const s3 = getStationProximity(scrollProgress, STATION_WAYPOINTS[3], 0.045);
  const s4 = getStationProximity(scrollProgress, STATION_WAYPOINTS[4], 0.045);
  const s5 = getStationProximity(scrollProgress, STATION_WAYPOINTS[5], 0.045);

  const p1 = getStationProximity(scrollProgress, STATION_WAYPOINTS[6], 0.045);
  const p2 = getStationProximity(scrollProgress, STATION_WAYPOINTS[7], 0.045);
  const p3 = getStationProximity(scrollProgress, STATION_WAYPOINTS[8], 0.045);
  const p4 = getStationProximity(scrollProgress, STATION_WAYPOINTS[9], 0.045);

  // Workflow steps at station 10
  const w1 = getStationProximity(scrollProgress, STATION_WAYPOINTS[10], 0.045);
  const w2 = getStationProximity(scrollProgress, STATION_WAYPOINTS[10] + 0.015, 0.035);
  const w3 = getStationProximity(scrollProgress, STATION_WAYPOINTS[10] + 0.030, 0.035);
  const w4 = getStationProximity(scrollProgress, STATION_WAYPOINTS[10] + 0.045, 0.035);

  const sContact = getStationProximity(scrollProgress, STATION_WAYPOINTS[11], 0.045);

  return (
    <group name="CosmicSectorShowcase">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* STATION 0: WELCOME NEXUS & METALLIC LOGO (REFINED SCALE)    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={STATIONS_3D[0].stationPosition}>
        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.25}>
          <group scale={1.45} position={[0, 0.1, 0]}>
            <Center>
              <primitive object={logoScene} />
            </Center>
          </group>
        </Float>
        <StageHaloRing color="#5ef0c4" />

        {s0.visible && (
          <Html
            position={[0, -1.3, 0]}
            center
            distanceFactor={14}
            style={{
              opacity: s0.opacity,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: s0.opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-emerald-500/40 px-6 py-4 rounded-2xl shadow-[0_0_35px_rgba(14,148,110,0.35)] text-center text-white min-w-[280px]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>پردیس معماری دیجیتال اروم‌سیما</span>
              </div>
              <h2 className="text-xl font-black text-white">جهان سه‌بعدی خلاقیت و نوآوری</h2>
              <p className="text-xs text-gray-300 mt-1">با اسکرول، با سرعت نور وارد ایستگاه‌های خدمات و پروژه‌ها شوید</p>
            </div>
          </Html>
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STATION 1.1: WEB ARCHITECTURE (CURVED OLED DISPLAY)         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group
        position={STATIONS_3D[1].stationPosition}
        onClick={() => onSelectService?.('corporate-industrial-web-design')}
        onPointerOver={() => onHoverService?.('corporate-industrial-web-design')}
        onPointerOut={() => onHoverService?.(null)}
      >
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.25}>
          <group scale={0.20} position={[0, 0.1, 0]} rotation={[0.08, Math.PI * 0.15, 0]}>
            <Center>
              <primitive object={monitorScene} />
            </Center>
          </group>
        </Float>
        <StageHaloRing color="#38bdf8" />

        {s1.visible && (
          <Html
            position={[0, -1.25, 0]}
            center
            distanceFactor={14}
            style={{
              opacity: s1.opacity,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: s1.opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl shadow-xl min-w-[270px] cursor-pointer hover:border-cyan-300 transition-all text-center">
              <div className="text-xs font-bold text-cyan-400 mb-1">۰۱ • طراحی و معماری وب‌سایت</div>
              <div className="text-sm font-black text-white">توسعه پلتفرم‌های مدرن Next.js و ۳D</div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1 text-cyan-300">
                <span>کلیک جهت مشاهده جزئیات</span>
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STATION 1.2: CONTENT & SOCIAL (TITANIUM IPHONE 18 PRO MAX)  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group
        position={STATIONS_3D[2].stationPosition}
        onClick={() => onSelectService?.('instagram-content-creation-management')}
        onPointerOver={() => onHoverService?.('instagram-content-creation-management')}
        onPointerOut={() => onHoverService?.(null)}
      >
        <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.25}>
          <group scale={8.2} position={[0, 0.1, 0]} rotation={[0.15, -Math.PI * 0.22, 0]}>
            <Center>
              <primitive object={iphoneScene} />
            </Center>
          </group>
        </Float>
        <StageHaloRing color="#c084fc" />

        {s2.visible && (
          <Html
            position={[0, -1.25, 0]}
            center
            distanceFactor={14}
            style={{
              opacity: s2.opacity,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: s2.opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-purple-500/40 p-4 rounded-2xl shadow-xl min-w-[270px] cursor-pointer hover:border-purple-300 transition-all text-center">
              <div className="text-xs font-bold text-purple-400 mb-1">۰۲ • تولید محتوا و اینستاگرام</div>
              <div className="text-sm font-black text-white">سناریونویسی، ریلز وایرال و مدیریت پیج</div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1 text-purple-300">
                <span>کلیک جهت مشاهده جزئیات</span>
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STATION 1.3: CINEMA VIDEO & TEASER (CANON RETRO CAMERA)     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group
        position={STATIONS_3D[3].stationPosition}
        onClick={() => onSelectService?.('industrial-commercial-video-production')}
        onPointerOver={() => onHoverService?.('industrial-commercial-video-production')}
        onPointerOut={() => onHoverService?.(null)}
      >
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.25}>
          <group scale={8.6} position={[0, 0.1, 0]} rotation={[0.08, Math.PI * 0.18, 0]}>
            <Center>
              <primitive object={cameraScene} />
            </Center>
          </group>
        </Float>
        <StageHaloRing color="#fbbf24" />

        {s3.visible && (
          <Html
            position={[0, -1.25, 0]}
            center
            distanceFactor={14}
            style={{
              opacity: s3.opacity,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: s3.opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-amber-500/40 p-4 rounded-2xl shadow-xl min-w-[270px] cursor-pointer hover:border-amber-300 transition-all text-center">
              <div className="text-xs font-bold text-amber-400 mb-1">۰۳ • تیزر تبلیغاتی و فیلمبرداری</div>
              <div className="text-sm font-black text-white">تصویربرداری هوایی، صنعتی و تدوین سینمایی</div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1 text-amber-300">
                <span>کلیک جهت مشاهده جزئیات</span>
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STATION 1.4: BRANDING & IDENTITY (IPAD PRO & STYLUS)        */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group
        position={STATIONS_3D[4].stationPosition}
        onClick={() => onSelectService?.('logo-corporate-identity-design')}
        onPointerOver={() => onHoverService?.('logo-corporate-identity-design')}
        onPointerOut={() => onHoverService?.(null)}
      >
        <Float speed={2.1} rotationIntensity={0.2} floatIntensity={0.25}>
          <group scale={1.75} position={[0, 0.1, 0]} rotation={[0.25, -Math.PI * 0.15, -0.1]}>
            <Center>
              <primitive object={ipadScene} />
            </Center>
          </group>
        </Float>
        <StageHaloRing color="#34d399" />

        {s4.visible && (
          <Html
            position={[0, -1.25, 0]}
            center
            distanceFactor={14}
            style={{
              opacity: s4.opacity,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: s4.opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-emerald-500/40 p-4 rounded-2xl shadow-xl min-w-[270px] cursor-pointer hover:border-emerald-300 transition-all text-center">
              <div className="text-xs font-bold text-emerald-400 mb-1">۰۴ • طراحی لوگو و برندینگ</div>
              <div className="text-sm font-black text-white">هویت بصری یکپارچه، لوگوتایپ و برندبوک</div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1 text-emerald-300">
                <span>کلیک جهت مشاهده جزئیات</span>
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STATION 1.5: BILLBOARD & OUTDOOR (MODERN LED MONOLITH)      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group
        position={STATIONS_3D[5].stationPosition}
        onClick={() => onSelectService?.('billboard-outdoor-advertising-design')}
        onPointerOver={() => onHoverService?.('billboard-outdoor-advertising-design')}
        onPointerOut={() => onHoverService?.(null)}
      >
        <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.2}>
          <group scale={0.0068} position={[0, 0.1, 0]} rotation={[0, Math.PI * 0.45, 0]}>
            <Center>
              <primitive object={billboardScene} />
            </Center>
          </group>
        </Float>
        <StageHaloRing color="#2dd4bf" />

        {s5.visible && (
          <Html
            position={[0, -1.25, 0]}
            center
            distanceFactor={14}
            style={{
              opacity: s5.opacity,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: s5.opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-teal-500/40 p-4 rounded-2xl shadow-xl min-w-[270px] cursor-pointer hover:border-teal-300 transition-all text-center">
              <div className="text-xs font-bold text-teal-400 mb-1">۰۵ • بیلبورد و تبلیغات شهری</div>
              <div className="text-sm font-black text-white">اکران در پرترددترین نقاط ارومیه و تلویزیون شهری</div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1 text-teal-300">
                <span>کلیک جهت مشاهده جزئیات</span>
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 2: MASTERWORKS EXHIBITION (4 STAGE PROJECT MONITORS)  */}
      {/* ──────────────────────────────────────────────────────────── */}
      {[
        { trans: p1, tv: tvProjects[0], stPos: STATIONS_3D[6].stationPosition },
        { trans: p2, tv: tvProjects[1], stPos: STATIONS_3D[7].stationPosition },
        { trans: p3, tv: tvProjects[2], stPos: STATIONS_3D[8].stationPosition },
        { trans: p4, tv: tvProjects[3], stPos: STATIONS_3D[9].stationPosition },
      ].map(({ trans, tv, stPos }, idx) => {
        if (!tv) return null;
        return (
          <group
            key={`proj-${idx}`}
            position={stPos}
            onClick={() => onSelectProject?.(tv.slug)}
            onPointerOver={() => onHoverProject?.(tv.slug)}
            onPointerOut={() => onHoverProject?.(null)}
          >
            <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.2}>
              <group scale={0.20} position={[0, 0.1, 0]} rotation={[0, idx % 2 === 0 ? -Math.PI / 8 : Math.PI / 8, 0]}>
                <Center>
                  <primitive object={monitorScene.clone()} />
                </Center>
              </group>
            </Float>
            <StageHaloRing color="#38bdf8" />

            {trans.visible && (
              <Html
                position={[0, -1.25, 0]}
                center
                distanceFactor={14}
                style={{
                  opacity: trans.opacity,
                  transition: 'opacity 0.25s ease-out',
                  pointerEvents: trans.opacity > 0.4 ? 'auto' : 'none',
                }}
              >
                <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl shadow-xl min-w-[280px] cursor-pointer hover:border-cyan-300 transition-all text-center">
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                    <span>{tv.category}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                      {tv.kpi}
                    </span>
                  </div>
                  <div className="text-sm font-black text-white">{tv.title}</div>
                  <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1.5 text-cyan-300 font-medium">
                    <span>مشاهده پرونده کامل پروژه</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 3: COLLABORATION WORKFLOW (ORBITAL WORKFLOW STAGE)    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={STATIONS_3D[10].stationPosition}>
        {/* Step 1: Discovery */}
        {w1.visible && (
          <group position={[0, 0.1, 0]}>
            <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.25}>
              <group scale={0.038} rotation={[0.4, 0.2, 0]}>
                <Center>
                  <primitive object={clipboardScene} />
                </Center>
              </group>
            </Float>
            <StageHaloRing color="#10b981" />

            <Html
              position={[0, -1.25, 0]}
              center
              distanceFactor={14}
              style={{
                opacity: w1.opacity,
                transition: 'opacity 0.25s ease-out',
                pointerEvents: w1.opacity > 0.4 ? 'auto' : 'none',
              }}
            >
              <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-emerald-500/40 p-4 rounded-2xl shadow-xl min-w-[280px] text-center">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                  <span>{COLLABORATION_STATIONS_CONFIG[0]?.stepTag || 'مرحله اول'}</span>
                  <span className="text-gray-400 font-normal">۲ الی ۴ روز</span>
                </div>
                <div className="text-sm font-black text-white">کشف، تحلیل استراتژی و نیازسنجی</div>
                <p className="text-xs text-gray-300 mt-1">جلسات اختصاصی جهت کشف پتانسیل‌های پنهان بازار و برند شما</p>
              </div>
            </Html>
          </group>
        )}

        {/* Steps 2, 3, 4 */}
        {[
          { trans: w2, cfg: COLLABORATION_STATIONS_CONFIG[1], color: '#38bdf8' },
          { trans: w3, cfg: COLLABORATION_STATIONS_CONFIG[2], color: '#a855f7' },
          { trans: w4, cfg: COLLABORATION_STATIONS_CONFIG[3], color: '#10b981' },
        ].map(({ trans, cfg, color }, idx) => {
          if (!trans.visible || !cfg) return null;
          return (
            <group key={`workflow-${idx}`} position={[0, 0.1, 0]}>
              <Float speed={2.0} rotationIntensity={0.25} floatIntensity={0.25}>
                <group>
                  <mesh>
                    <octahedronGeometry args={[0.7, 0]} />
                    <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} wireframe={idx % 2 !== 0} />
                  </mesh>
                  <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                    <torusGeometry args={[1.05, 0.03, 16, 48]} />
                    <meshBasicMaterial color="#5ef0c4" transparent opacity={0.6} />
                  </mesh>
                </group>
              </Float>
              <StageHaloRing color={color} />

              <Html
                position={[0, -1.25, 0]}
                center
                distanceFactor={14}
                style={{
                  opacity: trans.opacity,
                  transition: 'opacity 0.25s ease-out',
                  pointerEvents: trans.opacity > 0.4 ? 'auto' : 'none',
                }}
              >
                <div className="dir-rtl select-none bg-[#050C0A]/90 backdrop-blur-xl border border-emerald-500/40 p-4 rounded-2xl shadow-xl min-w-[280px] text-center">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                    <span>{cfg.stepTag}</span>
                    <span className="text-gray-400 font-normal">{cfg.duration}</span>
                  </div>
                  <div className="text-sm font-black text-white">{cfg.title}</div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{cfg.subtitle}</p>
                </div>
              </Html>
            </group>
          );
        })}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTOR 4: EXECUTIVE CONTACT (REALISTIC DESK PHONE & PORTAL)  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={STATIONS_3D[11].stationPosition}>
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.25}>
          <group scale={0.075} position={[0, 0.1, 0]} rotation={[0.25, -Math.PI * 0.2, 0]}>
            <Center>
              <primitive object={phoneScene} />
            </Center>
          </group>
        </Float>
        <StageHaloRing color="#5ef0c4" />

        {sContact.visible && (
          <Html
            position={[0, -1.25, 0]}
            center
            distanceFactor={14}
            style={{
              opacity: sContact.opacity,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: sContact.opacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="dir-rtl select-none bg-[#050C0A]/95 backdrop-blur-xl border border-emerald-500/50 p-5 rounded-2xl shadow-[0_0_40px_rgba(14,148,110,0.4)] min-w-[290px] text-center">
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
          </Html>
        )}
      </group>
    </group>
  );
}

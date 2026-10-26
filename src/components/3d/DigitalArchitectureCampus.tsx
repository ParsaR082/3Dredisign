'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import {
  STATIONS_CONFIG,
  PORTFOLIO_TVS_CONFIG,
  ProjectTVConfig,
  COLLABORATION_STATIONS_CONFIG,
  CollaborationStationConfig,
} from './stationsConfig';

// Preload user's GLB models from public/3Dmodels
useGLTF.preload('/3Dmodels/hero3d.glb');
useGLTF.preload('/3Dmodels/logo3d.glb');
useGLTF.preload('/3Dmodels/Table1.glb');
useGLTF.preload('/3Dmodels/table2.glb');
useGLTF.preload('/3Dmodels/table3.glb');
useGLTF.preload('/3Dmodels/table4.glb');
useGLTF.preload('/3Dmodels/Laptop3D.glb');
useGLTF.preload('/3Dmodels/Phone3D.glb');
useGLTF.preload('/3Dmodels/Camera3D.glb');
useGLTF.preload('/3Dmodels/gimbal3D.glb');
useGLTF.preload('/3Dmodels/Pen.glb');
useGLTF.preload('/3Dmodels/clipboard.glb');
useGLTF.preload('/3Dmodels/stack of paper.glb');
useGLTF.preload('/3Dmodels/Billboard.glb');
useGLTF.preload('/3Dmodels/TV1.glb');
useGLTF.preload('/3Dmodels/TV2.glb');
useGLTF.preload('/3Dmodels/TV3.glb');
useGLTF.preload('/3Dmodels/TV4.glb');
useGLTF.preload('/3Dmodels/desk_modern.glb');
useGLTF.preload('/3Dmodels/office_chair.glb');
useGLTF.preload('/3Dmodels/cup_tea.glb');
useGLTF.preload('/3Dmodels/headphones.glb');
useGLTF.preload('/3Dmodels/tablet.glb');
useGLTF.preload('/3Dmodels/desk_lamp.glb');
useGLTF.preload('/3Dmodels/pc_case.glb');
useGLTF.preload('/3Dmodels/keyboard.glb');
useGLTF.preload('/3Dmodels/whiteboard.glb');

// Helper to clone GLTF scenes safely and configure shadows and color spaces
function useClonedGLTF(path: string) {
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
            const stdMat = m as THREE.MeshStandardMaterial;
            if (stdMat.map) {
              stdMat.map.colorSpace = THREE.SRGBColorSpace;
            }
          });
        }
      }
    });
    return cloned;
  }, [gltf.scene]);
}

interface CampusProps {
  scrollProgress: number; // 0 to 1
  activeSector: number;   // 0 to 4
  hoveredServiceSlug?: string | null;
  hoveredProjectSlug?: string | null;
  portfolioProjects?: ProjectTVConfig[];
  onSelectService?: (slug: string) => void;
  onSelectProject?: (slug: string) => void;
  onHoverService?: (slug: string | null) => void;
  onHoverProject?: (slug: string | null) => void;
  onExploreServices?: () => void;
  onExploreProjects?: () => void;
}

// ── CINEMATIC WAYPOINT SPLINE FOR CAMERA CHOREOGRAPHY ──
// Desktop Waypoints (Centered along runway centerline X=0)
const CAMERA_WAYPOINTS = [
  // Sector 0: Grand Nexus Portal (Framing the standing Ground-Hinged Hero Card on the runway floor)
  { pos: new THREE.Vector3(0, 3.6, 11.5), target: new THREE.Vector3(0, 3.2, 0.0) },
  // Sector 1: Services Concourse (traveling straight down centerline between pavilions)
  { pos: new THREE.Vector3(0, 3.4, -16.0), target: new THREE.Vector3(0, 1.8, -32.0) },
  // Sector 2: Masterworks Exhibition Hall (centered along runway)
  { pos: new THREE.Vector3(0, 3.6, -50.0), target: new THREE.Vector3(0, 1.8, -68.0) },
  // Sector 3: Collaboration Office Concourse (corridor walk at eye level)
  { pos: new THREE.Vector3(0, 3.4, -90.0), target: new THREE.Vector3(0, 1.8, -112.0) },
  // Sector 4: Terminal Gateway (framing contact portal and footer)
  { pos: new THREE.Vector3(0, 3.2, -135.0), target: new THREE.Vector3(0, 2.2, -165.0) },
];

// Mobile Waypoints (Centered along runway centerline X=0 with elevated vantage point)
const MOBILE_CAMERA_WAYPOINTS = [
  // Sector 0: Grand Nexus Portal (backed up to frame full card width on narrow screens)
  { pos: new THREE.Vector3(0, 3.8, 16.5), target: new THREE.Vector3(0, 3.2, 0.0) },
  // Sector 1: Services Concourse (straight down centerline X=0, capturing both left and right stations)
  { pos: new THREE.Vector3(0, 3.8, -16.0), target: new THREE.Vector3(0, 1.8, -32.0) },
  // Sector 2: Masterworks Exhibition Hall (centered along runway)
  { pos: new THREE.Vector3(0, 4.0, -50.0), target: new THREE.Vector3(0, 1.8, -68.0) },
  // Sector 3: Collaboration Office Concourse (corridor walk at eye level)
  { pos: new THREE.Vector3(0, 3.8, -90.0), target: new THREE.Vector3(0, 1.8, -112.0) },
  // Sector 4: Terminal Gateway (elevated portal)
  { pos: new THREE.Vector3(0, 3.8, -133.0), target: new THREE.Vector3(0, 2.2, -165.0) },
];

function getSplinePoint(t: number, isMobile: boolean) {
  const waypoints = isMobile ? MOBILE_CAMERA_WAYPOINTS : CAMERA_WAYPOINTS;

  // ── PHYSICAL BILLBOARD FALL SYNCHRONIZATION ──
  // The billboard fall occurs between t = 0.00 and t = 0.16.
  // During this entire fall and recoil sequence, the camera stays locked in place
  // at waypoints[0] (gate view). The user cannot fly past the gate until the billboard
  // has completely fallen and settled onto the runway floor.
  const FALL_THRESHOLD = 0.16;
  if (t <= FALL_THRESHOLD) {
    return waypoints[0];
  }

  // Once the billboard has fallen flat, the camera takes off and traverses the campus
  const flightProgress = Math.min(1, Math.max(0, (t - FALL_THRESHOLD) / (1 - FALL_THRESHOLD)));
  const segment = flightProgress * (waypoints.length - 1);
  const index = Math.floor(segment);
  const fraction = segment - index;

  if (index >= waypoints.length - 1) {
    return waypoints[waypoints.length - 1];
  }

  const pA = waypoints[index];
  const pB = waypoints[index + 1];

  // Silky smooth Hermite / Cosine interpolation
  const smooth = 0.5 - 0.5 * Math.cos(fraction * Math.PI);

  const pos = new THREE.Vector3().lerpVectors(pA.pos, pB.pos, smooth);
  const target = new THREE.Vector3().lerpVectors(pA.target, pB.target, smooth);

  return { pos, target };
}

// ── 1. SMOOTH SCROLL CAMERA CONTROLLER WITH RESPONSIVE NARROW-SCREEN ADAPTATION ──
function SmoothScrollCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera, pointer, size } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 2, 0));
  const aspect = size.width / (size.height || 1);
  const isMobile = aspect < 1.0;

  // Responsive FOV adjustment on narrow portrait viewports
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    // On landscape desktop (aspect >= 1.0), lock to baseline 45 deg
    // On narrow portrait screens, widen vertical FOV so lateral stations remain in view
    const targetFov = aspect < 0.55 ? 64 : aspect < 0.75 ? 58 : aspect < 1.0 ? 50 : 45;
    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, aspect]);

  useFrame((_, delta) => {
    const { pos, target } = getSplinePoint(scrollProgress, isMobile);

    // Subtle pointer parallax (toned down on mobile touch to avoid jitter)
    const parallaxMult = isMobile ? 0.2 : 0.7;
    const parallaxX = pointer.x * parallaxMult;
    const parallaxY = pointer.y * (parallaxMult * 0.6);

    const desiredPos = new THREE.Vector3(
      pos.x + parallaxX,
      pos.y + parallaxY,
      pos.z
    );

    // Damped camera flight
    easing.damp3(camera.position, desiredPos, 0.42, delta);
    easing.damp3(currentTarget.current, target, 0.42, delta);

    camera.lookAt(currentTarget.current);
  });

  return null;
}

// ── 2. ARCHITECTURAL REFLECTIVE SLAB & ILLUMINATED CONDUITS ──
function ArchitecturalFloor() {
  const runwayConduits = useMemo(() => {
    const list = [];
    for (let z = 20; z >= -180; z -= 14) {
      list.push(z);
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.05, 0]}>
      {/* Deep Obsidian Ground Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 260]} />
        <meshStandardMaterial
          color="#070B12"
          roughness={0.18}
          metalness={0.88}
        />
      </mesh>

      {/* Central Emerald Spine Axis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -80]}>
        <planeGeometry args={[0.35, 230]} />
        <meshBasicMaterial color="#0E946E" transparent opacity={0.7} />
      </mesh>

      {/* Lateral Cyan Conduit Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.8, 0.01, -80]}>
        <planeGeometry args={[0.08, 230]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.8, 0.01, -80]}>
        <planeGeometry args={[0.08, 230]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.35} />
      </mesh>

      {/* Rhythmic Transverse Light Ribs */}
      {runwayConduits.map((z, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, z]}>
          <planeGeometry args={[16, 0.06]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ── 3. ZONE 0: GROUND-HINGED 3D HERO CARD & NEXUS GATEWAY (HERO) ──
function NexusGateway({
  scrollProgress,
  onExploreServices,
  onExploreProjects,
}: {
  scrollProgress: number;
  onExploreServices?: () => void;
  onExploreProjects?: () => void;
}) {
  const cardHingeRef = useRef<THREE.Group>(null);
  const leftObeliskRef = useRef<THREE.Mesh>(null);
  const rightObeliskRef = useRef<THREE.Mesh>(null);
  const monolithRef = useRef<THREE.Group>(null);
  const impactLightRef = useRef<THREE.PointLight>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);

  // ── Load User's 3D Hero and Logo models from /public/3Dmodels ──
  const heroGltf = useGLTF('/3Dmodels/hero3d.glb');
  const logoGltf = useGLTF('/3Dmodels/logo3d.glb');

  // Clone and configure 3D Hero model with double-sided rendering and crisp texture filtering
  const heroScene = useMemo(() => {
    const cloned = heroGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.side = THREE.DoubleSide;
          mat.roughness = 0.22;
          mat.metalness = 0.12;
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.anisotropy = 8;
            mat.map.needsUpdate = true;
          }
        }
      }
    });
    return cloned;
  }, [heroGltf.scene]);

  // Clone and configure 3D Logo model with luminous emerald and metallic cyber finish
  const logoScene = useMemo(() => {
    const cloned = logoGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#10B981',
          roughness: 0.18,
          metalness: 0.88,
          emissive: '#047857',
          emissiveIntensity: 0.45,
          side: THREE.DoubleSide,
        });
      }
    });
    return cloned;
  }, [logoGltf.scene]);

  // heroT: progress across the first 16% of scroll (0.00 to 0.16)
  const heroT = Math.min(1, Math.max(0, scrollProgress / 0.16));

  useFrame((_, delta) => {
    // ── ROTATION AROUND GROUND HINGE AXIS (y = 0.05, z = 0) ──
    let targetRotX = 0;
    let impactIntensity = 0;

    if (heroT <= 0.03) {
      // Stage 0: Standing upright on runway floor
      targetRotX = 0;
    } else if (heroT < 0.10) {
      // Stage 1: Mechanical Unlatch & Hydraulic Pre-tension Vibration
      const p = (heroT - 0.03) / 0.07;
      targetRotX = -Math.sin(p * Math.PI) * 0.025;
    } else if (heroT < 0.78) {
      // Stage 2: Accelerated Gravitational Free Fall
      // Card rotates backward down onto the runway (-Z), its bottom edge NEVER leaving the floor!
      const p = (heroT - 0.10) / 0.68;
      const fallCurve = Math.pow(p, 2.2);
      targetRotX = -fallCurve * (Math.PI / 2);
    } else if (heroT < 0.96) {
      // Stage 3: Seismic Touchdown Slam & Damped Harmonic Recoil
      const p = (heroT - 0.78) / 0.18;
      const bounce = -Math.sin(p * Math.PI * 3.4) * Math.exp(-p * 4.6) * 0.09;
      targetRotX = -(Math.PI / 2) + bounce;
      impactIntensity = Math.max(0, (1 - p * 1.6) * 7.0);
    } else {
      // Stage 4: Settled Monumental Plinth Resting Flat on Runway Floor
      targetRotX = -Math.PI / 2;
      impactIntensity = 0;
    }

    if (cardHingeRef.current) {
      easing.damp(cardHingeRef.current.rotation, 'x', targetRotX, 0.12, delta);
    }

    if (impactLightRef.current) {
      impactLightRef.current.intensity = impactIntensity;
    }

    // Expanding Ground Shockwave Ring on Touchdown
    if (shockwaveRef.current) {
      if (heroT >= 0.75) {
        const p = (heroT - 0.75) / 0.25;
        shockwaveRef.current.scale.set(0.2 + p * 16, 0.2 + p * 16, 1);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
          0,
          (1 - p * 1.5) * 0.9
        );
      } else {
        shockwaveRef.current.scale.set(0.1, 0.1, 1);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }

    // Portal obelisks expand laterally once the card begins to fall (heroT > 0.40)
    const expansionProgress = Math.max(0, (heroT - 0.40) / 0.60);
    if (leftObeliskRef.current) {
      const targetX = -6.8 - expansionProgress * 1.5;
      easing.damp(leftObeliskRef.current.position, 'x', targetX, 0.25, delta);
    }
    if (rightObeliskRef.current) {
      const targetX = 6.8 + expansionProgress * 1.5;
      easing.damp(rightObeliskRef.current.position, 'x', targetX, 0.25, delta);
    }

    // Central brand landmark spin accelerates as gateway activates
    if (monolithRef.current) {
      monolithRef.current.rotation.y += delta * (0.25 + heroT * 0.8);
      monolithRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.08;
    }
  });

  const CARD_WIDTH = 12.0;
  const CARD_HEIGHT = 6.4;

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. TITANIUM GROUND HINGE KNUCKLES BOLTED TO RUNWAY FLOOR (y = 0.05, z = 0) ── */}
      {/* Mechanically prove that the card's bottom edge NEVER detaches from the ground */}
      <group position={[0, 0.05, 0]}>
        {[-5.2, -2.6, 0, 2.6, 5.2].map((xPos) => (
          <group key={xPos} position={[xPos, 0, 0]}>
            {/* Mounting Base Bolted to Ground Slab */}
            <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.55, 0.06, 0.4]} />
              <meshStandardMaterial color="#0B121E" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Horizontal Hinge Axle Cylinder */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
              <meshStandardMaterial color="#475569" roughness={0.2} metalness={0.95} />
            </mesh>
            {/* Emerald Status Glow Collar */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.076, 0.076, 0.08, 16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 2. THE GROUND-HINGED 3D HERO CARD (ROTATES AROUND y = 0.05, z = 0) ── */}
      <group
        ref={cardHingeRef}
        position={[0, 0.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (heroT < 0.15 && onExploreServices) onExploreServices();
        }}
        onPointerOver={() => {
          if (heroT < 0.15) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Structural Chassis Slab behind 3D Hero */}
        <RoundedBox
          args={[CARD_WIDTH, CARD_HEIGHT, 0.18]}
          position={[0, CARD_HEIGHT / 2, -0.09]}
          radius={0.16}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#080F16"
            roughness={0.22}
            metalness={0.92}
          />
        </RoundedBox>

        {/* Luminous Outer Emerald Conduit Trim */}
        <mesh position={[0, CARD_HEIGHT / 2, 0.01]}>
          <planeGeometry args={[CARD_WIDTH + 0.04, CARD_HEIGHT + 0.04]} />
          <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.35} />
        </mesh>

        {/* ── 3D HERO MODEL FROM public/3Dmodels/hero3d.glb ── */}
        <group position={[0, CARD_HEIGHT / 2, 0.02]}>
          <primitive
            object={heroScene}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1.56255, -1.56255, 1.56255]}
          />
        </group>
      </group>

      {/* ── 4. TOUCHDOWN IMPACT FLASH & EXPANDING RUNWAY SHOCKWAVE ── */}
      <pointLight
        ref={impactLightRef}
        position={[0, 0.4, -3.2]}
        color="#10B981"
        intensity={0}
        distance={28}
      />
      <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, -3.2]}>
        <ringGeometry args={[0.3, 0.9, 32]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* ── 5. TWIN MONUMENTAL GATEWAY OBELISKS (FLANKING THE HERO CARD) ── */}
      {/* Left Monolithic Obelisk */}
      <mesh ref={leftObeliskRef} position={[-6.8, 5, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 10, 1.8]} />
        <meshStandardMaterial color="#0B121E" roughness={0.25} metalness={0.9} />
      </mesh>
      {/* Left Vertical Glowing Light Slot */}
      <mesh position={[-6.15, 5, -0.5]}>
        <boxGeometry args={[0.08, 9.6, 0.1]} />
        <meshBasicMaterial color="#0E946E" />
      </mesh>

      {/* Right Monolithic Obelisk */}
      <mesh ref={rightObeliskRef} position={[6.8, 5, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 10, 1.8]} />
        <meshStandardMaterial color="#0B121E" roughness={0.25} metalness={0.9} />
      </mesh>
      {/* Right Vertical Glowing Light Slot */}
      <mesh position={[6.15, 5, -0.5]}>
        <boxGeometry args={[0.08, 9.6, 0.1]} />
        <meshBasicMaterial color="#0E946E" />
      </mesh>

      {/* ── 3D URUMSIMA BRAND LOGO LANDMARK ── */}
      <group ref={monolithRef} position={[0, 3.4, -4]}>
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.35}>
          {/* ── 3D LOGO MODEL FROM public/3Dmodels/logo3d.glb (Floating cleanly without backing box) ── */}
          <group position={[0, 0, 0]}>
            <Center>
              <primitive
                object={logoScene}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[1.15, 1.15, 1.15]}
              />
            </Center>
          </group>

          {/* Holographic 3D Brand Label beneath Landmark - only visible after hero card has fallen */}
          {heroT > 0.85 && (
            <Html position={[0, -1.9, 0]} center distanceFactor={12}>
              <div className="px-3.5 py-1 rounded-full glass-panel-dock border border-brand-500/30 text-[10px] font-bold text-brand-300 whitespace-nowrap shadow-xl pointer-events-none select-none backdrop-blur-md flex items-center gap-1.5 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>اروم سیما • آژانس دیجیتال مارکتینگ</span>
              </div>
            </Html>
          )}

          {/* Central Point Light for Aura Glow on Logo */}
          <pointLight color="#10B981" intensity={3.0} distance={8} />
        </Float>
      </group>
    </group>
  );
}

// ── 4. ZONE 1: THE 5 SERVICES PAVILIONS (ARCHITECTURAL MOTIFS) ──
interface ServicePavilionProps {
  id: string;
  slug: string;
  title: string;
  position: [number, number, number];
  color: string;
  accent: string;
  iconSymbol: string;
  motifType: 'web' | 'instagram' | 'video' | 'branding' | 'billboard';
  isHoveredByParent?: boolean;
  scrollProgress?: number;
  onSelect?: (slug: string) => void;
  onHover?: (slug: string | null) => void;
}

// ── STATION 1: WEB DESIGN (TABLE 1 + 3D LAPTOP) ──
function WebDesignStation({ isHighlighted, accent }: { isHighlighted: boolean; accent: string }) {
  const table = useClonedGLTF('/3Dmodels/Table1.glb');
  const laptop = useClonedGLTF('/3Dmodels/Laptop3D.glb');
  const cfg = STATIONS_CONFIG.webDesign;

  const tableScale = typeof cfg.table.scale === 'number' ? [cfg.table.scale, cfg.table.scale, cfg.table.scale] as [number, number, number] : cfg.table.scale;
  const laptopScale = typeof cfg.laptop.scale === 'number' ? [cfg.laptop.scale, cfg.laptop.scale, cfg.laptop.scale] as [number, number, number] : cfg.laptop.scale;

  return (
    <group>
      {/* میز ۱ - پایه‌ها دقیقاً مماس روی سطح زمین Y = 0 */}
      <group position={cfg.table.position} rotation={cfg.table.rotation} scale={tableScale}>
        <primitive object={table} position={[0, 0.0631, 0]} />
      </group>

      {/* لپ‌تاپ سه‌بعدی - سطح میز */}
      <group position={cfg.laptop.position} rotation={cfg.laptop.rotation}>
        <group scale={laptopScale}>
          <primitive object={laptop} position={[-1387.68, -44.30, -2142.99]} />
        </group>
      </group>

      {/* حلقه نورانی دور پایه‌های میز */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.3, 32]} />
        <meshBasicMaterial color={isHighlighted ? '#34D399' : accent} transparent opacity={isHighlighted ? 0.85 : 0.4} />
      </mesh>
      <pointLight position={[0, 1.8, 0]} color="#10B981" intensity={isHighlighted ? 2.5 : 1.2} distance={6} />
    </group>
  );
}

// ── STATION 2: CONTENT PRODUCTION (TABLE 2 + FLOATING PHONE) ──
function ContentProductionStation({ isHighlighted, accent }: { isHighlighted: boolean; accent: string }) {
  const table = useClonedGLTF('/3Dmodels/table2.glb');
  const phone = useClonedGLTF('/3Dmodels/Phone3D.glb');
  const cfg = STATIONS_CONFIG.contentProduction;

  const tableScale = typeof cfg.table.scale === 'number' ? [cfg.table.scale, cfg.table.scale, cfg.table.scale] as [number, number, number] : cfg.table.scale;
  const phoneScale = typeof cfg.phone.scale === 'number' ? [cfg.phone.scale, cfg.phone.scale, cfg.phone.scale] as [number, number, number] : cfg.phone.scale;

  return (
    <group>
      {/* میز ۲ - پایه‌ها دقیقاً مماس روی سطح زمین Y = 0 */}
      <group position={cfg.table.position} rotation={cfg.table.rotation} scale={tableScale}>
        <primitive object={table} position={[0, 0.4837, 0]} />
      </group>

      {/* گوشی سه‌بعدی شناور در فضا رو به کاربر */}
      <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.25} position={cfg.phone.position}>
        <group rotation={cfg.phone.rotation} scale={phoneScale}>
          <primitive object={phone} position={[0.005, -0.072, -0.009]} />
        </group>
      </Float>

      {/* حلقه نورانی دور میز */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.15, 32]} />
        <meshBasicMaterial color={isHighlighted ? '#2DD4BF' : accent} transparent opacity={isHighlighted ? 0.85 : 0.4} />
      </mesh>
      <pointLight position={[0, 1.7, 0]} color="#2DD4BF" intensity={isHighlighted ? 2.5 : 1.4} distance={6} />
    </group>
  );
}

// ── STATION 3: VIDEO TEASER (TABLE 3 + CAMERA & GIMBAL) ──
function VideoTeaserStation({ isHighlighted, accent }: { isHighlighted: boolean; accent: string }) {
  const table = useClonedGLTF('/3Dmodels/table3.glb');
  const camera = useClonedGLTF('/3Dmodels/Camera3D.glb');
  const gimbal = useClonedGLTF('/3Dmodels/gimbal3D.glb');
  const cfg = STATIONS_CONFIG.videoTeaser;

  const tableScale = typeof cfg.table.scale === 'number' ? [cfg.table.scale, cfg.table.scale, cfg.table.scale] as [number, number, number] : cfg.table.scale;
  const cameraScale = typeof cfg.camera.scale === 'number' ? [cfg.camera.scale, cfg.camera.scale, cfg.camera.scale] as [number, number, number] : cfg.camera.scale;
  const gimbalScale = typeof cfg.gimbal.scale === 'number' ? [cfg.gimbal.scale, cfg.gimbal.scale, cfg.gimbal.scale] as [number, number, number] : cfg.gimbal.scale;

  return (
    <group>
      {/* میز ۳ - پایه‌ها دقیقاً مماس روی سطح زمین Y = 0 */}
      <group position={cfg.table.position} rotation={cfg.table.rotation} scale={tableScale}>
        <primitive object={table} position={[0, -0.0038, 0]} />
      </group>

      {/* دوربین سینمایی روی میز */}
      <group position={cfg.camera.position} rotation={cfg.camera.rotation}>
        <group scale={cameraScale}>
          <primitive object={camera} position={[0, 0.0055, 0]} />
        </group>
      </group>

      {/* گیمبال فیلم‌برداری روی میز */}
      <group position={cfg.gimbal.position} rotation={cfg.gimbal.rotation}>
        <group scale={gimbalScale}>
          <primitive object={gimbal} position={[1.872, -0.0042, -1.175]} />
        </group>
      </group>

      {/* حلقه نورانی دور میز */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.15, 32]} />
        <meshBasicMaterial color={isHighlighted ? '#FBBF24' : accent} transparent opacity={isHighlighted ? 0.85 : 0.4} />
      </mesh>
      <pointLight position={[0, 1.9, 0]} color="#FBBF24" intensity={isHighlighted ? 2.5 : 1.2} distance={6} />
    </group>
  );
}

// ── STATION 4: LOGO DESIGN (TABLE 4 + CLIPBOARD, PAPER STACK & PEN) ──
function LogoDesignStation({ isHighlighted, accent }: { isHighlighted: boolean; accent: string }) {
  const desk = useClonedGLTF('/3Dmodels/table4.glb');
  const clipboard = useClonedGLTF('/3Dmodels/clipboard.glb');
  const paper = useClonedGLTF('/3Dmodels/stack of paper.glb');
  const pen = useClonedGLTF('/3Dmodels/Pen.glb');
  const cfg = STATIONS_CONFIG.logoDesign;

  const deskScale = typeof cfg.table.scale === 'number' ? [cfg.table.scale, cfg.table.scale, cfg.table.scale] as [number, number, number] : cfg.table.scale;
  const paperScale = typeof cfg.paperStack.scale === 'number' ? [cfg.paperStack.scale, cfg.paperStack.scale, cfg.paperStack.scale] as [number, number, number] : cfg.paperStack.scale;
  const clipboardScale = typeof cfg.clipboard.scale === 'number' ? [cfg.clipboard.scale, cfg.clipboard.scale, cfg.clipboard.scale] as [number, number, number] : cfg.clipboard.scale;
  const penScale = typeof cfg.pen.scale === 'number' ? [cfg.pen.scale, cfg.pen.scale, cfg.pen.scale] as [number, number, number] : cfg.pen.scale;

  return (
    <group>
      {/* میز ۴ - پایه‌ها دقیقاً مماس روی سطح زمین Y = 0 */}
      <group position={cfg.table.position} rotation={cfg.table.rotation} scale={deskScale}>
        <primitive object={desk} position={[0, 0.3766, 0]} />
      </group>

      {/* دسته کاغذ طراحی روی سطح میز */}
      <group position={cfg.paperStack.position} rotation={cfg.paperStack.rotation}>
        <group scale={paperScale}>
          <primitive object={paper} position={[-0.003, 0.015, -0.004]} />
        </group>
      </group>

      {/* تخته شاسی طراحی به حالت تخت روی میز */}
      <group position={cfg.clipboard.position} rotation={cfg.clipboard.rotation}>
        <group scale={clipboardScale}>
          <primitive object={clipboard} position={[0, 0.021, 0]} />
        </group>
      </group>

      {/* قلم استایلوس طراحی روی میز */}
      <group position={cfg.pen.position} rotation={cfg.pen.rotation}>
        <group scale={penScale}>
          <primitive object={pen} position={[0, 0.184, 0.485]} />
        </group>
      </group>

      {/* حلقه نورانی دور میز */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshBasicMaterial color={isHighlighted ? '#A78BFA' : accent} transparent opacity={isHighlighted ? 0.85 : 0.4} />
      </mesh>
      <pointLight position={[0, 1.9, 0]} color="#A78BFA" intensity={isHighlighted ? 2.5 : 1.2} distance={6} />
    </group>
  );
}

// ── STATION 5: BILLBOARD (GROUND HIGHWAY SCREEN - NO TABLE) ──
function BillboardStation({ isHighlighted, accent }: { isHighlighted: boolean; accent: string }) {
  const billboard = useClonedGLTF('/3Dmodels/Billboard.glb');
  const cfg = STATIONS_CONFIG.billboard;

  const billboardScale = typeof cfg.billboard.scale === 'number' ? [cfg.billboard.scale, cfg.billboard.scale, cfg.billboard.scale] as [number, number, number] : cfg.billboard.scale;

  return (
    <group>
      {/* بیلبورد محیطی - پایه‌ها دقیقاً مماس روی سطح زمین Y = 0 */}
      <group position={cfg.billboard.position}>
        <group rotation={cfg.billboard.rotation} scale={billboardScale}>
          <primitive object={billboard} position={[71.03, 15.00, 90.0]} />
        </group>
      </group>

      {/* حلقه نورانی پایه بیلبورد */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.98, 32]} />
        <meshBasicMaterial color={isHighlighted ? '#22D3EE' : accent} transparent opacity={isHighlighted ? 0.85 : 0.4} />
      </mesh>
      {/* نورافکن‌های بیلبورد */}
      <pointLight position={[0, 4.2, 1.6]} color="#22D3EE" intensity={isHighlighted ? 3.5 : 2.0} distance={9} />
      <pointLight position={[0, 1.2, 0.6]} color="#14B8A6" intensity={1.5} distance={6} />
    </group>
  );
}

function ServiceStationRenderer({
  motifType,
  isHighlighted,
  accent,
}: {
  motifType: 'web' | 'instagram' | 'video' | 'branding' | 'billboard';
  isHighlighted: boolean;
  accent: string;
}) {
  if (motifType === 'web') {
    return <WebDesignStation isHighlighted={isHighlighted} accent={accent} />;
  }
  if (motifType === 'instagram') {
    return <ContentProductionStation isHighlighted={isHighlighted} accent={accent} />;
  }
  if (motifType === 'video') {
    return <VideoTeaserStation isHighlighted={isHighlighted} accent={accent} />;
  }
  if (motifType === 'branding') {
    return <LogoDesignStation isHighlighted={isHighlighted} accent={accent} />;
  }
  return <BillboardStation isHighlighted={isHighlighted} accent={accent} />;
}

function ServicePavilion({
  slug,
  title,
  position,
  color,
  accent,
  iconSymbol,
  motifType,
  isHoveredByParent,
  scrollProgress = 0,
  onSelect,
  onHover,
}: ServicePavilionProps) {
  const [localHover, setLocalHover] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const isHighlighted = !!(localHover || isHoveredByParent);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = isHighlighted ? 0.25 : 0;
    easing.damp(meshRef.current.position, 'y', targetY, 0.2, delta);
  });

  const badgeY =
    motifType === 'billboard'
      ? STATIONS_CONFIG.billboard.badgeY
      : STATIONS_CONFIG.webDesign.badgeY;

  return (
    <group
      position={position}
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setLocalHover(true);
        if (onHover) onHover(slug);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setLocalHover(false);
        if (onHover) onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(slug);
      }}
    >
      {/* 3D Station with customized tables and items */}
      <ServiceStationRenderer
        motifType={motifType}
        isHighlighted={isHighlighted}
        accent={accent}
      />

      {/* Interactive 3D Label Badge - Left stations centered over model (X=0), Right stations to the right of model (X=+1.8) */}
      {scrollProgress >= 0.16 && (
        <Html position={[position[0] < 0 ? 0 : 1.8, badgeY, 0]} center distanceFactor={15}>
          <div
            className={
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl border animate-fadeIn ' +
              (isHighlighted
                ? 'bg-brand-600 text-white scale-110 border-brand-400 shadow-brand-500/30'
                : 'bg-dark-base/85 text-gray-300 border-white/10')
            }
          >
            <span className="ml-1.5">{iconSymbol}</span>
            <span>{title}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function ServicesConcourse({
  scrollProgress = 0,
  hoveredServiceSlug,
  onSelectService,
  onHoverService,
}: {
  scrollProgress?: number;
  hoveredServiceSlug?: string | null;
  onSelectService?: (slug: string) => void;
  onHoverService?: (slug: string | null) => void;
}) {
  const servicesData: ServicePavilionProps[] = [
    {
      id: 's1',
      slug: 'web-design',
      title: 'طراحی سایت و پرتال سازمانی',
      position: STATIONS_CONFIG.webDesign.stationPosition,
      color: '#0E946E',
      accent: '#10B981',
      iconSymbol: '🌐',
      motifType: 'web',
    },
    {
      id: 's2',
      slug: 'instagram-content',
      title: 'تولید محتوا و اینستاگرام',
      position: STATIONS_CONFIG.contentProduction.stationPosition,
      color: '#14B8A6',
      accent: '#2DD4BF',
      iconSymbol: '📱',
      motifType: 'instagram',
    },
    {
      id: 's3',
      slug: 'video-teaser',
      title: 'تیزر صنعتی و هلی‌شات هوایی',
      position: STATIONS_CONFIG.videoTeaser.stationPosition,
      color: '#F59E0B',
      accent: '#FBBF24',
      iconSymbol: '🎬',
      motifType: 'video',
    },
    {
      id: 's4',
      slug: 'branding-identity',
      title: 'طراحی لوگو و هویت بصری',
      position: STATIONS_CONFIG.logoDesign.stationPosition,
      color: '#8B5CF6',
      accent: '#A78BFA',
      iconSymbol: '✨',
      motifType: 'branding',
    },
    {
      id: 's5',
      slug: 'billboard-advertising',
      title: 'تبلیغات محیطی و بیلبورد ارومیه',
      position: STATIONS_CONFIG.billboard.stationPosition,
      color: '#06B6D4',
      accent: '#22D3EE',
      iconSymbol: '🏙️',
      motifType: 'billboard',
    },
  ];

  return (
    <group>
      {servicesData.map((s) => (
        <ServicePavilion
          key={s.id}
          {...s}
          scrollProgress={scrollProgress}
          isHoveredByParent={hoveredServiceSlug === s.slug}
          onSelect={onSelectService}
          onHover={onHoverService}
        />
      ))}
    </group>
  );
}

// ── 5. ZONE 2: MASTERWORKS DIGITAL VIDEO WALLS & MONITORS ──

function TVScreenDisplay({
  imageUrl,
  screenSize,
  screenOffset,
  screenRotation = [0, 0, 0],
  isHighlighted,
}: {
  imageUrl?: string;
  screenSize: [number, number];
  screenOffset: [number, number, number];
  screenRotation?: [number, number, number];
  isHighlighted: boolean;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setTexture(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    let isMounted = true;
    loader.load(
      imageUrl,
      (loadedTex) => {
        if (!isMounted) return;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        loadedTex.generateMipmaps = false;
        setTexture(loadedTex);
      },
      undefined,
      (err) => {
        console.warn('Could not load TV screen texture:', imageUrl, err);
      }
    );
    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return (
    <group position={screenOffset} rotation={screenRotation}>
      <mesh castShadow={false} receiveShadow={false}>
        <planeGeometry args={screenSize} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            toneMapped={false}
            color={isHighlighted ? '#FFFFFF' : '#E2E8F0'}
          />
        ) : (
          <meshStandardMaterial
            color={isHighlighted ? '#1E3A34' : '#0B1B18'}
            emissive={isHighlighted ? '#10B981' : '#047857'}
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.8}
          />
        )}
      </mesh>
    </group>
  );
}

function TVModelRenderer({ model }: { model: 'TV1' | 'TV2' | 'TV3' | 'TV4' }) {
  const tv1 = useClonedGLTF('/3Dmodels/TV1.glb');
  const tv2 = useClonedGLTF('/3Dmodels/TV2.glb');
  const tv3 = useClonedGLTF('/3Dmodels/TV3.glb');
  const tv4 = useClonedGLTF('/3Dmodels/TV4.glb');

  switch (model) {
    case 'TV1':
      return (
        <group scale={1.35} rotation={[0, Math.PI / 2, 0]}>
          <primitive object={tv1} position={[0.0267, 0.2065, -0.012]} />
        </group>
      );
    case 'TV2':
      return (
        <group scale={0.0085}>
          <primitive object={tv2} position={[0, 1.184, 0]} />
        </group>
      );
    case 'TV3':
      return (
        <group scale={3.6}>
          <primitive object={tv3} position={[0, 0.1981, 0]} />
        </group>
      );
    case 'TV4':
      return (
        <group scale={8.5} rotation={[0, Math.PI, 0]}>
          <primitive object={tv4} position={[0.1963, 0, -0.052]} />
        </group>
      );
  }
}

interface ProjectTVStationProps extends ProjectTVConfig {
  isHoveredByParent?: boolean;
  scrollProgress?: number;
  onSelect?: (slug: string) => void;
  onHover?: (slug: string | null) => void;
}

function ProjectTVStation({
  slug,
  title,
  category,
  kpi,
  model,
  position,
  rotationY,
  screenImage,
  screenSize,
  screenOffset,
  screenRotation,
  isHoveredByParent,
  scrollProgress = 0,
  onSelect,
  onHover,
}: ProjectTVStationProps) {
  const [localHover, setLocalHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const isHighlighted = !!(localHover || isHoveredByParent);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = isHighlighted ? 1.04 : 1.0;
    easing.damp(groupRef.current.scale, 'x', targetScale, 0.2, delta);
    easing.damp(groupRef.current.scale, 'y', targetScale, 0.2, delta);
    easing.damp(groupRef.current.scale, 'z', targetScale, 0.2, delta);
  });

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setLocalHover(true);
        if (onHover) onHover(slug);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setLocalHover(false);
        if (onHover) onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(slug);
      }}
    >
      {/* Ground Cyber Light Ring under each TV display */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.85, 48]} />
        <meshBasicMaterial
          color={isHighlighted ? '#10B981' : '#0E946E'}
          transparent
          opacity={isHighlighted ? 0.85 : 0.4}
        />
      </mesh>

      {/* 3D TV Monitor Model grounded on Y = 0 */}
      <TVModelRenderer model={model} />

      {/* High-Fidelity Screen Plane with Dynamic Project Image */}
      <TVScreenDisplay
        imageUrl={screenImage}
        screenSize={screenSize}
        screenOffset={screenOffset}
        screenRotation={screenRotation}
        isHighlighted={isHighlighted}
      />

      {/* Holographic 3D Overlay Badge - Left TVs centered over model (X=0), Right TVs to the right of model (X=+1.8) */}
      {scrollProgress >= 0.38 && (
        <Html position={[position[0] < 0 ? 0 : 1.8, screenSize[1] + 0.9, 0]} center distanceFactor={16}>
          <div className="p-3 rounded-2xl glass-panel-elevated text-center border border-brand-500/30 shadow-2xl pointer-events-none w-52 animate-fadeIn">
            <span className="text-[10px] font-mono text-brand-300 block mb-0.5">{category}</span>
            <div className="text-xs font-black text-white line-clamp-1">{title}</div>
            <div className="mt-1.5 inline-block bg-brand-500/20 text-brand-300 border border-brand-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {kpi}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function ExhibitionGallery({
  projects,
  scrollProgress = 0,
  hoveredProjectSlug,
  onSelectProject,
  onHoverProject,
}: {
  projects?: ProjectTVConfig[];
  scrollProgress?: number;
  hoveredProjectSlug?: string | null;
  onSelectProject?: (slug: string) => void;
  onHoverProject?: (slug: string | null) => void;
}) {
  const activeProjects = projects && projects.length > 0 ? projects : PORTFOLIO_TVS_CONFIG;

  return (
    <group>
      {activeProjects.map((tvConfig) => (
        <ProjectTVStation
          key={tvConfig.slug}
          {...tvConfig}
          scrollProgress={scrollProgress}
          isHoveredByParent={hoveredProjectSlug === tvConfig.slug}
          onSelect={onSelectProject}
          onHover={onHoverProject}
        />
      ))}
    </group>
  );
}

// ── 6. ZONE 3: COLLABORATION WORKFLOW (OFFICE DEPARTMENT PODS) ──

// Station 1: Discovery & Strategy (Meeting desk, ergonomic chair, coffee mug, paperwork, strategy pen, desk lamp)
function DiscoveryStation() {
  const desk = useClonedGLTF('/3Dmodels/desk_modern.glb');
  const chair = useClonedGLTF('/3Dmodels/office_chair.glb');
  const mug = useClonedGLTF('/3Dmodels/cup_tea.glb');
  const lamp = useClonedGLTF('/3Dmodels/desk_lamp.glb');
  const paper = useClonedGLTF('/3Dmodels/stack of paper.glb');
  const pen = useClonedGLTF('/3Dmodels/Pen.glb');

  return (
    <group>
      {/* Modern Office Desk */}
      <primitive object={desk} position={[0, 0, 0]} />
      {/* Ergonomic Office Chair */}
      <group position={[0, 0, 0.62]} rotation={[0, Math.PI, 0]}>
        <primitive object={chair} position={[0, 0, 0]} />
      </group>
      {/* Desk Lamp */}
      <group position={[-0.65, 0.922, -0.1]} scale={0.8}>
        <primitive object={lamp} />
      </group>
      {/* Coffee/Tea Mug */}
      <group position={[-0.32, 0.922, 0.12]} scale={0.55}>
        <primitive object={mug} />
      </group>
      {/* Research Paperwork */}
      <group position={[0.22, 0.922, 0.02]} scale={1.8}>
        <primitive object={paper} />
      </group>
      {/* Strategy Pen */}
      <group position={[0.36, 0.922, 0.12]} scale={0.035} rotation={[0, 0.4, 0]}>
        <primitive object={pen} />
      </group>
    </group>
  );
}

// Station 2: Interactive UI/UX Design Studio (Modern desk, chair, graphic tablet, headphones, phone prototype, lamp)
function DesignStudioStation() {
  const desk = useClonedGLTF('/3Dmodels/desk_modern.glb');
  const chair = useClonedGLTF('/3Dmodels/office_chair.glb');
  const tablet = useClonedGLTF('/3Dmodels/tablet.glb');
  const headphones = useClonedGLTF('/3Dmodels/headphones.glb');
  const phone = useClonedGLTF('/3Dmodels/Phone3D.glb');
  const lamp = useClonedGLTF('/3Dmodels/desk_lamp.glb');

  return (
    <group>
      {/* Modern Office Desk */}
      <primitive object={desk} position={[0, 0, 0]} />
      {/* Ergonomic Office Chair */}
      <group position={[0, 0, 0.62]} rotation={[0, Math.PI, 0]}>
        <primitive object={chair} position={[0, 0, 0]} />
      </group>
      {/* Graphic Tablet */}
      <group position={[0, 0.922, 0.04]} scale={0.0055}>
        <primitive object={tablet} position={[0.2, 0.21, 5.83]} />
      </group>
      {/* Studio Headphones resting on desk */}
      <group position={[-0.5, 0.922, 0.0]} scale={0.0032} rotation={[0, 0.3, 0]}>
        <primitive object={headphones} position={[-9.7, 0, 1.5]} />
      </group>
      {/* Mobile Prototype */}
      <group position={[0.42, 0.922, 0.1]} scale={0.45} rotation={[-Math.PI / 2, 0, 0.2]}>
        <primitive object={phone} />
      </group>
      {/* Modern Desk Lamp */}
      <group position={[0.65, 0.922, -0.1]} scale={0.8}>
        <primitive object={lamp} />
      </group>
    </group>
  );
}

// Station 3: Engineering & Software Development (Workstation desk, chair, mechanical keyboard, developer monitor, PC tower on floor, coffee)
function EngineeringStation() {
  const desk = useClonedGLTF('/3Dmodels/desk_modern.glb');
  const chair = useClonedGLTF('/3Dmodels/office_chair.glb');
  const pcCase = useClonedGLTF('/3Dmodels/pc_case.glb');
  const keyboard = useClonedGLTF('/3Dmodels/keyboard.glb');
  const monitor = useClonedGLTF('/3Dmodels/TV3.glb');
  const mug = useClonedGLTF('/3Dmodels/cup_tea.glb');

  return (
    <group>
      {/* Modern Office Desk */}
      <primitive object={desk} position={[0, 0, 0]} />
      {/* Ergonomic Office Chair */}
      <group position={[0, 0, 0.62]} rotation={[0, Math.PI, 0]}>
        <primitive object={chair} position={[0, 0, 0]} />
      </group>
      {/* Tower PC Workstation on floor beside desk */}
      <group position={[-1.18, 0, 0]} scale={0.28}>
        <primitive object={pcCase} position={[0.0614, 1.0523, 0.0731]} />
      </group>
      {/* Developer Widescreen Monitor on Desk */}
      <group position={[0, 0.922, -0.12]} scale={0.88}>
        <primitive object={monitor} position={[0, 0.1981, 0]} />
      </group>
      {/* Mechanical Keyboard */}
      <group position={[0, 0.922, 0.14]} scale={0.00045}>
        <primitive object={keyboard} position={[-1140.5, 4.10, 1269.7]} />
      </group>
      {/* Developer Coffee Mug */}
      <group position={[0.54, 0.922, 0.1]} scale={0.55}>
        <primitive object={mug} />
      </group>
    </group>
  );
}

// Station 4: QA, Testing & SEO (Whiteboard on floor, modern desk, chair, testing laptop, testing phone, QA checklist clipboard)
function QATestingStation() {
  const desk = useClonedGLTF('/3Dmodels/desk_modern.glb');
  const chair = useClonedGLTF('/3Dmodels/office_chair.glb');
  const whiteboard = useClonedGLTF('/3Dmodels/whiteboard.glb');
  const laptop = useClonedGLTF('/3Dmodels/Laptop3D.glb');
  const phone = useClonedGLTF('/3Dmodels/Phone3D.glb');
  const clipboard = useClonedGLTF('/3Dmodels/clipboard.glb');

  return (
    <group>
      {/* Standing Whiteboard with SEO & QA Checklist */}
      <group position={[0, 0, -0.85]} scale={0.019} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={whiteboard} position={[0, 0, 0]} />
      </group>
      {/* Modern Office Desk */}
      <primitive object={desk} position={[0, 0, 0]} />
      {/* Ergonomic Office Chair */}
      <group position={[0, 0, 0.62]} rotation={[0, Math.PI, 0]}>
        <primitive object={chair} position={[0, 0, 0]} />
      </group>
      {/* Multi-Device Testing Laptop */}
      <group position={[-0.26, 0.922, 0.02]} scale={0.75} rotation={[0, 0.15, 0]}>
        <primitive object={laptop} />
      </group>
      {/* Responsive Testing Phone */}
      <group position={[0.26, 0.922, 0.08]} scale={0.42} rotation={[-Math.PI / 2, 0, -0.2]}>
        <primitive object={phone} />
      </group>
      {/* QA Checklist Clipboard */}
      <group position={[0.52, 0.922, 0.02]} scale={0.8} rotation={[0, 0, -Math.PI / 2]}>
        <primitive object={clipboard} />
      </group>
    </group>
  );
}

// Station 5: Launch & Official Handover (Executive Desk, chair, signed contract folder, executive lamp, celebration mug)
function LaunchHandoverStation() {
  const desk = useClonedGLTF('/3Dmodels/desk_modern.glb');
  const chair = useClonedGLTF('/3Dmodels/office_chair.glb');
  const clipboard = useClonedGLTF('/3Dmodels/clipboard.glb');
  const pen = useClonedGLTF('/3Dmodels/Pen.glb');
  const lamp = useClonedGLTF('/3Dmodels/desk_lamp.glb');
  const mug = useClonedGLTF('/3Dmodels/cup_tea.glb');

  return (
    <group>
      {/* Modern Executive Desk */}
      <primitive object={desk} position={[0, 0, 0]} />
      {/* Ergonomic Office Chair */}
      <group position={[0, 0, 0.62]} rotation={[0, Math.PI, 0]}>
        <primitive object={chair} position={[0, 0, 0]} />
      </group>
      {/* Signed Contract Folder */}
      <group position={[0, 0.922, 0.05]} scale={0.9} rotation={[0, 0, -Math.PI / 2]}>
        <primitive object={clipboard} />
      </group>
      {/* Official Signature Pen */}
      <group position={[0.16, 0.922, 0.16]} scale={0.035} rotation={[0, 0.5, 0]}>
        <primitive object={pen} />
      </group>
      {/* Executive Desk Lamp */}
      <group position={[-0.65, 0.922, -0.1]} scale={0.8}>
        <primitive object={lamp} />
      </group>
      {/* Celebration Mug */}
      <group position={[0.52, 0.922, 0.1]} scale={0.55}>
        <primitive object={mug} />
      </group>
    </group>
  );
}

function CollaborationDepartmentStation({
  config,
  scrollProgress = 0,
}: {
  config: CollaborationStationConfig;
  scrollProgress: number;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const baseScale = 1.6;
    const targetScale = hovered ? baseScale * 1.04 : baseScale;
    easing.damp(groupRef.current.scale, 'x', targetScale, 0.2, delta);
    easing.damp(groupRef.current.scale, 'y', targetScale, 0.2, delta);
    easing.damp(groupRef.current.scale, 'z', targetScale, 0.2, delta);
  });

  const isLeft = config.position[0] < 0;

  return (
    <group position={config.position}>
      {/* 3D Office Workstation (scaled 1.6x and rotated towards runway) */}
      <group
        rotation={[0, config.rotationY, 0]}
        scale={[1.6, 1.6, 1.6]}
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Floor Glow Accent Light */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.75, 48]} />
          <meshBasicMaterial
            color={hovered ? '#10B981' : '#0E946E'}
            transparent
            opacity={hovered ? 0.8 : 0.35}
          />
        </mesh>

        {/* Specific Office Station Sub-Component */}
        {config.id === 'step-discovery' && <DiscoveryStation />}
        {config.id === 'step-design' && <DesignStudioStation />}
        {config.id === 'step-engineering' && <EngineeringStation />}
        {config.id === 'step-testing' && <QATestingStation />}
        {config.id === 'step-launch' && <LaunchHandoverStation />}
      </group>

      {/* Holographic 3D Overlay Badge - Left stations centered over model (X=0), Right stations to the right of model (X=+2.0) */}
      {scrollProgress >= 0.62 && (
        <Html position={[isLeft ? 0 : 2.0, 3.2, 0]} center distanceFactor={16}>
          <div className="p-3 rounded-2xl glass-panel-elevated text-center border border-brand-500/30 shadow-2xl pointer-events-none w-56 animate-fadeIn">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-[10px] font-mono text-brand-300 font-bold bg-brand-500/20 px-2 py-0.5 rounded-full border border-brand-500/30">
                {config.stepNumber} • {config.stepTag}
              </span>
            </div>
            <div className="text-xs font-black text-white">{config.title}</div>
            <div className="text-[10px] text-gray-300 mt-1 line-clamp-2 leading-tight">
              {config.subtitle}
            </div>
            <div className="mt-2 inline-block bg-brand-500/20 text-brand-300 border border-brand-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
              ⏱ {config.duration}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function CollaborationOfficeConcourse({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <group>
      {COLLABORATION_STATIONS_CONFIG.map((st) => (
        <CollaborationDepartmentStation
          key={st.id}
          config={st}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  );
}

// ── 7. ZONE 4: TERMINAL PORTAL (CONTACT GATEWAY) ──
function TerminalPortal() {
  return (
    <group position={[0, 0, -150]}>
      <mesh position={[-6, 6, 0]} castShadow>
        <boxGeometry args={[1.5, 12, 2.0]} />
        <meshStandardMaterial color="#0B121E" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[6, 6, 0]} castShadow>
        <boxGeometry args={[1.5, 12, 2.0]} />
        <meshStandardMaterial color="#0B121E" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 11.5, 0]}>
        <boxGeometry args={[14, 1.2, 2.2]} />
        <meshStandardMaterial color="#0E1626" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 10.85, 0]}>
        <boxGeometry args={[13.5, 0.08, 2.25]} />
        <meshBasicMaterial color="#0E946E" />
      </mesh>
      <mesh position={[-5.2, 6, 0]}>
        <boxGeometry args={[0.15, 11.5, 0.2]} />
        <meshBasicMaterial color="#14B8A6" />
      </mesh>
      <mesh position={[5.2, 6, 0]}>
        <boxGeometry args={[0.15, 11.5, 0.2]} />
        <meshBasicMaterial color="#14B8A6" />
      </mesh>
    </group>
  );
}

// ── 8. MASTER DIGITAL CAMPUS EXPORT ──
export default function DigitalArchitectureCampus({
  scrollProgress,
  hoveredServiceSlug,
  hoveredProjectSlug,
  portfolioProjects,
  onSelectService,
  onSelectProject,
  onHoverService,
  onHoverProject,
  onExploreServices,
  onExploreProjects,
}: CampusProps) {
  return (
    <>
      <color attach="background" args={['#070B12']} />
      <fog attach="fog" args={['#070B12', 8, 80]} />

      <ambientLight intensity={0.65} color="#0F172A" />
      <directionalLight
        position={[14, 22, 16]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={120}
        color="#F8FAFC"
      />
      <directionalLight position={[-16, 14, -20]} intensity={1.2} color="#F59E0B" />
      <pointLight position={[0, 6, -4]} intensity={2.5} distance={25} color="#0E946E" />
      <pointLight position={[-2, 5, -28]} intensity={2.0} distance={30} color="#10B981" />
      <pointLight position={[0, 6, -68]} intensity={2.0} distance={35} color="#14B8A6" />

      <SmoothScrollCamera scrollProgress={scrollProgress} />

      <ArchitecturalFloor />
      <NexusGateway
        scrollProgress={scrollProgress}
        onExploreServices={onExploreServices}
        onExploreProjects={onExploreProjects}
      />
      <ServicesConcourse
        scrollProgress={scrollProgress}
        hoveredServiceSlug={hoveredServiceSlug}
        onSelectService={onSelectService}
        onHoverService={onHoverService}
      />
      <ExhibitionGallery
        projects={portfolioProjects}
        scrollProgress={scrollProgress}
        hoveredProjectSlug={hoveredProjectSlug}
        onSelectProject={onSelectProject}
        onHoverProject={onHoverProject}
      />
      <CollaborationOfficeConcourse scrollProgress={scrollProgress} />
      <TerminalPortal />
    </>
  );
}

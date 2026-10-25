'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

interface CampusProps {
  scrollProgress: number; // 0 to 1
  activeSector: number;   // 0 to 4
  hoveredServiceSlug?: string | null;
  hoveredProjectSlug?: string | null;
  onSelectService?: (slug: string) => void;
  onSelectProject?: (slug: string) => void;
  onHoverService?: (slug: string | null) => void;
  onHoverProject?: (slug: string | null) => void;
  onExploreServices?: () => void;
  onExploreProjects?: () => void;
}

// ── CINEMATIC WAYPOINT SPLINE FOR CAMERA CHOREOGRAPHY ──
// Desktop Waypoints (Framing ground-hinged hero card at eye level on runway)
const CAMERA_WAYPOINTS = [
  // Sector 0: Grand Nexus Portal (Framing the standing Ground-Hinged Hero Card on the runway floor)
  { pos: new THREE.Vector3(0, 3.6, 11.5), target: new THREE.Vector3(0, 3.2, 0.0) },
  // Sector 1: Services Concourse (right bank looking down at left pavilions)
  { pos: new THREE.Vector3(6.2, 3.4, -18.0), target: new THREE.Vector3(-1.8, 1.8, -32.0) },
  // Sector 2: Masterworks Exhibition Hall (left bank viewing plinths)
  { pos: new THREE.Vector3(-5.8, 3.6, -52.0), target: new THREE.Vector3(1.8, 1.6, -70.0) },
  // Sector 3: Command Observation Deck (elevated panoramic over process & stats)
  { pos: new THREE.Vector3(0, 8.5, -92.0), target: new THREE.Vector3(0, 2.8, -115.0) },
  // Sector 4: Terminal Gateway (framing contact portal and footer)
  { pos: new THREE.Vector3(0, 3.2, -135.0), target: new THREE.Vector3(0, 2.2, -165.0) },
];

// Mobile Waypoints (Narrow portrait composition: backed up to fit full card width)
const MOBILE_CAMERA_WAYPOINTS = [
  // Sector 0: Grand Nexus Portal (backed up to frame full card width on narrow screens)
  { pos: new THREE.Vector3(0, 3.8, 16.5), target: new THREE.Vector3(0, 3.2, 0.0) },
  // Sector 1: Services Concourse (elevated higher so beacons stay in view above mobile cards)
  { pos: new THREE.Vector3(1.6, 5.2, -16.0), target: new THREE.Vector3(-0.8, 2.0, -32.0) },
  // Sector 2: Masterworks Exhibition Hall (elevated & centered)
  { pos: new THREE.Vector3(-1.2, 5.0, -50.0), target: new THREE.Vector3(0.6, 2.0, -68.0) },
  // Sector 3: Command Observation Deck (elevated overview)
  { pos: new THREE.Vector3(0, 10.0, -90.0), target: new THREE.Vector3(0, 3.2, -115.0) },
  // Sector 4: Terminal Gateway (elevated portal)
  { pos: new THREE.Vector3(0, 4.4, -133.0), target: new THREE.Vector3(0, 2.6, -165.0) },
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
    // On narrow portrait screens, widen vertical FOV to maintain horizontal span
    const targetFov = aspect < 0.65 ? 60 : aspect < 1.0 ? 52 : 45;
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

  // Load UrumSima Calligraphy Brand Logo textures and team hero landing texture
  const logoEmeraldTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/images/urumsima-logo-emerald.png');
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const logoWhiteTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/images/urumsima-logo-white.png');
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const teamHeroTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/images/team-hero-framed.webp');
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

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
      <group ref={cardHingeRef} position={[0, 0.05, 0]}>
        {/* Structural Chassis Slab (Offset along local Y so bottom edge is AT y = 0) */}
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

        {/* 3D Textured Team Photo (Top Section - Permanent on 3D Slab) */}
        {teamHeroTex && (
          <mesh position={[0, CARD_HEIGHT - 1.25, 0.02]}>
            <planeGeometry args={[CARD_WIDTH - 0.4, 2.2]} />
            <meshStandardMaterial map={teamHeroTex} roughness={0.25} metalness={0.3} />
          </mesh>
        )}

        {/* 3D Textured Lower Panel (Displays UrumSima Calligraphy when flat on floor) */}
        <mesh position={[0, 1.85, 0.02]}>
          <planeGeometry args={[CARD_WIDTH - 0.4, 3.2]} />
          <meshStandardMaterial color="#050C0A" roughness={0.18} metalness={0.88} />
        </mesh>

        {/* Brand Calligraphy Outline on Lower Panel */}
        {logoWhiteTex && (
          <mesh position={[0, 1.85, 0.03]}>
            <planeGeometry args={[4.2, 1.4]} />
            <meshBasicMaterial
              map={logoWhiteTex}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* ── 3. RICH INTERACTIVE DREI <Html transform> FRONT FACE ── */}
        <Html
          transform
          position={[0, CARD_HEIGHT / 2, 0.04]}
          center
          distanceFactor={6.8}
          style={{
            width: '1160px',
            height: '620px',
            pointerEvents: heroT < 0.75 ? 'auto' : 'none',
            userSelect: 'none',
            opacity: Math.max(0, 1 - (heroT > 0.55 ? (heroT - 0.55) * 3.5 : 0)),
            transition: 'opacity 0.15s ease-out',
          }}
        >
          <div className="w-full h-full rounded-3xl bg-[#050C0A]/95 border-2 border-emerald-500/50 shadow-2xl flex flex-col justify-between p-7 text-right select-none font-sans overflow-hidden backdrop-blur-md">
            {/* Top Team Photo Area with Framed Team Image */}
            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-inner bg-black/50">
              <img
                src="/images/team-hero-framed.webp"
                alt="تیم متخصصان اروم سیما"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050C0A] via-transparent to-black/30" />
              <div className="absolute bottom-2.5 right-4 flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold tracking-wider">تیم ارشد مهندسی و بازاریابی دیجیتال اروم‌سیما</span>
              </div>
            </div>

            {/* Middle Content: Headlines, Description & Service Pills */}
            <div className="space-y-3.5 my-auto">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  اروم سیما؛{' '}
                  <span className="text-emerald-400">آژانس دیجیتال مارکتینگ در ارومیه</span>
                </h1>
                <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                  تیمی از متخصصان طراحی سایت، سئو و تولید محتوا در ارومیه؛ از ایده تا اجرا، با خلاقیت و شناخت عمیق بازار کنار شما هستیم تا برندتان دیده شود.
                </p>
              </div>

              {/* Service Capabilities Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  'طراحی سایت مدرن',
                  'سئو حرفه‌ای و تکنیکال',
                  'تبلیغات دیجیتال و گوگل',
                  'تولید محتوا و ویدیو مارکتینگ',
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onExploreServices}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/40 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>مشاهده خدمات استراتژیک</span>
                  <span>←</span>
                </button>
                <button
                  type="button"
                  onClick={onExploreProjects}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-bold text-xs flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>بررسی پروژه‌های شاخص</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* Bottom Ticker Badges */}
            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center gap-6">
                <span>✓ پشتیبانی ۲۴/۷</span>
                <span>✓ تحویل به‌موقع پروژه‌ها</span>
                <span>✓ ضمانت کیفیت</span>
                <span>✓ مشاوره رایگان</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>URUMSIMA CAMPUS NEXUS</span>
              </div>
            </div>
          </div>
        </Html>
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

      {/* ── 3D URUMSIMA BRAND LOGO LANDMARK (REPLACES GREEN MONOLITH & RING) ── */}
      <group ref={monolithRef} position={[0, 3.4, -4]}>
        <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.35}>
          {/* Sleek Obsidian Chamfered Glass Plinth Backing */}
          <RoundedBox args={[2.7, 3.8, 0.16]} radius={0.16} smoothness={4} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#081018"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.88}
              transmission={0.3}
              thickness={0.5}
            />
          </RoundedBox>

          {/* Luminous Emerald Outer Rim Conduit */}
          <mesh position={[0, 0, 0.09]}>
            <planeGeometry args={[2.6, 3.7]} />
            <meshBasicMaterial color="#0E946E" wireframe transparent opacity={0.35} />
          </mesh>

          {/* Front Face: Glowing Emerald UrumSima Calligraphy Logo */}
          {logoEmeraldTex && (
            <mesh position={[0, 0, 0.10]}>
              <planeGeometry args={[2.3, 3.25]} />
              <meshBasicMaterial
                map={logoEmeraldTex}
                transparent
                alphaTest={0.02}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
          )}

          {/* Back Face: Glowing White/Silver UrumSima Calligraphy Logo */}
          {logoWhiteTex && (
            <mesh position={[0, 0, -0.10]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[2.3, 3.25]} />
              <meshBasicMaterial
                map={logoWhiteTex}
                transparent
                alphaTest={0.02}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
          )}

          {/* Delicate Quantum Orbit Ring around Logo */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.5, 0.02, 16, 64]} />
            <meshBasicMaterial color="#10B981" transparent opacity={0.6} />
          </mesh>

          {/* Top & Bottom Titanium Brackets */}
          <mesh position={[0, 1.95, 0]}>
            <boxGeometry args={[1.2, 0.14, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0, -1.95, 0]}>
            <boxGeometry args={[1.2, 0.14, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Holographic 3D Brand Label beneath Landmark */}
          <Html position={[0, -2.45, 0]} center distanceFactor={12}>
            <div className="px-3.5 py-1 rounded-full glass-panel-dock border border-brand-500/30 text-[10px] font-bold text-brand-300 whitespace-nowrap shadow-xl pointer-events-none select-none backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>اروم سیما • آژانس دیجیتال مارکتینگ</span>
            </div>
          </Html>

          {/* Central Internal Point Light for Aura Glow */}
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
  onSelect?: (slug: string) => void;
  onHover?: (slug: string | null) => void;
}

function ServiceMotifMesh({
  type,
  isHighlighted,
  color,
  accent,
}: {
  type: 'web' | 'instagram' | 'video' | 'branding' | 'billboard';
  isHighlighted: boolean;
  color: string;
  accent: string;
}) {
  if (type === 'web') {
    // Modular Digital Lattice Cube
    return (
      <group>
        <RoundedBox args={[1.1, 1.1, 1.1]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={isHighlighted ? '#10B981' : color}
            emissive={isHighlighted ? '#0E946E' : '#047857'}
            emissiveIntensity={isHighlighted ? 0.9 : 0.3}
            roughness={0.1}
            metalness={0.88}
            wireframe={!isHighlighted}
          />
        </RoundedBox>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>
      </group>
    );
  }

  if (type === 'instagram') {
    // Dynamic Social Prism Tower
    return (
      <group>
        <cylinderGeometry args={[0.5, 0.65, 1.4, 3]} />
        <meshStandardMaterial
          color={isHighlighted ? '#2DD4BF' : color}
          emissive={isHighlighted ? '#14B8A6' : '#0F766E'}
          emissiveIntensity={isHighlighted ? 0.9 : 0.3}
          roughness={0.15}
          metalness={0.85}
        />
        <mesh position={[0, 0.8, 0]}>
          <torusGeometry args={[0.7, 0.03, 16, 32]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
    );
  }

  if (type === 'video') {
    // Cinematic Lens & Focal Prism
    return (
      <group>
        <torusGeometry args={[0.75, 0.12, 16, 32]} />
        <meshStandardMaterial
          color={isHighlighted ? '#FBBF24' : color}
          roughness={0.2}
          metalness={0.9}
        />
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshBasicMaterial color="#F59E0B" wireframe={!isHighlighted} />
        </mesh>
      </group>
    );
  }

  if (type === 'branding') {
    // Golden Ratio Platinum Identity Jewel
    return (
      <group>
        <coneGeometry args={[0.75, 1.4, 5]} />
        <meshStandardMaterial
          color={isHighlighted ? '#A78BFA' : color}
          emissive={isHighlighted ? '#8B5CF6' : '#6D28D9'}
          emissiveIntensity={isHighlighted ? 0.8 : 0.3}
          roughness={0.1}
          metalness={0.92}
        />
        <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[0.85, 0.92, 32]} />
          <meshBasicMaterial color="#DDD6FE" />
        </mesh>
      </group>
    );
  }

  // Billboard: Curved Monumental Urban Screen Arch
  return (
    <group>
      <RoundedBox args={[1.4, 1.0, 0.3]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color={isHighlighted ? '#22D3EE' : color}
          emissive={isHighlighted ? '#06B6D4' : '#0891B2'}
          emissiveIntensity={isHighlighted ? 0.85 : 0.3}
          roughness={0.12}
          metalness={0.9}
        />
      </RoundedBox>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} />
      </mesh>
    </group>
  );
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
  onSelect,
  onHover,
}: ServicePavilionProps) {
  const [localHover, setLocalHover] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const isHighlighted = !!(localHover || isHoveredByParent);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = isHighlighted ? 0.45 : 0;
    easing.damp(meshRef.current.position, 'y', targetY, 0.2, delta);
  });

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
      {/* Heavy Architectural Foundation Pier */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.8, 6]} />
        <meshStandardMaterial
          color={isHighlighted ? '#1E293B' : '#0F172A'}
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Glowing Perimeter Ring */}
      <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 6]} />
        <meshBasicMaterial color={isHighlighted ? '#34D399' : accent} />
      </mesh>

      {/* Floating Center Custom Architectural Motif */}
      <Float speed={3.0} rotationIntensity={0.4} floatIntensity={0.6} position={[0, 2.0, 0]}>
        <ServiceMotifMesh
          type={motifType}
          isHighlighted={isHighlighted}
          color={color}
          accent={accent}
        />
      </Float>

      {/* Interactive 3D Label Badge */}
      <Html position={[0, 3.2, 0]} center distanceFactor={15}>
        <div
          className={
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl border ' +
            (isHighlighted
              ? 'bg-brand-600 text-white scale-110 border-brand-400 shadow-brand-500/30'
              : 'bg-dark-base/85 text-gray-300 border-white/10')
          }
        >
          <span className="ml-1.5">{iconSymbol}</span>
          <span>{title}</span>
        </div>
      </Html>
    </group>
  );
}

function ServicesConcourse({
  hoveredServiceSlug,
  onSelectService,
  onHoverService,
}: {
  hoveredServiceSlug?: string | null;
  onSelectService?: (slug: string) => void;
  onHoverService?: (slug: string | null) => void;
}) {
  const servicesData: ServicePavilionProps[] = [
    {
      id: 's1',
      slug: 'web-design',
      title: 'طراحی سایت و پرتال سازمانی',
      position: [-3.8, 0, -22],
      color: '#0E946E',
      accent: '#10B981',
      iconSymbol: '🌐',
      motifType: 'web',
    },
    {
      id: 's2',
      slug: 'instagram-content',
      title: 'تولید محتوا و اینستاگرام',
      position: [0.5, 0, -26],
      color: '#14B8A6',
      accent: '#2DD4BF',
      iconSymbol: '📱',
      motifType: 'instagram',
    },
    {
      id: 's3',
      slug: 'video-teaser',
      title: 'تیزر صنعتی و هلی‌شات هوایی',
      position: [-3.2, 0, -32],
      color: '#F59E0B',
      accent: '#FBBF24',
      iconSymbol: '🎬',
      motifType: 'video',
    },
    {
      id: 's4',
      slug: 'branding-identity',
      title: 'طراحی لوگو و هویت بصری',
      position: [0.8, 0, -37],
      color: '#8B5CF6',
      accent: '#A78BFA',
      iconSymbol: '✨',
      motifType: 'branding',
    },
    {
      id: 's5',
      slug: 'billboard-advertising',
      title: 'تبلیغات محیطی و بیلبورد ارومیه',
      position: [-2.5, 0, -42],
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
          isHoveredByParent={hoveredServiceSlug === s.slug}
          onSelect={onSelectService}
          onHover={onHoverService}
        />
      ))}
    </group>
  );
}

// ── 5. ZONE 2: THE MASTERWORKS EXHIBITION PLINTHS ──
interface ExhibitionPlinthProps {
  slug: string;
  title: string;
  category: string;
  kpi: string;
  position: [number, number, number];
  rotationY?: number;
  isHoveredByParent?: boolean;
  onSelect?: (slug: string) => void;
  onHover?: (slug: string | null) => void;
}

function ExhibitionPlinth({
  slug,
  title,
  category,
  kpi,
  position,
  rotationY = 0,
  isHoveredByParent,
  onSelect,
  onHover,
}: ExhibitionPlinthProps) {
  const [localHover, setLocalHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const isHighlighted = !!(localHover || isHoveredByParent);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = isHighlighted ? 1.06 : 1.0;
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
      {/* Heavy Architectural Podium */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.0, 2.6]} />
        <meshStandardMaterial
          color={isHighlighted ? '#1E293B' : '#0B121E'}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Emerald Perimeter Accent Light */}
      <mesh position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.25, 2.65]} />
        <meshBasicMaterial color={isHighlighted ? '#10B981' : '#0E946E'} transparent opacity={0.6} />
      </mesh>

      {/* Tilted Floating Display Slab */}
      <group position={[0, 2.2, 0]} rotation={[-Math.PI / 10, 0, 0]}>
        <RoundedBox args={[3.8, 2.2, 0.15]} radius={0.08} smoothness={4} castShadow>
          <meshStandardMaterial
            color="#111827"
            roughness={0.15}
            metalness={0.9}
          />
        </RoundedBox>

        {/* Inner Luminous Terminal Screen */}
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[3.6, 2.0]} />
          <meshBasicMaterial
            color={isHighlighted ? '#1E3A34' : '#0D2320'}
          />
        </mesh>

        {/* Holographic 3D Overlay Badge */}
        <Html position={[0, 0, 0.2]} center distanceFactor={16}>
          <div className="p-3 rounded-2xl glass-panel-elevated text-center border border-brand-500/30 shadow-2xl pointer-events-none w-52">
            <span className="text-[10px] font-mono text-brand-300 block mb-0.5">{category}</span>
            <div className="text-xs font-black text-white line-clamp-1">{title}</div>
            <div className="mt-1.5 inline-block bg-brand-500/20 text-brand-300 border border-brand-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {kpi}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

function ExhibitionGallery({
  hoveredProjectSlug,
  onSelectProject,
  onHoverProject,
}: {
  hoveredProjectSlug?: string | null;
  onSelectProject?: (slug: string) => void;
  onHoverProject?: (slug: string | null) => void;
}) {
  const projectsData = [
    {
      slug: 'araz-metal-industrial-portal',
      title: 'پورتال سازمانی آراز متال',
      category: 'طراحی سایت صنعتی',
      kpi: '+۲۴۰٪ ترافیک ارگانیک',
      position: [-2.0, 0, -58] as [number, number, number],
      rotationY: Math.PI / 10,
    },
    {
      slug: 'dr-sadeghi-medical-branding',
      title: 'کمپین کلینیک دکتر صادقی',
      category: 'اینستاگرام و ویدیو مارکتینگ',
      kpi: '+۱.۸M بازدید ریلزها',
      position: [3.5, 0, -64] as [number, number, number],
      rotationY: -Math.PI / 10,
    },
    {
      slug: 'sepid-kooh-outdoor-campaign',
      title: 'کمپین محیطی سپید کوه',
      category: 'بیلبورد و تیزر سینمایی',
      kpi: '+۲.۵M ایمپرشن شهری',
      position: [-2.2, 0, -72] as [number, number, number],
      rotationY: Math.PI / 10,
    },
    {
      slug: 'baran-leather-ecommerce',
      title: 'فروشگاه آنلاین چرم باران',
      category: 'تجارت الکترونیک Jamstack',
      kpi: '+۲,۸۰۰ سفارش ماهانه',
      position: [3.2, 0, -78] as [number, number, number],
      rotationY: -Math.PI / 10,
    },
  ];

  return (
    <group>
      {projectsData.map((p) => (
        <ExhibitionPlinth
          key={p.slug}
          {...p}
          isHoveredByParent={hoveredProjectSlug === p.slug}
          onSelect={onSelectProject}
          onHover={onHoverProject}
        />
      ))}
    </group>
  );
}

// ── 6. ZONE 3: THE STRATEGY STEP TOWERS ──
function StrategyObservationDeck() {
  const steps = [
    { height: 2.0, z: -98, x: -3.5, label: '۰۱ تحلیل' },
    { height: 3.2, z: -104, x: -1.8, label: '۰۲ پروتوتایپ' },
    { height: 4.4, z: -110, x: 0.0, label: '۰۳ مهندسی' },
    { height: 5.6, z: -116, x: 1.8, label: '۰۴ سئو و تست' },
    { height: 6.8, z: -122, x: 3.5, label: '۰۵ عرضه' },
  ];

  return (
    <group>
      {steps.map((st, idx) => (
        <group key={idx} position={[st.x, 0, st.z]}>
          <mesh position={[0, st.height / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 1.1, st.height, 8]} />
            <meshStandardMaterial
              color="#0B121E"
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, st.height + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.95, 8]} />
            <meshBasicMaterial color="#0E946E" />
          </mesh>
          <mesh position={[0, st.height / 2, 0.92]}>
            <planeGeometry args={[0.1, st.height * 0.9]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>
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
        hoveredServiceSlug={hoveredServiceSlug}
        onSelectService={onSelectService}
        onHoverService={onHoverService}
      />
      <ExhibitionGallery
        hoveredProjectSlug={hoveredProjectSlug}
        onSelectProject={onSelectProject}
        onHoverProject={onHoverProject}
      />
      <StrategyObservationDeck />
      <TerminalPortal />
    </>
  );
}

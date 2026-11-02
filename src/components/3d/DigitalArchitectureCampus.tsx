'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import {
  ProjectTVConfig,
  DiveTargetConfig,
  DivePhase,
} from './stationsConfig';
import CosmicDeepSpace from './CosmicDeepSpace';
import CosmicSectorShowcase from './CosmicSectorShowcase';

export interface CampusProps {
  scrollProgress: number; // 0.0 to 1.0
  activeSector: number; // 0 to 4
  hoveredServiceSlug?: string | null;
  hoveredProjectSlug?: string | null;
  portfolioProjects?: ProjectTVConfig[];
  activeDiveTarget?: DiveTargetConfig | null;
  divePhase?: DivePhase;
  onDiveReachedTarget?: () => void;
  onSelectService?: (slug: string) => void;
  onSelectProject?: (slug: string) => void;
  onHoverService?: (slug: string | null) => void;
  onHoverProject?: (slug: string | null) => void;
  onExploreServices?: () => void;
  onExploreProjects?: () => void;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ── STAGE-CENTRIC CINEMATIC CAMERA CONTROLLER ──
function SmoothScrollCamera({
  activeDiveTarget,
  divePhase = 'idle',
  onDiveReachedTarget,
}: {
  scrollProgress: number;
  activeDiveTarget?: DiveTargetConfig | null;
  divePhase?: DivePhase;
  onDiveReachedTarget?: () => void;
}) {
  const { camera, pointer, size } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0.2, 0));
  const hasTriggeredDiveReached = useRef(false);
  const diveInitialized = useRef(false);
  const pullbackInitialized = useRef(false);
  const diveStartPos = useRef(new THREE.Vector3());
  const diveStartLookAt = useRef(new THREE.Vector3());
  const diveStartTime = useRef<number>(0);
  const pullbackStartTime = useRef<number>(0);
  const desiredPosRef = useRef(new THREE.Vector3());
  const scratchDivePos = useRef(new THREE.Vector3(0, 0.25, 1.3));
  const scratchDiveLookAt = useRef(new THREE.Vector3(0, 0.25, 0));
  const scratchNormalPos = useRef(new THREE.Vector3(0, 0, 4.2));
  const scratchNormalLookAt = useRef(new THREE.Vector3(0, 0.2, 0));
  const aspect = size.width / (size.height || 1);
  const isMobile = aspect < 1.0;

  useEffect(() => {
    if (divePhase === 'diving') {
      hasTriggeredDiveReached.current = false;
      diveInitialized.current = false;
      diveStartTime.current = performance.now();
    } else {
      hasTriggeredDiveReached.current = false;
      diveInitialized.current = false;
    }

    if (divePhase === 'pullback') {
      pullbackInitialized.current = false;
      pullbackStartTime.current = performance.now();
    } else if (divePhase !== 'pullback_hold') {
      pullbackInitialized.current = false;
    }
  }, [divePhase]);

  // Responsive FOV adjustment on mobile viewports
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const targetFov = aspect < 0.55 ? 58 : aspect < 0.75 ? 52 : aspect < 1.0 ? 48 : 45;
    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, aspect]);

  useFrame((_, delta) => {
    // ── 1. CINEMATIC CAMERA DIVE ONTO 3D SCREEN ──
    if (divePhase === 'diving' && activeDiveTarget) {
      if (!diveInitialized.current) {
        diveStartPos.current.copy(camera.position);
        diveStartLookAt.current.copy(currentTarget.current);
        diveStartTime.current = performance.now();
        diveInitialized.current = true;
      }

      const DIVE_DURATION = 1000;
      const elapsed = performance.now() - diveStartTime.current;
      const progress = Math.min(1, Math.max(0, elapsed / DIVE_DURATION));
      const ease = easeInOutCubic(progress);

      camera.position.lerpVectors(diveStartPos.current, scratchDivePos.current, ease);
      currentTarget.current.lerpVectors(diveStartLookAt.current, scratchDiveLookAt.current, ease);
      camera.lookAt(currentTarget.current);

      if (progress >= 1 && !hasTriggeredDiveReached.current) {
        hasTriggeredDiveReached.current = true;
        if (onDiveReachedTarget) {
          onDiveReachedTarget();
        }
      }
      return;
    }

    // ── 2. HOLD POSITION ON SCREEN ──
    if (divePhase === 'pullback_hold' && activeDiveTarget) {
      camera.position.set(0, 0.25, 1.3);
      currentTarget.current.set(0, 0.25, 0);
      camera.lookAt(currentTarget.current);
      return;
    }

    // ── 3. REVERSE DIVE: CINEMATIC CAMERA PULLBACK ──
    if (divePhase === 'pullback' && activeDiveTarget) {
      if (!pullbackInitialized.current) {
        camera.position.set(0, 0.25, 1.3);
        currentTarget.current.set(0, 0.25, 0);
        camera.lookAt(currentTarget.current);
        pullbackStartTime.current = performance.now();
        pullbackInitialized.current = true;
      }

      const PULLBACK_DURATION = 1000;
      const elapsed = performance.now() - pullbackStartTime.current;
      const progress = Math.min(1, Math.max(0, elapsed / PULLBACK_DURATION));
      const ease = easeInOutCubic(progress);

      camera.position.lerpVectors(scratchDivePos.current, scratchNormalPos.current, ease);
      currentTarget.current.lerpVectors(scratchDiveLookAt.current, scratchNormalLookAt.current, ease);
      camera.lookAt(currentTarget.current);
      return;
    }

    // ── 4. STABLE STAGE TRACKING WITH GENTLE PARALLAX ──
    const parallaxMult = isMobile ? 0.2 : 0.55;
    const targetX = pointer.x * parallaxMult;
    const targetY = pointer.y * (parallaxMult * 0.45);

    desiredPosRef.current.set(targetX, targetY, isMobile ? 4.8 : 4.2);
    easing.damp3(camera.position, desiredPosRef.current, 0.35, delta);
    easing.damp3(currentTarget.current, [0, 0.2, 0], 0.35, delta);

    camera.lookAt(currentTarget.current);
  });

  return null;
}

// ── MASTER DIGITAL ARCHITECTURE CAMPUS ──
export default function DigitalArchitectureCampus({
  scrollProgress,
  activeSector,
  hoveredServiceSlug,
  hoveredProjectSlug,
  portfolioProjects,
  activeDiveTarget,
  divePhase,
  onDiveReachedTarget,
  onSelectService,
  onSelectProject,
  onHoverService,
  onHoverProject,
}: CampusProps) {
  const isDiving = divePhase !== 'idle';

  return (
    <>
      {/* Deep Cosmic Void Background & Soft Atmospheric Fog */}
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 25, 75]} />

      {/* Cinematic Studio Deep Space Lighting Setup */}
      <ambientLight intensity={1.3} color="#E0F2FE" />
      <directionalLight position={[10, 15, 12]} intensity={2.4} color="#F0FDF4" />
      <directionalLight position={[-10, 10, 8]} intensity={1.5} color="#38BDF8" />
      <pointLight position={[0, 2, 3]} intensity={2.0} distance={15} color="#10B981" />
      <pointLight position={[0, -2, 2]} intensity={1.2} distance={12} color="#38BDF8" />

      {/* Fixed Stable Camera with Parallax & Dive Transitions */}
      <SmoothScrollCamera
        scrollProgress={scrollProgress}
        activeDiveTarget={activeDiveTarget}
        divePhase={divePhase}
        onDiveReachedTarget={onDiveReachedTarget}
      />

      {/* Deep Space Starfield & Forward-Travelling Warp Streak Tunnel */}
      <CosmicDeepSpace scrollProgress={scrollProgress} activeSector={activeSector} />

      {/* Stage-Centric Photorealistic 3D Showcase (All Models Perfectly Sized & Centered) */}
      <CosmicSectorShowcase
        scrollProgress={scrollProgress}
        hoveredServiceSlug={hoveredServiceSlug}
        hoveredProjectSlug={hoveredProjectSlug}
        portfolioProjects={portfolioProjects}
        onSelectService={onSelectService}
        onSelectProject={onSelectProject}
        onHoverService={onHoverService}
        onHoverProject={onHoverProject}
        isDiving={isDiving}
      />
    </>
  );
}

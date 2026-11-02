'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ProjectTVConfig,
  DiveTargetConfig,
  DivePhase,
} from './stationsConfig';
import {
  getInterstellarCameraState,
  STATIONS_3D,
  CameraStateResult,
} from './InterstellarFlightPath';
import CosmicDeepSpace from './CosmicDeepSpace';
import CosmicSectorShowcase from './CosmicSectorShowcase';
import CosmicRiftTunnel from './CosmicRiftTunnel';

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

// ── CINEMATIC INTERSTELLAR FLIGHT CAMERA CONTROLLER ──
function InterstellarFlightCamera({
  scrollProgress,
  activeDiveTarget,
  divePhase = 'idle',
  onDiveReachedTarget,
  onFlightMetricsUpdate,
}: {
  scrollProgress: number;
  activeDiveTarget?: DiveTargetConfig | null;
  divePhase?: DivePhase;
  onDiveReachedTarget?: () => void;
  onFlightMetricsUpdate?: (flight: CameraStateResult) => void;
}) {
  const { camera, pointer, size } = useThree();
  const hasTriggeredDiveReached = useRef(false);
  const diveInitialized = useRef(false);
  const pullbackInitialized = useRef(false);
  const diveStartPos = useRef(new THREE.Vector3());
  const diveStartLookAt = useRef(new THREE.Vector3());
  const diveStartTime = useRef<number>(0);
  const pullbackStartTime = useRef<number>(0);

  // Scratch vectors for zero GC allocation in useFrame
  const currentLookAt = useRef(new THREE.Vector3(0, 0.2, 0));
  const scratchDivePos = useRef(new THREE.Vector3());
  const scratchDiveLookAt = useRef(new THREE.Vector3());
  const scratchNormalPos = useRef(new THREE.Vector3());
  const scratchNormalLookAt = useRef(new THREE.Vector3());
  const scratchTargetQuat = useRef(new THREE.Quaternion());
  const scratchUp = useRef(new THREE.Vector3(0, 1, 0));
  const scratchMatrix = useRef(new THREE.Matrix4());

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

  useFrame((_, delta) => {
    // 1. Calculate procedural interstellar flight transform
    const flight = getInterstellarCameraState(scrollProgress, pointer, isMobile);

    // Notify parent for star streak and cosmic rift alignment
    if (onFlightMetricsUpdate) {
      onFlightMetricsUpdate(flight);
    }

    // ── CASE 1: CINEMATIC DIVE ONTO 3D SCREEN ──
    if (divePhase === 'diving' && activeDiveTarget) {
      // Find active station world coordinates
      const st =
        STATIONS_3D.find((s) => s.id === activeDiveTarget.slug) ||
        STATIONS_3D[flight.activeStationIndex];
      const stPos = st.stationPosition;

      scratchDivePos.current.set(stPos[0], stPos[1] + 0.25, stPos[2] + 1.3);
      scratchDiveLookAt.current.set(stPos[0], stPos[1] + 0.25, stPos[2]);

      if (!diveInitialized.current) {
        diveStartPos.current.copy(camera.position);
        diveStartLookAt.current.copy(currentLookAt.current);
        diveStartTime.current = performance.now();
        diveInitialized.current = true;
      }

      const DIVE_DURATION = 1000;
      const elapsed = performance.now() - diveStartTime.current;
      const progress = Math.min(1, Math.max(0, elapsed / DIVE_DURATION));
      const ease = easeInOutCubic(progress);

      camera.position.lerpVectors(diveStartPos.current, scratchDivePos.current, ease);
      currentLookAt.current.lerpVectors(diveStartLookAt.current, scratchDiveLookAt.current, ease);
      camera.lookAt(currentLookAt.current);

      if (progress >= 1 && !hasTriggeredDiveReached.current) {
        hasTriggeredDiveReached.current = true;
        if (onDiveReachedTarget) {
          onDiveReachedTarget();
        }
      }
      return;
    }

    // ── CASE 2: HOLD CLOSEUP POSITION ON SCREEN ──
    if (divePhase === 'pullback_hold' && activeDiveTarget) {
      const st =
        STATIONS_3D.find((s) => s.id === activeDiveTarget.slug) ||
        STATIONS_3D[flight.activeStationIndex];
      const stPos = st.stationPosition;

      camera.position.set(stPos[0], stPos[1] + 0.25, stPos[2] + 1.3);
      currentLookAt.current.set(stPos[0], stPos[1] + 0.25, stPos[2]);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // ── CASE 3: REVERSE DIVE (CINEMATIC CAMERA PULLBACK) ──
    if (divePhase === 'pullback' && activeDiveTarget) {
      const st =
        STATIONS_3D.find((s) => s.id === activeDiveTarget.slug) ||
        STATIONS_3D[flight.activeStationIndex];
      const stPos = st.stationPosition;

      scratchDivePos.current.set(stPos[0], stPos[1] + 0.25, stPos[2] + 1.3);
      scratchDiveLookAt.current.set(stPos[0], stPos[1] + 0.25, stPos[2]);
      scratchNormalPos.current.set(stPos[0], stPos[1] + 0.2, stPos[2] + 4.2);
      scratchNormalLookAt.current.set(stPos[0], stPos[1] + 0.2, stPos[2]);

      if (!pullbackInitialized.current) {
        camera.position.copy(scratchDivePos.current);
        currentLookAt.current.copy(scratchDiveLookAt.current);
        camera.lookAt(currentLookAt.current);
        pullbackStartTime.current = performance.now();
        pullbackInitialized.current = true;
      }

      const PULLBACK_DURATION = 1000;
      const elapsed = performance.now() - pullbackStartTime.current;
      const progress = Math.min(1, Math.max(0, elapsed / PULLBACK_DURATION));
      const ease = easeInOutCubic(progress);

      camera.position.lerpVectors(scratchDivePos.current, scratchNormalPos.current, ease);
      currentLookAt.current.lerpVectors(scratchDiveLookAt.current, scratchNormalLookAt.current, ease);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // ── CASE 4: NORMAL INTERSTELLAR JOURNEY & REVERSIBLE SCROLL SCRUBBING ──
    // Apply procedural position and orientation directly
    if (flight.isTransitioning) {
      // During active flight: high precision direct tracking of spline & banking roll
      camera.position.copy(flight.position);
      camera.quaternion.copy(flight.quaternion);
      currentLookAt.current.copy(flight.lookAt);
    } else {
      // When dwelling at a station: smooth damping with interactive mouse parallax
      camera.position.lerp(flight.position, delta * 10);
      camera.quaternion.slerp(flight.quaternion, delta * 10);
      currentLookAt.current.lerp(flight.lookAt, delta * 10);
    }

    // Dynamic FOV expansion during hyper-speed flight
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = flight.fov;
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 10);
        camera.updateProjectionMatrix();
      }
    }
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

  // Live flight state for Cosmic Rift Tunnel & starfield streaks
  const flightStateRef = useRef<CameraStateResult>(
    getInterstellarCameraState(scrollProgress)
  );

  const handleFlightMetricsUpdate = (flight: CameraStateResult) => {
    flightStateRef.current = flight;
  };

  return (
    <>
      {/* Deep Cosmic Void Background & Atmospheric Space Fog */}
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 45, 680]} />

      {/* Cinematic Cosmic Rift Studio Lighting */}
      <ambientLight intensity={1.4} color="#E0F2FE" />
      <directionalLight position={[10, 20, 15]} intensity={2.6} color="#00f5ff" />
      <directionalLight position={[-10, 12, 10]} intensity={2.0} color="#7928ca" />
      <pointLight position={[0, 0, 0]} intensity={1.0} color="#ff0080" distance={80} />

      {/* Procedural Interstellar Flight Camera Controller */}
      <InterstellarFlightCamera
        scrollProgress={scrollProgress}
        activeDiveTarget={activeDiveTarget}
        divePhase={divePhase}
        onDiveReachedTarget={onDiveReachedTarget}
        onFlightMetricsUpdate={handleFlightMetricsUpdate}
      />

      {/* Signature 3D Cosmic Rift Space-Time Tunnel & Vortex */}
      <CosmicRiftTunnel
        cameraState={flightStateRef.current}
        scrollProgress={scrollProgress}
        isDiving={isDiving}
      />

      {/* Motion-Harmonized Deep Space Starfield & Directional Warp Streaks */}
      <CosmicDeepSpace
        scrollProgress={scrollProgress}
        activeSector={activeSector}
        cameraTangent={flightStateRef.current.tangent}
        warpIntensity={flightStateRef.current.warpIntensity}
        anticipationWeight={flightStateRef.current.anticipationWeight}
        collapseWeight={flightStateRef.current.collapseWeight}
        riftWeight={flightStateRef.current.riftWeight}
        revealWeight={flightStateRef.current.revealWeight}
      />

      {/* Photorealistic 3D Galactic Showcase at Distinct 3D Station Coordinates */}
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

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

// ── CHOREOGRAPHED CAMERA TRAJECTORY & DYNAMIC ITEM GAZE ──
// Each waypoint defines an exact scroll progress (t), camera position, and gaze lookAt target.
// When reaching an item, the camera turns to look directly at it.
// When traveling between sectors, the camera faces straight ahead down the central warp runway.

export interface ChoreographedWaypoint {
  t: number;
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export const CHOREOGRAPHED_CAMERA_WAYPOINTS: ChoreographedWaypoint[] = [
  // ── Sector 0: Grand Cosmic Welcome & Metallic 3D Logo ──
  { t: 0.0, pos: new THREE.Vector3(0, 4.3, 16.5), target: new THREE.Vector3(0, 3.4, 0.0) },
  { t: 0.16, pos: new THREE.Vector3(0, 4.3, 16.5), target: new THREE.Vector3(0, 3.4, 0.0) },
  { t: 0.18, pos: new THREE.Vector3(0, 2.4, -14.0), target: new THREE.Vector3(0, 2.0, -25.0) },

  // ── Sector 1: Services Concourse (5 Floating HQ Hero Models) ──
  // Station 1: Curved Monitor (Web Architecture - Left)
  { t: 0.22, pos: new THREE.Vector3(0.2, 2.2, -19.2), target: new THREE.Vector3(-2.2, 1.35, -22.0) },
  { t: 0.24, pos: new THREE.Vector3(0.2, 2.2, -19.2), target: new THREE.Vector3(-2.2, 1.35, -22.0) },
  // Station 2: iPhone 18 Pro Max (Content & Social - Right)
  { t: 0.27, pos: new THREE.Vector3(-0.2, 2.2, -24.2), target: new THREE.Vector3(2.2, 1.55, -27.0) },
  { t: 0.29, pos: new THREE.Vector3(-0.2, 2.2, -24.2), target: new THREE.Vector3(2.2, 1.55, -27.0) },
  // Station 3: Canon Retro Camera (Teaser & Video - Left)
  { t: 0.32, pos: new THREE.Vector3(0.2, 2.2, -29.2), target: new THREE.Vector3(-2.1, 1.3, -32.0) },
  { t: 0.34, pos: new THREE.Vector3(0.2, 2.2, -29.2), target: new THREE.Vector3(-2.1, 1.3, -32.0) },
  // Station 4: iPad Pro & Stylus (Branding & Identity - Right)
  { t: 0.37, pos: new THREE.Vector3(-0.2, 2.2, -34.2), target: new THREE.Vector3(2.2, 1.25, -37.0) },
  { t: 0.39, pos: new THREE.Vector3(-0.2, 2.2, -34.2), target: new THREE.Vector3(2.2, 1.25, -37.0) },
  // Station 5: Billboard (Outdoor Media - Left)
  { t: 0.42, pos: new THREE.Vector3(0.3, 2.4, -39.0), target: new THREE.Vector3(-2.6, 3.2, -43.0) },
  { t: 0.44, pos: new THREE.Vector3(0.3, 2.4, -39.0), target: new THREE.Vector3(-2.6, 3.2, -43.0) },

  // ── Inter-Sector Warp 1 -> 2: Straighten camera facing forward into Sector 2 ──
  { t: 0.47, pos: new THREE.Vector3(0, 2.4, -48.0), target: new THREE.Vector3(0, 2.0, -62.0) },

  // ── Sector 2: Masterworks Exhibition (Curved Displays & Case Studies) ──
  // Project 1: Araz Metal (Left)
  { t: 0.5, pos: new THREE.Vector3(0.2, 2.2, -52.5), target: new THREE.Vector3(-2.4, 1.45, -56.0) },
  { t: 0.52, pos: new THREE.Vector3(0.2, 2.2, -52.5), target: new THREE.Vector3(-2.4, 1.45, -56.0) },
  // Project 2: Dr Sadeghi (Right)
  { t: 0.54, pos: new THREE.Vector3(-0.2, 2.2, -59.5), target: new THREE.Vector3(2.4, 1.5, -63.0) },
  { t: 0.56, pos: new THREE.Vector3(-0.2, 2.2, -59.5), target: new THREE.Vector3(2.4, 1.5, -63.0) },
  // Project 3: Sepid Kooh (Left)
  { t: 0.58, pos: new THREE.Vector3(0.2, 2.2, -66.5), target: new THREE.Vector3(-2.4, 1.6, -70.0) },
  { t: 0.6, pos: new THREE.Vector3(0.2, 2.2, -66.5), target: new THREE.Vector3(-2.4, 1.6, -70.0) },
  // Project 4: Baran Leather (Right)
  { t: 0.62, pos: new THREE.Vector3(-0.2, 2.2, -73.5), target: new THREE.Vector3(2.4, 1.5, -77.0) },
  { t: 0.64, pos: new THREE.Vector3(-0.2, 2.2, -73.5), target: new THREE.Vector3(2.4, 1.5, -77.0) },

  // ── Inter-Sector Warp 2 -> 3: Straighten camera facing forward into Sector 3 ──
  { t: 0.67, pos: new THREE.Vector3(0, 2.4, -84.0), target: new THREE.Vector3(0, 2.0, -98.0) },

  // ── Sector 3: Collaboration Workflow (5 Sequential Milestones) ──
  // Step 1: Discovery & Research (Left)
  { t: 0.7, pos: new THREE.Vector3(0.2, 2.2, -90.5), target: new THREE.Vector3(-2.6, 1.5, -94.0) },
  { t: 0.73, pos: new THREE.Vector3(0.2, 2.2, -90.5), target: new THREE.Vector3(-2.6, 1.5, -94.0) },
  // Step 2: Architecture & UI/UX (Right)
  { t: 0.75, pos: new THREE.Vector3(-0.2, 2.2, -97.5), target: new THREE.Vector3(2.6, 1.5, -101.0) },
  { t: 0.78, pos: new THREE.Vector3(-0.2, 2.2, -97.5), target: new THREE.Vector3(2.6, 1.5, -101.0) },
  // Step 3: Production & Code (Left)
  { t: 0.8, pos: new THREE.Vector3(0.2, 2.2, -104.5), target: new THREE.Vector3(-2.6, 1.5, -108.0) },
  { t: 0.83, pos: new THREE.Vector3(0.2, 2.2, -104.5), target: new THREE.Vector3(-2.6, 1.5, -108.0) },
  // Step 4: Quality & Testing (Right)
  { t: 0.85, pos: new THREE.Vector3(-0.2, 2.2, -111.5), target: new THREE.Vector3(2.6, 1.5, -115.0) },
  { t: 0.88, pos: new THREE.Vector3(-0.2, 2.2, -111.5), target: new THREE.Vector3(2.6, 1.5, -115.0) },
  // Step 5: Launch & Scaling (Left)
  { t: 0.9, pos: new THREE.Vector3(0.2, 2.2, -118.5), target: new THREE.Vector3(-2.6, 1.5, -122.0) },
  { t: 0.93, pos: new THREE.Vector3(0.2, 2.2, -118.5), target: new THREE.Vector3(-2.6, 1.5, -122.0) },

  // ── Inter-Sector Warp 3 -> 4: Straighten camera facing forward into Executive Room ──
  { t: 0.94, pos: new THREE.Vector3(0, 2.4, -132.0), target: new THREE.Vector3(0, 2.0, -146.0) },

  // ── Sector 4: Executive Consultation & Reception (Room 4) ──
  // Executive Desk Phone & 24/7 Hotline (Left)
  { t: 0.955, pos: new THREE.Vector3(0.2, 2.2, -142.0), target: new THREE.Vector3(-2.8, 1.4, -146.0) },
  { t: 0.97, pos: new THREE.Vector3(0.2, 2.2, -142.0), target: new THREE.Vector3(-2.8, 1.4, -146.0) },
  // Strategic Consultation Station (Right)
  { t: 0.98, pos: new THREE.Vector3(-0.2, 2.2, -143.0), target: new THREE.Vector3(2.8, 1.4, -146.0) },
  { t: 0.992, pos: new THREE.Vector3(-0.2, 2.2, -143.0), target: new THREE.Vector3(2.8, 1.4, -146.0) },
  // Terminal Celestial Monolith & Brand Crest
  { t: 1.0, pos: new THREE.Vector3(0.0, 2.4, -148.5), target: new THREE.Vector3(0.0, 4.8, -165.0) },
];

export const MOBILE_CHOREOGRAPHED_CAMERA_WAYPOINTS: ChoreographedWaypoint[] = [
  // ── Sector 0: Welcome ──
  { t: 0.0, pos: new THREE.Vector3(0, 3.8, 16.5), target: new THREE.Vector3(0, 3.2, 0.0) },
  { t: 0.16, pos: new THREE.Vector3(0, 3.8, 16.5), target: new THREE.Vector3(0, 3.2, 0.0) },
  { t: 0.18, pos: new THREE.Vector3(0, 2.8, -13.0), target: new THREE.Vector3(0, 2.0, -25.0) },

  // ── Sector 1: Services ──
  { t: 0.22, pos: new THREE.Vector3(0.3, 2.5, -18.8), target: new THREE.Vector3(-2.2, 1.35, -22.0) },
  { t: 0.24, pos: new THREE.Vector3(0.3, 2.5, -18.8), target: new THREE.Vector3(-2.2, 1.35, -22.0) },
  { t: 0.27, pos: new THREE.Vector3(-0.3, 2.5, -23.8), target: new THREE.Vector3(2.2, 1.55, -27.0) },
  { t: 0.29, pos: new THREE.Vector3(-0.3, 2.5, -23.8), target: new THREE.Vector3(2.2, 1.55, -27.0) },
  { t: 0.32, pos: new THREE.Vector3(0.3, 2.5, -28.8), target: new THREE.Vector3(-2.1, 1.3, -32.0) },
  { t: 0.34, pos: new THREE.Vector3(0.3, 2.5, -28.8), target: new THREE.Vector3(-2.1, 1.3, -32.0) },
  { t: 0.37, pos: new THREE.Vector3(-0.3, 2.5, -33.8), target: new THREE.Vector3(2.2, 1.25, -37.0) },
  { t: 0.39, pos: new THREE.Vector3(-0.3, 2.5, -33.8), target: new THREE.Vector3(2.2, 1.25, -37.0) },
  { t: 0.42, pos: new THREE.Vector3(0.4, 2.7, -38.5), target: new THREE.Vector3(-2.6, 3.2, -43.0) },
  { t: 0.44, pos: new THREE.Vector3(0.4, 2.7, -38.5), target: new THREE.Vector3(-2.6, 3.2, -43.0) },

  // ── Inter-Sector Warp 1 -> 2 ──
  { t: 0.47, pos: new THREE.Vector3(0, 2.8, -48.0), target: new THREE.Vector3(0, 2.0, -62.0) },

  // ── Sector 2: Exhibition ──
  { t: 0.5, pos: new THREE.Vector3(0.3, 2.6, -52.0), target: new THREE.Vector3(-2.4, 1.45, -56.0) },
  { t: 0.52, pos: new THREE.Vector3(0.3, 2.6, -52.0), target: new THREE.Vector3(-2.4, 1.45, -56.0) },
  { t: 0.54, pos: new THREE.Vector3(-0.3, 2.6, -59.0), target: new THREE.Vector3(2.4, 1.5, -63.0) },
  { t: 0.56, pos: new THREE.Vector3(-0.3, 2.6, -59.0), target: new THREE.Vector3(2.4, 1.5, -63.0) },
  { t: 0.58, pos: new THREE.Vector3(0.3, 2.6, -66.0), target: new THREE.Vector3(-2.4, 1.6, -70.0) },
  { t: 0.6, pos: new THREE.Vector3(0.3, 2.6, -66.0), target: new THREE.Vector3(-2.4, 1.6, -70.0) },
  { t: 0.62, pos: new THREE.Vector3(-0.3, 2.6, -73.0), target: new THREE.Vector3(2.4, 1.5, -77.0) },
  { t: 0.64, pos: new THREE.Vector3(-0.3, 2.6, -73.0), target: new THREE.Vector3(2.4, 1.5, -77.0) },

  // ── Inter-Sector Warp 2 -> 3 ──
  { t: 0.67, pos: new THREE.Vector3(0, 2.8, -84.0), target: new THREE.Vector3(0, 2.0, -98.0) },

  // ── Sector 3: Workflow ──
  { t: 0.7, pos: new THREE.Vector3(0.3, 2.6, -90.0), target: new THREE.Vector3(-2.6, 1.5, -94.0) },
  { t: 0.73, pos: new THREE.Vector3(0.3, 2.6, -90.0), target: new THREE.Vector3(-2.6, 1.5, -94.0) },
  { t: 0.75, pos: new THREE.Vector3(-0.3, 2.6, -97.0), target: new THREE.Vector3(2.6, 1.5, -101.0) },
  { t: 0.78, pos: new THREE.Vector3(-0.3, 2.6, -97.0), target: new THREE.Vector3(2.6, 1.5, -101.0) },
  { t: 0.8, pos: new THREE.Vector3(0.3, 2.6, -104.0), target: new THREE.Vector3(-2.6, 1.5, -108.0) },
  { t: 0.83, pos: new THREE.Vector3(0.3, 2.6, -104.0), target: new THREE.Vector3(-2.6, 1.5, -108.0) },
  { t: 0.85, pos: new THREE.Vector3(-0.3, 2.6, -111.0), target: new THREE.Vector3(2.6, 1.5, -115.0) },
  { t: 0.88, pos: new THREE.Vector3(-0.3, 2.6, -111.0), target: new THREE.Vector3(2.6, 1.5, -115.0) },
  { t: 0.9, pos: new THREE.Vector3(0.3, 2.6, -118.0), target: new THREE.Vector3(-2.6, 1.5, -122.0) },
  { t: 0.93, pos: new THREE.Vector3(0.3, 2.6, -118.0), target: new THREE.Vector3(-2.6, 1.5, -122.0) },

  // ── Inter-Sector Warp 3 -> 4 ──
  { t: 0.94, pos: new THREE.Vector3(0, 2.8, -132.0), target: new THREE.Vector3(0, 2.0, -146.0) },

  // ── Sector 4: Executive ──
  { t: 0.955, pos: new THREE.Vector3(0.3, 2.6, -141.5), target: new THREE.Vector3(-2.8, 1.4, -146.0) },
  { t: 0.97, pos: new THREE.Vector3(0.3, 2.6, -141.5), target: new THREE.Vector3(-2.8, 1.4, -146.0) },
  { t: 0.98, pos: new THREE.Vector3(-0.3, 2.6, -142.5), target: new THREE.Vector3(2.8, 1.4, -146.0) },
  { t: 0.992, pos: new THREE.Vector3(-0.3, 2.6, -142.5), target: new THREE.Vector3(2.8, 1.4, -146.0) },
  { t: 1.0, pos: new THREE.Vector3(0.0, 2.8, -147.5), target: new THREE.Vector3(0.0, 4.8, -165.0) },
];

const _splinePos = new THREE.Vector3();
const _splineTarget = new THREE.Vector3();

function getSplinePoint(t: number, isMobile: boolean): { pos: THREE.Vector3; target: THREE.Vector3 } {
  const waypoints = isMobile ? MOBILE_CHOREOGRAPHED_CAMERA_WAYPOINTS : CHOREOGRAPHED_CAMERA_WAYPOINTS;

  if (t <= waypoints[0].t) {
    _splinePos.copy(waypoints[0].pos);
    _splineTarget.copy(waypoints[0].target);
    return { pos: _splinePos, target: _splineTarget };
  }

  const last = waypoints[waypoints.length - 1];
  if (t >= last.t) {
    _splinePos.copy(last.pos);
    _splineTarget.copy(last.target);
    return { pos: _splinePos, target: _splineTarget };
  }

  // Find active segment [i, i + 1]
  let i = 0;
  for (let idx = 0; idx < waypoints.length - 1; idx++) {
    if (t >= waypoints[idx].t && t <= waypoints[idx + 1].t) {
      i = idx;
      break;
    }
  }

  const pA = waypoints[i];
  const pB = waypoints[i + 1];
  const span = pB.t - pA.t;
  const fraction = span > 0 ? (t - pA.t) / span : 0;

  // Ken Perlin's Smootherstep curve for stabilized reading plateaus
  const smooth = fraction * fraction * fraction * (fraction * (fraction * 6 - 15) + 10);

  _splinePos.lerpVectors(pA.pos, pB.pos, smooth);
  _splineTarget.lerpVectors(pA.target, pB.target, smooth);

  return { pos: _splinePos, target: _splineTarget };
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ── SMOOTH SCROLL CAMERA CONTROLLER WITH DIVE TRANSITION SUPPORT ──
function SmoothScrollCamera({
  scrollProgress,
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
  const currentTarget = useRef(new THREE.Vector3(0, 2, 0));
  const hasTriggeredDiveReached = useRef(false);
  const diveInitialized = useRef(false);
  const pullbackInitialized = useRef(false);
  const diveStartPos = useRef(new THREE.Vector3());
  const diveStartLookAt = useRef(new THREE.Vector3());
  const diveStartTime = useRef<number>(0);
  const pullbackStartTime = useRef<number>(0);
  const desiredPosRef = useRef(new THREE.Vector3());
  const scratchDivePos = useRef(new THREE.Vector3());
  const scratchDiveLookAt = useRef(new THREE.Vector3());
  const scratchNormalPos = useRef(new THREE.Vector3());
  const scratchNormalLookAt = useRef(new THREE.Vector3());
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

  // Responsive FOV adjustment on narrow portrait viewports
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const targetFov = aspect < 0.55 ? 62 : aspect < 0.75 ? 56 : aspect < 1.0 ? 50 : 45;
    if (camera.fov !== targetFov) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, aspect]);

  useFrame((_, delta) => {
    // ── 1. CINEMATIC CAMERA DIVE ONTO 3D SCREEN / PAPER ──
    if (divePhase === 'diving' && activeDiveTarget) {
      if (!diveInitialized.current) {
        diveStartPos.current.copy(camera.position);
        diveStartLookAt.current.copy(currentTarget.current);
        diveStartTime.current = performance.now();
        diveInitialized.current = true;
      }

      const DIVE_DURATION = 1150;
      const elapsed = performance.now() - diveStartTime.current;
      const progress = Math.min(1, Math.max(0, elapsed / DIVE_DURATION));
      const ease = easeInOutCubic(progress);

      scratchDivePos.current.set(...activeDiveTarget.camPosition);
      scratchDiveLookAt.current.set(...activeDiveTarget.camLookAt);

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
      camera.position.set(...activeDiveTarget.camPosition);
      currentTarget.current.set(...activeDiveTarget.camLookAt);
      camera.lookAt(currentTarget.current);
      return;
    }

    // ── 3. REVERSE DIVE: CINEMATIC CAMERA PULLBACK ──
    if (divePhase === 'pullback' && activeDiveTarget) {
      if (!pullbackInitialized.current) {
        camera.position.set(...activeDiveTarget.camPosition);
        currentTarget.current.set(...activeDiveTarget.camLookAt);
        camera.lookAt(currentTarget.current);
        pullbackStartTime.current = performance.now();
        pullbackInitialized.current = true;
      }

      const PULLBACK_DURATION = 1150;
      const elapsed = performance.now() - pullbackStartTime.current;
      const progress = Math.min(1, Math.max(0, elapsed / PULLBACK_DURATION));
      const ease = easeInOutCubic(progress);

      scratchNormalPos.current.set(...activeDiveTarget.startPosition);
      scratchNormalLookAt.current.set(...activeDiveTarget.startLookAt);
      scratchDivePos.current.set(...activeDiveTarget.camPosition);
      scratchDiveLookAt.current.set(...activeDiveTarget.camLookAt);

      camera.position.lerpVectors(scratchDivePos.current, scratchNormalPos.current, ease);
      currentTarget.current.lerpVectors(scratchDiveLookAt.current, scratchNormalLookAt.current, ease);
      camera.lookAt(currentTarget.current);
      return;
    }

    // ── 4. STANDARD CENTERLINE SPLINE TRACKING WITH SMOOTH EASING ──
    const { pos, target } = getSplinePoint(scrollProgress, isMobile);

    const parallaxMult = isMobile ? 0.2 : 0.65;
    const parallaxX = pointer.x * parallaxMult;
    const parallaxY = pointer.y * (parallaxMult * 0.55);

    desiredPosRef.current.set(
      pos.x + parallaxX,
      pos.y + parallaxY,
      pos.z
    );

    const dampSpeed = divePhase === 'staging' ? 0.26 : 0.42;
    easing.damp3(camera.position, desiredPosRef.current, dampSpeed, delta);
    easing.damp3(currentTarget.current, target, dampSpeed, delta);

    camera.lookAt(currentTarget.current);
  });

  return null;
}

// ── MASTER DIGITAL CAMPUS EXPORT (COSMIC SPACE EXPERIENCE) ──
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
      {/* Deep Cosmic Void Background & Atmospheric Horizon Fog */}
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 45, 190]} />

      {/* Cinematic Deep Space Lighting Setup */}
      <ambientLight intensity={1.1} color="#E0F2FE" />
      <directionalLight position={[15, 25, 15]} intensity={2.2} color="#F0FDF4" />
      <directionalLight position={[-15, 20, -35]} intensity={1.5} color="#38BDF8" />
      <pointLight position={[0, 4, 0]} intensity={2.0} distance={25} color="#10B981" />
      <pointLight position={[-2, 4, -28]} intensity={1.8} distance={30} color="#5EEAD4" />
      <pointLight position={[0, 4, -68]} intensity={1.8} distance={35} color="#38BDF8" />
      <pointLight position={[0, 4, -146]} intensity={2.2} distance={30} color="#10B981" />

      {/* Dynamic Camera Trajectory & Gaze Orientation */}
      <SmoothScrollCamera
        scrollProgress={scrollProgress}
        activeDiveTarget={activeDiveTarget}
        divePhase={divePhase}
        onDiveReachedTarget={onDiveReachedTarget}
      />

      {/* Cosmic Deep Space Environment: Starfield, Hyper-Speed Warp Streaks, Nebulae & Gateways */}
      <CosmicDeepSpace scrollProgress={scrollProgress} activeSector={activeSector} />

      {/* Photorealistic Compressed 3D Models Showcase (Draco Decoded, 60fps) */}
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

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

// ── CINEMATIC 3D GALACTIC TRAJECTORY & HYPER-SPACE WARP WAYPOINTS ──
// Each station is situated in a distinct celestial quadrant of deep space.
// Between stations, the camera performs sweeping 3D orbital curves with dynamic banking and FOV acceleration.

export interface ChoreographedWaypoint {
  t: number;
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export const CHOREOGRAPHED_CAMERA_WAYPOINTS: ChoreographedWaypoint[] = [
  // ── Sector 0: Grand Cosmic Welcome & Metallic Logo Core (Z = 0) ──
  { t: 0.0, pos: new THREE.Vector3(0, 3.2, 7.5), target: new THREE.Vector3(0, 2.0, 0.0) },
  { t: 0.16, pos: new THREE.Vector3(0, 3.2, 7.5), target: new THREE.Vector3(0, 2.0, 0.0) },
  // Hyperspace Warp Launch toward Station 1.1 (Up-Left Arc)
  { t: 0.19, pos: new THREE.Vector3(-5.0, 5.0, -18.0), target: new THREE.Vector3(-10.0, 6.5, -35.0) },

  // ── Sector 1: Services Constellation (5 Distinct Cosmic Quadrants) ──
  // Station 1.1: Web Design (Curved OLED Display - Upper-Left Sapphire Nebula)
  { t: 0.22, pos: new THREE.Vector3(-10.2, 7.4, -36.5), target: new THREE.Vector3(-12.0, 7.0, -40.0) },
  { t: 0.24, pos: new THREE.Vector3(-10.2, 7.4, -36.5), target: new THREE.Vector3(-12.0, 7.0, -40.0) },
  // Hyperspace Warp Jump: Cross-galaxy swoop down-right toward Station 1.2
  { t: 0.255, pos: new THREE.Vector3(2.0, 1.0, -60.0), target: new THREE.Vector3(15.0, -5.5, -85.0) },

  // Station 1.2: Content & Social (Titanium iPhone 18 Pro Max - Lower-Right Crimson Sector)
  { t: 0.27, pos: new THREE.Vector3(13.4, -5.0, -81.5), target: new THREE.Vector3(15.0, -5.5, -85.0) },
  { t: 0.29, pos: new THREE.Vector3(13.4, -5.0, -81.5), target: new THREE.Vector3(15.0, -5.5, -85.0) },
  // Hyperspace Warp Jump: Down-left deep dive toward Station 1.3
  { t: 0.305, pos: new THREE.Vector3(-1.0, -7.0, -108.0), target: new THREE.Vector3(-16.0, -7.0, -130.0) },

  // Station 1.3: Cinema Video & Teasers (Canon Retro Camera - Deep-Left Solar Crater)
  { t: 0.32, pos: new THREE.Vector3(-14.4, -6.5, -126.5), target: new THREE.Vector3(-16.0, -7.0, -130.0) },
  { t: 0.34, pos: new THREE.Vector3(-14.4, -6.5, -126.5), target: new THREE.Vector3(-16.0, -7.0, -130.0) },
  // Hyperspace Warp Jump: Upward climb toward Station 1.4
  { t: 0.355, pos: new THREE.Vector3(0.0, 2.0, -152.0), target: new THREE.Vector3(14.0, 11.0, -175.0) },

  // Station 1.4: Branding & Identity (iPad Pro & Stylus - Zenith Starfield)
  { t: 0.37, pos: new THREE.Vector3(12.4, 11.4, -171.5), target: new THREE.Vector3(14.0, 11.0, -175.0) },
  { t: 0.39, pos: new THREE.Vector3(12.4, 11.4, -171.5), target: new THREE.Vector3(14.0, 11.0, -175.0) },
  // Hyperspace Warp Jump: Arc toward Station 1.5
  { t: 0.405, pos: new THREE.Vector3(2.0, 9.0, -198.0), target: new THREE.Vector3(-8.0, 6.0, -220.0) },

  // Station 1.5: Billboard & City Media (Floating Space Monolith)
  { t: 0.42, pos: new THREE.Vector3(-6.4, 6.5, -216.0), target: new THREE.Vector3(-8.0, 6.0, -220.0) },
  { t: 0.44, pos: new THREE.Vector3(-6.4, 6.5, -216.0), target: new THREE.Vector3(-8.0, 6.0, -220.0) },

  // ── Inter-Sector Warp 1 -> 2: Deep space acceleration into Masterworks Nebula ──
  { t: 0.47, pos: new THREE.Vector3(5.0, -1.0, -248.0), target: new THREE.Vector3(18.0, -8.0, -275.0) },

  // ── Sector 2: Masterworks Exhibition (4 Constellations Across the Nebula) ──
  // Project 2.1: Araz Metal Industrial Portal
  { t: 0.5, pos: new THREE.Vector3(16.2, -7.5, -271.0), target: new THREE.Vector3(18.0, -8.0, -275.0) },
  { t: 0.52, pos: new THREE.Vector3(16.2, -7.5, -271.0), target: new THREE.Vector3(18.0, -8.0, -275.0) },
  // Warp Jump to Project 2.2
  { t: 0.53, pos: new THREE.Vector3(0.0, 2.0, -302.0), target: new THREE.Vector3(-18.0, 12.0, -330.0) },

  // Project 2.2: Dr. Sadeghi Medical Branding
  { t: 0.54, pos: new THREE.Vector3(-16.2, 11.5, -326.0), target: new THREE.Vector3(-18.0, 12.0, -330.0) },
  { t: 0.56, pos: new THREE.Vector3(-16.2, 11.5, -326.0), target: new THREE.Vector3(-18.0, 12.0, -330.0) },
  // Warp Jump to Project 2.3
  { t: 0.57, pos: new THREE.Vector3(-1.0, 14.0, -358.0), target: new THREE.Vector3(15.0, 14.0, -385.0) },

  // Project 2.3: Sepid Kooh Outdoor Campaign
  { t: 0.58, pos: new THREE.Vector3(13.2, 13.5, -381.0), target: new THREE.Vector3(15.0, 14.0, -385.0) },
  { t: 0.6, pos: new THREE.Vector3(13.2, 13.5, -381.0), target: new THREE.Vector3(15.0, 14.0, -385.0) },
  // Warp Jump to Project 2.4
  { t: 0.61, pos: new THREE.Vector3(-1.0, 0.0, -412.0), target: new THREE.Vector3(-16.0, -12.0, -440.0) },

  // Project 2.4: Baran Leather E-Commerce
  { t: 0.62, pos: new THREE.Vector3(-14.2, -11.5, -436.0), target: new THREE.Vector3(-16.0, -12.0, -440.0) },
  { t: 0.64, pos: new THREE.Vector3(-14.2, -11.5, -436.0), target: new THREE.Vector3(-16.0, -12.0, -440.0) },

  // ── Inter-Sector Warp 2 -> 3: Entering Collaboration Orbital Chain ──
  { t: 0.67, pos: new THREE.Vector3(-2.0, -1.0, -470.0), target: new THREE.Vector3(12.0, 9.0, -500.0) },

  // ── Sector 3: Collaboration Hyper-Trajectory (5 Orbital Waypoints) ──
  // Step 3.1: Discovery & Strategy (Realistic Executive Clipboard)
  { t: 0.7, pos: new THREE.Vector3(10.4, 9.4, -496.0), target: new THREE.Vector3(12.0, 9.0, -500.0) },
  { t: 0.73, pos: new THREE.Vector3(10.4, 9.4, -496.0), target: new THREE.Vector3(12.0, 9.0, -500.0) },
  // Warp to Step 3.2
  { t: 0.74, pos: new THREE.Vector3(-1.0, 8.0, -528.0), target: new THREE.Vector3(-14.0, 5.0, -555.0) },

  // Step 3.2: Architecture & UI/UX (Quantum Beacon 1)
  { t: 0.75, pos: new THREE.Vector3(-12.4, 5.4, -551.0), target: new THREE.Vector3(-14.0, 5.0, -555.0) },
  { t: 0.78, pos: new THREE.Vector3(-12.4, 5.4, -551.0), target: new THREE.Vector3(-14.0, 5.0, -555.0) },
  // Warp to Step 3.3
  { t: 0.79, pos: new THREE.Vector3(-2.0, -4.0, -582.0), target: new THREE.Vector3(10.0, -12.0, -610.0) },

  // Step 3.3: Production & Development (Quantum Beacon 2)
  { t: 0.8, pos: new THREE.Vector3(8.4, -11.5, -606.0), target: new THREE.Vector3(10.0, -12.0, -610.0) },
  { t: 0.83, pos: new THREE.Vector3(8.4, -11.5, -606.0), target: new THREE.Vector3(10.0, -12.0, -610.0) },
  // Warp to Step 3.4
  { t: 0.84, pos: new THREE.Vector3(-1.0, -12.0, -638.0), target: new THREE.Vector3(-12.0, -10.0, -665.0) },

  // Step 3.4: Quality & Testing (Quantum Beacon 3)
  { t: 0.85, pos: new THREE.Vector3(-10.4, -9.5, -661.0), target: new THREE.Vector3(-12.0, -10.0, -665.0) },
  { t: 0.88, pos: new THREE.Vector3(-10.4, -9.5, -661.0), target: new THREE.Vector3(-12.0, -10.0, -665.0) },
  // Warp to Step 3.5
  { t: 0.89, pos: new THREE.Vector3(1.0, -1.0, -692.0), target: new THREE.Vector3(14.0, 7.0, -720.0) },

  // Step 3.5: Launch & Support (Quantum Beacon 4)
  { t: 0.9, pos: new THREE.Vector3(12.4, 7.4, -716.0), target: new THREE.Vector3(14.0, 7.0, -720.0) },
  { t: 0.93, pos: new THREE.Vector3(12.4, 7.4, -716.0), target: new THREE.Vector3(14.0, 7.0, -720.0) },

  // ── Inter-Sector Warp 3 -> 4: Hyper-drive approach to Galactic Core ──
  { t: 0.94, pos: new THREE.Vector3(7.0, 5.0, -750.0), target: new THREE.Vector3(0.0, 3.0, -780.0) },

  // ── Sector 4: Executive Command Nexus & Consultation Portal ──
  { t: 0.955, pos: new THREE.Vector3(0.0, 3.4, -772.0), target: new THREE.Vector3(0.0, 3.0, -780.0) },
  { t: 0.995, pos: new THREE.Vector3(0.0, 3.4, -772.0), target: new THREE.Vector3(0.0, 3.0, -780.0) },
  // Final Celestial Infinity Landmark
  { t: 1.0, pos: new THREE.Vector3(0.0, 3.6, -776.0), target: new THREE.Vector3(0.0, 5.0, -792.0) },
];

export const MOBILE_CHOREOGRAPHED_CAMERA_WAYPOINTS: ChoreographedWaypoint[] = [
  // ── Sector 0 ──
  { t: 0.0, pos: new THREE.Vector3(0, 3.5, 8.5), target: new THREE.Vector3(0, 2.0, 0.0) },
  { t: 0.16, pos: new THREE.Vector3(0, 3.5, 8.5), target: new THREE.Vector3(0, 2.0, 0.0) },
  { t: 0.19, pos: new THREE.Vector3(-4.5, 5.5, -18.0), target: new THREE.Vector3(-10.0, 6.5, -35.0) },

  // ── Sector 1 ──
  { t: 0.22, pos: new THREE.Vector3(-9.8, 7.8, -35.5), target: new THREE.Vector3(-12.0, 7.0, -40.0) },
  { t: 0.24, pos: new THREE.Vector3(-9.8, 7.8, -35.5), target: new THREE.Vector3(-12.0, 7.0, -40.0) },
  { t: 0.255, pos: new THREE.Vector3(2.5, 1.5, -60.0), target: new THREE.Vector3(15.0, -5.5, -85.0) },

  { t: 0.27, pos: new THREE.Vector3(13.0, -4.6, -80.5), target: new THREE.Vector3(15.0, -5.5, -85.0) },
  { t: 0.29, pos: new THREE.Vector3(13.0, -4.6, -80.5), target: new THREE.Vector3(15.0, -5.5, -85.0) },
  { t: 0.305, pos: new THREE.Vector3(-0.5, -6.5, -108.0), target: new THREE.Vector3(-16.0, -7.0, -130.0) },

  { t: 0.32, pos: new THREE.Vector3(-14.0, -6.1, -125.5), target: new THREE.Vector3(-16.0, -7.0, -130.0) },
  { t: 0.34, pos: new THREE.Vector3(-14.0, -6.1, -125.5), target: new THREE.Vector3(-16.0, -7.0, -130.0) },
  { t: 0.355, pos: new THREE.Vector3(0.5, 2.5, -152.0), target: new THREE.Vector3(14.0, 11.0, -175.0) },

  { t: 0.37, pos: new THREE.Vector3(12.0, 11.8, -170.5), target: new THREE.Vector3(14.0, 11.0, -175.0) },
  { t: 0.39, pos: new THREE.Vector3(12.0, 11.8, -170.5), target: new THREE.Vector3(14.0, 11.0, -175.0) },
  { t: 0.405, pos: new THREE.Vector3(2.5, 9.5, -198.0), target: new THREE.Vector3(-8.0, 6.0, -220.0) },

  { t: 0.42, pos: new THREE.Vector3(-6.0, 6.9, -215.0), target: new THREE.Vector3(-8.0, 6.0, -220.0) },
  { t: 0.44, pos: new THREE.Vector3(-6.0, 6.9, -215.0), target: new THREE.Vector3(-8.0, 6.0, -220.0) },

  // ── Inter-Sector Warp 1 -> 2 ──
  { t: 0.47, pos: new THREE.Vector3(5.5, -0.5, -248.0), target: new THREE.Vector3(18.0, -8.0, -275.0) },

  // ── Sector 2 ──
  { t: 0.5, pos: new THREE.Vector3(15.8, -7.1, -270.0), target: new THREE.Vector3(18.0, -8.0, -275.0) },
  { t: 0.52, pos: new THREE.Vector3(15.8, -7.1, -270.0), target: new THREE.Vector3(18.0, -8.0, -275.0) },
  { t: 0.53, pos: new THREE.Vector3(0.5, 2.5, -302.0), target: new THREE.Vector3(-18.0, 12.0, -330.0) },

  { t: 0.54, pos: new THREE.Vector3(-15.8, 11.9, -325.0), target: new THREE.Vector3(-18.0, 12.0, -330.0) },
  { t: 0.56, pos: new THREE.Vector3(-15.8, 11.9, -325.0), target: new THREE.Vector3(-18.0, 12.0, -330.0) },
  { t: 0.57, pos: new THREE.Vector3(-0.5, 14.5, -358.0), target: new THREE.Vector3(15.0, 14.0, -385.0) },

  { t: 0.58, pos: new THREE.Vector3(12.8, 13.9, -380.0), target: new THREE.Vector3(15.0, 14.0, -385.0) },
  { t: 0.6, pos: new THREE.Vector3(12.8, 13.9, -380.0), target: new THREE.Vector3(15.0, 14.0, -385.0) },
  { t: 0.61, pos: new THREE.Vector3(-0.5, 0.5, -412.0), target: new THREE.Vector3(-16.0, -12.0, -440.0) },

  { t: 0.62, pos: new THREE.Vector3(-13.8, -11.1, -435.0), target: new THREE.Vector3(-16.0, -12.0, -440.0) },
  { t: 0.64, pos: new THREE.Vector3(-13.8, -11.1, -435.0), target: new THREE.Vector3(-16.0, -12.0, -440.0) },

  // ── Inter-Sector Warp 2 -> 3 ──
  { t: 0.67, pos: new THREE.Vector3(-1.5, -0.5, -470.0), target: new THREE.Vector3(12.0, 9.0, -500.0) },

  // ── Sector 3 ──
  { t: 0.7, pos: new THREE.Vector3(10.0, 9.8, -495.0), target: new THREE.Vector3(12.0, 9.0, -500.0) },
  { t: 0.73, pos: new THREE.Vector3(10.0, 9.8, -495.0), target: new THREE.Vector3(12.0, 9.0, -500.0) },
  { t: 0.74, pos: new THREE.Vector3(-0.5, 8.5, -528.0), target: new THREE.Vector3(-14.0, 5.0, -555.0) },

  { t: 0.75, pos: new THREE.Vector3(-12.0, 5.8, -550.0), target: new THREE.Vector3(-14.0, 5.0, -555.0) },
  { t: 0.78, pos: new THREE.Vector3(-12.0, 5.8, -550.0), target: new THREE.Vector3(-14.0, 5.0, -555.0) },
  { t: 0.79, pos: new THREE.Vector3(-1.5, -3.5, -582.0), target: new THREE.Vector3(10.0, -12.0, -610.0) },

  { t: 0.8, pos: new THREE.Vector3(8.0, -11.1, -605.0), target: new THREE.Vector3(10.0, -12.0, -610.0) },
  { t: 0.83, pos: new THREE.Vector3(8.0, -11.1, -605.0), target: new THREE.Vector3(10.0, -12.0, -610.0) },
  { t: 0.84, pos: new THREE.Vector3(-0.5, -11.5, -638.0), target: new THREE.Vector3(-12.0, -10.0, -665.0) },

  { t: 0.85, pos: new THREE.Vector3(-10.0, -9.1, -660.0), target: new THREE.Vector3(-12.0, -10.0, -665.0) },
  { t: 0.88, pos: new THREE.Vector3(-10.0, -9.1, -660.0), target: new THREE.Vector3(-12.0, -10.0, -665.0) },
  { t: 0.89, pos: new THREE.Vector3(1.5, -0.5, -692.0), target: new THREE.Vector3(14.0, 7.0, -720.0) },

  { t: 0.9, pos: new THREE.Vector3(12.0, 7.8, -715.0), target: new THREE.Vector3(14.0, 7.0, -720.0) },
  { t: 0.93, pos: new THREE.Vector3(12.0, 7.8, -715.0), target: new THREE.Vector3(14.0, 7.0, -720.0) },

  // ── Inter-Sector Warp 3 -> 4 ──
  { t: 0.94, pos: new THREE.Vector3(7.5, 5.5, -750.0), target: new THREE.Vector3(0.0, 3.0, -780.0) },

  // ── Sector 4 ──
  { t: 0.955, pos: new THREE.Vector3(0.0, 3.8, -770.0), target: new THREE.Vector3(0.0, 3.0, -780.0) },
  { t: 0.995, pos: new THREE.Vector3(0.0, 3.8, -770.0), target: new THREE.Vector3(0.0, 3.0, -780.0) },
  { t: 1.0, pos: new THREE.Vector3(0.0, 4.0, -774.0), target: new THREE.Vector3(0.0, 5.0, -792.0) },
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

  // Ken Perlin's Smootherstep curve for stabilized reading plateaus and sweeping warp arcs
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

  // Responsive FOV adjustment on portrait viewports
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const targetFov = aspect < 0.55 ? 60 : aspect < 0.75 ? 54 : aspect < 1.0 ? 49 : 45;
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

    // ── 4. 3D GALACTIC TRAJECTORY TRACKING WITH SMOOTH DAMPING & PARALLAX ──
    const { pos, target } = getSplinePoint(scrollProgress, isMobile);

    const parallaxMult = isMobile ? 0.18 : 0.6;
    const parallaxX = pointer.x * parallaxMult;
    const parallaxY = pointer.y * (parallaxMult * 0.5);

    desiredPosRef.current.set(
      pos.x + parallaxX,
      pos.y + parallaxY,
      pos.z
    );

    const dampSpeed = divePhase === 'staging' ? 0.24 : 0.38;
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
      <fog attach="fog" args={['#030712', 60, 260]} />

      {/* Cinematic Deep Space Lighting Setup */}
      <ambientLight intensity={1.2} color="#E0F2FE" />
      <directionalLight position={[25, 35, 15]} intensity={2.2} color="#F0FDF4" />
      <directionalLight position={[-25, 25, -60]} intensity={1.5} color="#38BDF8" />
      <pointLight position={[0, 4, 0]} intensity={2.0} distance={30} color="#10B981" />
      <pointLight position={[-12, 8, -40]} intensity={2.2} distance={35} color="#38BDF8" />
      <pointLight position={[15, -5, -85]} intensity={2.2} distance={35} color="#C084FC" />
      <pointLight position={[-16, -6, -130]} intensity={2.2} distance={35} color="#FBBF24" />
      <pointLight position={[14, 12, -175]} intensity={2.2} distance={35} color="#34D399" />
      <pointLight position={[0, 4, -780]} intensity={2.5} distance={45} color="#10B981" />

      {/* Dynamic Camera Trajectory & Gaze Orientation */}
      <SmoothScrollCamera
        scrollProgress={scrollProgress}
        activeDiveTarget={activeDiveTarget}
        divePhase={divePhase}
        onDiveReachedTarget={onDiveReachedTarget}
      />

      {/* Cosmic Deep Space Environment: Starfield, Hyper-Speed Warp Streaks, Nebulae & Gateways */}
      <CosmicDeepSpace scrollProgress={scrollProgress} activeSector={activeSector} />

      {/* Photorealistic Compressed 3D Models Showcase in 3D Galaxy (Draco Decoded, 60fps) */}
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

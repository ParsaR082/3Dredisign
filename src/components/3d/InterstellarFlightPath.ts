'use client';

import * as THREE from 'three';

// ── EXACT STATION RESTING PROGRESS WAYPOINTS [0 to 1] ──
export const STATION_WAYPOINTS: number[] = [
  0.00, // 0: Welcome Nexus & 3D Logo Core
  0.10, // 1: Web Architecture (Curved OLED Display)
  0.19, // 2: Content & Social (Titanium iPhone 18 Pro Max)
  0.28, // 3: Cinema Video & Teaser (Canon Retro Camera)
  0.37, // 4: Branding & Identity (iPad Pro & Pencil)
  0.46, // 5: Billboard & Outdoor Media (LED Monolith)
  0.55, // 6: Project 1: Araz Metal Portal
  0.64, // 7: Project 2: Dr. Sadeghi Medical Campaign
  0.73, // 8: Project 3: Sepid Kooh Outdoor Media
  0.82, // 9: Project 4: Baran Leather E-Commerce
  0.91, // 10: Collaboration Workflow (4 Development Stages)
  1.00, // 11: Executive Consultation Lounge & Direct Phone
];

// ── STATION DEFINITIONS IN 3D GALACTIC SPACE ──
export interface StationPoint {
  id: string;
  name: string;
  sectorIndex: number;
  waypointProgress: number;
  // Coordinates in galactic 3D space
  stationPosition: [number, number, number];
  cameraOffset: [number, number, number];
  lookAtOffset: [number, number, number];
  targetFov?: number;
}

export const STATIONS_3D: StationPoint[] = [
  // ── Sector 0: Galactic Nexus / Entrance Logo ──
  {
    id: 'welcome',
    name: 'پردیس معماری دیجیتال اروم‌سیما',
    sectorIndex: 0,
    waypointProgress: STATION_WAYPOINTS[0],
    stationPosition: [0, 0, 0],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },

  // ── Sector 1: Services (5 Stations) ──
  {
    id: 'web-design',
    name: 'طراحی و معماری وب‌سایت',
    sectorIndex: 1,
    waypointProgress: STATION_WAYPOINTS[1],
    stationPosition: [-42, 16, -75],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
  {
    id: 'instagram-content',
    name: 'تولید محتوا و اینستاگرام',
    sectorIndex: 1,
    waypointProgress: STATION_WAYPOINTS[2],
    stationPosition: [48, -14, -155],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
  {
    id: 'video-teaser',
    name: 'تیزر تبلیغاتی و فیلمبرداری',
    sectorIndex: 1,
    waypointProgress: STATION_WAYPOINTS[3],
    stationPosition: [-52, -24, -240],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
  {
    id: 'branding-identity',
    name: 'طراحی لوگو و برندینگ',
    sectorIndex: 1,
    waypointProgress: STATION_WAYPOINTS[4],
    stationPosition: [42, 22, -325],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
  {
    id: 'billboard-advertising',
    name: 'بیلبورد و تبلیغات محیطی',
    sectorIndex: 1,
    waypointProgress: STATION_WAYPOINTS[5],
    stationPosition: [-30, 8, -410],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },

  // ── Sector 2: Masterworks Exhibition (4 Projects) ──
  {
    id: 'araz-metal',
    name: 'پورتال آراز متال',
    sectorIndex: 2,
    waypointProgress: STATION_WAYPOINTS[6],
    stationPosition: [45, -10, -495],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
  {
    id: 'dr-sadeghi',
    name: 'کمپین دکتر صادقی',
    sectorIndex: 2,
    waypointProgress: STATION_WAYPOINTS[7],
    stationPosition: [-38, 20, -580],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
  {
    id: 'sepid-kooh',
    name: 'کمپین سپید کوه',
    sectorIndex: 2,
    waypointProgress: STATION_WAYPOINTS[8],
    stationPosition: [40, 10, -665],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
  {
    id: 'baran-leather',
    name: 'فروشگاه چرم باران',
    sectorIndex: 2,
    waypointProgress: STATION_WAYPOINTS[9],
    stationPosition: [-44, -16, -750],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },

  // ── Sector 3: Collaboration Workflow (4 Steps) ──
  {
    id: 'workflow',
    name: 'فرآیند همکاری و توسعه',
    sectorIndex: 3,
    waypointProgress: STATION_WAYPOINTS[10],
    stationPosition: [26, -22, -840],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },

  // ── Sector 4: Executive Consultation Lounge & Direct Reception Phone ──
  {
    id: 'executive',
    name: 'پایانه مشاوره و تماس مستقیم مدیریت',
    sectorIndex: 4,
    waypointProgress: STATION_WAYPOINTS[11],
    stationPosition: [0, 4, -940],
    cameraOffset: [0, 0.2, 4.2],
    lookAtOffset: [0, 0.2, 0],
    targetFov: 45,
  },
];

// ── PROCEDURAL 3D FLIGHT PATH TRANSITION CONFIGURATION ──
interface TransitionFlightConfig {
  fromIndex: number;
  toIndex: number;
  tRange: [number, number];
  // Intermediate Catmull-Rom waypoint control offsets in world space
  waypoints: [number, number, number][];
  // Maximum banking roll angle (radians) during turns
  maxBank: number;
  // Extra barrel-roll or corkscrew rotations (multiples of 2*PI)
  corkscrewRotations?: number;
}

const TRANSITIONS_CONFIG: TransitionFlightConfig[] = [
  // 0 -> 1: Core to Web Architecture (Sweeping high right arc, diving into mint nebula)
  {
    fromIndex: 0,
    toIndex: 1,
    tRange: [STATION_WAYPOINTS[0], STATION_WAYPOINTS[1]],
    waypoints: [
      [15, 28, -20],
      [10, 32, -38],
      [-15, 6, -55],
      [-36, 10, -68],
    ],
    maxBank: 0.65, // ~37 deg
    corkscrewRotations: 0,
  },
  // 1 -> 2: Web Architecture to Content & Social (Deep canyon dive with full barrel roll)
  {
    fromIndex: 1,
    toIndex: 2,
    tRange: [STATION_WAYPOINTS[1], STATION_WAYPOINTS[2]],
    waypoints: [
      [-28, -8, -92],
      [-5, -30, -112],
      [22, -18, -132],
      [42, -5, -148],
    ],
    maxBank: 0.85,
    corkscrewRotations: 1, // 360 degree barrel roll
  },
  // 2 -> 3: Content to Video Teaser (Wide lateral slingshot across the galactic midline)
  {
    fromIndex: 2,
    toIndex: 3,
    tRange: [STATION_WAYPOINTS[2], STATION_WAYPOINTS[3]],
    waypoints: [
      [68, 6, -172],
      [35, 18, -195],
      [-15, 12, -215],
      [-48, -10, -232],
    ],
    maxBank: 0.75,
    corkscrewRotations: 0,
  },
  // 3 -> 4: Video Teaser to Branding Identity (High climbing loop over celestial clouds)
  {
    fromIndex: 3,
    toIndex: 4,
    tRange: [STATION_WAYPOINTS[3], STATION_WAYPOINTS[4]],
    waypoints: [
      [-38, 15, -260],
      [-8, 38, -282],
      [25, 34, -302],
      [38, 25, -318],
    ],
    maxBank: 0.80,
    corkscrewRotations: 0.5, // 180 deg inverted swoop
  },
  // 4 -> 5: Branding to Billboard (Low orbital skim under planetary halo)
  {
    fromIndex: 4,
    toIndex: 5,
    tRange: [STATION_WAYPOINTS[4], STATION_WAYPOINTS[5]],
    waypoints: [
      [26, -12, -345],
      [0, -18, -368],
      [-22, -8, -390],
      [-28, 4, -402],
    ],
    maxBank: 0.70,
    corkscrewRotations: 0,
  },
  // 5 -> 6: Billboard to Project 1 Araz Metal (Spiraling climb through sapphire nebula)
  {
    fromIndex: 5,
    toIndex: 6,
    tRange: [STATION_WAYPOINTS[5], STATION_WAYPOINTS[6]],
    waypoints: [
      [-48, 28, -428],
      [-10, 22, -450],
      [25, 8, -472],
      [42, -4, -488],
    ],
    maxBank: 0.75,
    corkscrewRotations: 0.5,
  },
  // 6 -> 7: Project 1 to Project 2 Dr. Sadeghi (Canyon dive through star cluster)
  {
    fromIndex: 6,
    toIndex: 7,
    tRange: [STATION_WAYPOINTS[6], STATION_WAYPOINTS[7]],
    waypoints: [
      [32, -28, -515],
      [0, -16, -538],
      [-25, 5, -558],
      [-35, 18, -572],
    ],
    maxBank: 0.72,
    corkscrewRotations: 0,
  },
  // 7 -> 8: Project 2 to Project 3 Sepid Kooh (Hyperbolic arc over galactic ridge)
  {
    fromIndex: 7,
    toIndex: 8,
    tRange: [STATION_WAYPOINTS[7], STATION_WAYPOINTS[8]],
    waypoints: [
      [-55, 32, -600],
      [-12, 28, -622],
      [18, 18, -642],
      [35, 12, -658],
    ],
    maxBank: 0.78,
    corkscrewRotations: 0,
  },
  // 8 -> 9: Project 3 to Project 4 Baran Leather (High-speed corkscrew descent)
  {
    fromIndex: 8,
    toIndex: 9,
    tRange: [STATION_WAYPOINTS[8], STATION_WAYPOINTS[9]],
    waypoints: [
      [28, -25, -685],
      [0, -32, -708],
      [-28, -24, -728],
      [-40, -18, -742],
    ],
    maxBank: 0.85,
    corkscrewRotations: 1, // Full 360 corkscrew
  },
  // 9 -> 10: Project 4 to Collaboration Workflow (Slingshot upward into orbital platform)
  {
    fromIndex: 9,
    toIndex: 10,
    tRange: [STATION_WAYPOINTS[9], STATION_WAYPOINTS[10]],
    waypoints: [
      [-25, 15, -770],
      [5, 20, -792],
      [22, 0, -815],
      [26, -16, -832],
    ],
    maxBank: 0.70,
    corkscrewRotations: 0,
  },
  // 10 -> 11: Workflow to Executive Sanctum (The Grand Galactic Center Jump)
  {
    fromIndex: 10,
    toIndex: 11,
    tRange: [STATION_WAYPOINTS[10], STATION_WAYPOINTS[11]],
    waypoints: [
      [38, 12, -862],
      [20, 28, -888],
      [4, 18, -912],
      [0, 8, -932],
    ],
    maxBank: 0.75,
    corkscrewRotations: 0.5,
  },
];

// Pre-constructed Catmull-Rom splines for each transition
interface BuiltTransition {
  config: TransitionFlightConfig;
  curve: THREE.CatmullRomCurve3;
  fromStation: StationPoint;
  toStation: StationPoint;
}

const BUILT_TRANSITIONS: BuiltTransition[] = TRANSITIONS_CONFIG.map((cfg) => {
  const fromSt = STATIONS_3D[cfg.fromIndex];
  const toSt = STATIONS_3D[cfg.toIndex];

  const startCamPos = new THREE.Vector3(
    fromSt.stationPosition[0] + fromSt.cameraOffset[0],
    fromSt.stationPosition[1] + fromSt.cameraOffset[1],
    fromSt.stationPosition[2] + fromSt.cameraOffset[2]
  );

  const endCamPos = new THREE.Vector3(
    toSt.stationPosition[0] + toSt.cameraOffset[0],
    toSt.stationPosition[1] + toSt.cameraOffset[1],
    toSt.stationPosition[2] + toSt.cameraOffset[2]
  );

  // Assemble full control points array: start -> intermediate waypoints -> end
  const points: THREE.Vector3[] = [startCamPos];
  cfg.waypoints.forEach((wp) => {
    points.push(new THREE.Vector3(wp[0], wp[1], wp[2]));
  });
  points.push(endCamPos);

  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);

  return {
    config: cfg,
    curve,
    fromStation: fromSt,
    toStation: toSt,
  };
});

// ── REUSABLE SCRATCH OBJECTS FOR ZERO GC ALLOCATION IN USEFRAME ──
const _scratchPos = new THREE.Vector3();
const _scratchForward = new THREE.Vector3();
const _scratchUp = new THREE.Vector3(0, 1, 0);
const _scratchRight = new THREE.Vector3();
const _scratchRotMatrix = new THREE.Matrix4();
const _scratchFlightQuat = new THREE.Quaternion();
const _scratchStartQuat = new THREE.Quaternion();
const _scratchEndQuat = new THREE.Quaternion();
const _scratchVelocity = new THREE.Vector3();
const _scratchPrevPos = new THREE.Vector3();
const _scratchNextPos = new THREE.Vector3();
const _scratchLookAt = new THREE.Vector3();
const _scratchFinalQuat = new THREE.Quaternion();

export interface CameraStateResult {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  lookAt: THREE.Vector3;
  fov: number;
  velocity: THREE.Vector3;
  speed: number;
  tangent: THREE.Vector3;
  normalVector: THREE.Vector3;
  binormalVector: THREE.Vector3;
  warpIntensity: number;
  activeStationIndex: number;
  fromStationIndex: number;
  toStationIndex: number;
  isTransitioning: boolean;
  transitionProgress: number; // rawU 0 to 1 between stations
  stage: 1 | 2 | 3 | 4 | 5;
  anticipationWeight: number;
  collapseWeight: number;
  riftWeight: number;
  revealWeight: number;
  arrivalWeight: number;
  bankAngle: number;
}

export { BUILT_TRANSITIONS };

const cachedResult: CameraStateResult = {
  position: new THREE.Vector3(),
  quaternion: new THREE.Quaternion(),
  lookAt: new THREE.Vector3(),
  fov: 45,
  velocity: new THREE.Vector3(),
  speed: 0,
  tangent: new THREE.Vector3(0, 0, -1),
  normalVector: new THREE.Vector3(0, 1, 0),
  binormalVector: new THREE.Vector3(1, 0, 0),
  warpIntensity: 0,
  activeStationIndex: 0,
  fromStationIndex: 0,
  toStationIndex: 0,
  isTransitioning: false,
  transitionProgress: 0,
  stage: 5,
  anticipationWeight: 0,
  collapseWeight: 0,
  riftWeight: 0,
  revealWeight: 0,
  arrivalWeight: 1,
  bankAngle: 0,
};

function quinticEaseInOut(x: number): number {
  return x < 0.5
    ? 16 * x * x * x * x * x
    : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Pure deterministic mathematical function to compute camera transform,
 * flight dynamics, banking, and warp speed from scroll progress [0, 1].
 */
export function getInterstellarCameraState(
  scrollProgress: number,
  pointer: { x: number; y: number } = { x: 0, y: 0 },
  isMobile: boolean = false
): CameraStateResult {
  const p = Math.max(0, Math.min(1, scrollProgress));

  // Check if p is actively transitioning between two stations
  let activeTrans: BuiltTransition | null = null;
  for (let i = 0; i < BUILT_TRANSITIONS.length; i++) {
    const t = BUILT_TRANSITIONS[i];
    // A small buffer around endpoints determines if we are dwelling or actively flying
    if (p > t.config.tRange[0] + 0.0003 && p < t.config.tRange[1] - 0.0003) {
      activeTrans = t;
      break;
    }
  }

  // ── CASE A: IN-FLIGHT INTERSTELLAR JOURNEY (COSMIC RIFT SEQUENCE) ──
  if (activeTrans) {
    const [tStart, tEnd] = activeTrans.config.tRange;
    const rawU = Math.max(0, Math.min(1, (p - tStart) / (tEnd - tStart)));
    const easedU = quinticEaseInOut(rawU);

    // Compute the 5 Signature Transition Stages
    // Stage 1: Cosmic Anticipation [0.00 to 0.16]
    const anticipationWeight =
      rawU <= 0.16 ? Math.sin((rawU / 0.16) * Math.PI) : 0;

    // Stage 2: Space-Time Collapse [0.12 to 0.38]
    const collapseWeight =
      rawU >= 0.12 && rawU <= 0.38
        ? Math.sin(((rawU - 0.12) / 0.26) * Math.PI)
        : 0;

    // Stage 3: The Cosmic Rift [0.28 to 0.76]
    const riftWeight =
      rawU >= 0.28 && rawU <= 0.76
        ? Math.pow(Math.sin(((rawU - 0.28) / 0.48) * Math.PI), 1.25)
        : 0;

    // Stage 4: The Reveal [0.68 to 0.92]
    const revealWeight =
      rawU >= 0.68 && rawU <= 0.92
        ? Math.sin(((rawU - 0.68) / 0.24) * Math.PI)
        : 0;

    // Stage 5: Arrival [0.85 to 1.00]
    const arrivalWeight = smoothstep(0.85, 1.0, rawU);

    const stage: 1 | 2 | 3 | 4 | 5 =
      rawU < 0.14 ? 1 : rawU < 0.35 ? 2 : rawU < 0.72 ? 3 : rawU < 0.90 ? 4 : 5;

    // Sample Catmull-Rom curve
    activeTrans.curve.getPoint(easedU, _scratchPos);

    // Tangent vector
    const deltaU = 0.005;
    const uPrev = Math.max(0, easedU - deltaU);
    const uNext = Math.min(1, easedU + deltaU);
    activeTrans.curve.getPoint(uPrev, _scratchPrevPos);
    activeTrans.curve.getPoint(uNext, _scratchNextPos);

    _scratchForward.subVectors(_scratchNextPos, _scratchPrevPos).normalize();
    _scratchVelocity.subVectors(_scratchNextPos, _scratchPrevPos).multiplyScalar(1 / (2 * deltaU));

    // Dynamic Banking Angle
    const turnX = _scratchForward.x;
    let bankAngle = -turnX * activeTrans.config.maxBank * 1.5;

    // Optional barrel-roll or corkscrew in mid-flight (inside Stage 3 Cosmic Rift)
    if (activeTrans.config.corkscrewRotations && rawU > 0.30 && rawU < 0.74) {
      const corkU = (rawU - 0.30) / 0.44;
      const rollAmount =
        Math.sin(corkU * Math.PI) *
        Math.sin(corkU * Math.PI) *
        Math.PI *
        2 *
        activeTrans.config.corkscrewRotations;
      bankAngle += rollAmount;
    }

    // Build flight orientation matrix
    _scratchRight.crossVectors(_scratchForward, _scratchUp).normalize();
    const trueUp = new THREE.Vector3().crossVectors(_scratchRight, _scratchForward).normalize();

    const rollQuat = new THREE.Quaternion().setFromAxisAngle(_scratchForward, bankAngle);
    trueUp.applyQuaternion(rollQuat);
    _scratchRight.crossVectors(_scratchForward, trueUp).normalize();

    _scratchRotMatrix.makeBasis(_scratchRight, trueUp, _scratchForward.clone().negate());
    _scratchFlightQuat.setFromRotationMatrix(_scratchRotMatrix);

    // Start & End station resting orientations
    const fromSt = activeTrans.fromStation;
    const toSt = activeTrans.toStation;

    const fromCam = new THREE.Vector3(
      fromSt.stationPosition[0] + fromSt.cameraOffset[0],
      fromSt.stationPosition[1] + fromSt.cameraOffset[1],
      fromSt.stationPosition[2] + fromSt.cameraOffset[2]
    );
    const fromLook = new THREE.Vector3(
      fromSt.stationPosition[0] + fromSt.lookAtOffset[0],
      fromSt.stationPosition[1] + fromSt.lookAtOffset[1],
      fromSt.stationPosition[2] + fromSt.lookAtOffset[2]
    );
    const toCam = new THREE.Vector3(
      toSt.stationPosition[0] + toSt.cameraOffset[0],
      toSt.stationPosition[1] + toSt.cameraOffset[1],
      toSt.stationPosition[2] + toSt.cameraOffset[2]
    );
    const toLook = new THREE.Vector3(
      toSt.stationPosition[0] + toSt.lookAtOffset[0],
      toSt.stationPosition[1] + toSt.lookAtOffset[1],
      toSt.stationPosition[2] + toSt.lookAtOffset[2]
    );

    _scratchRotMatrix.lookAt(fromCam, fromLook, _scratchUp);
    _scratchStartQuat.setFromRotationMatrix(_scratchRotMatrix);

    _scratchRotMatrix.lookAt(toCam, toLook, _scratchUp);
    _scratchEndQuat.setFromRotationMatrix(_scratchRotMatrix);

    // Smooth Hermite blend between departure station, dynamic flight path, and destination station
    const blendIn = smoothstep(0.0, 0.20, rawU);
    const blendOut = smoothstep(0.80, 1.0, rawU);

    _scratchFinalQuat.copy(_scratchStartQuat);
    _scratchFinalQuat.slerp(_scratchFlightQuat, blendIn);
    _scratchFinalQuat.slerp(_scratchEndQuat, blendOut);

    _scratchLookAt.copy(_scratchPos).addScaledVector(_scratchForward, 12);

    // Warp intensity bell curve
    const warpIntensity = Math.pow(Math.sin(rawU * Math.PI), 1.35);

    // Cinematic FOV modulation across the 5 stages
    // Base 45 -> 48 (anticipation) -> 58 (collapse) -> 65 (cosmic rift) -> 49 (reveal) -> 45 (arrival)
    const fovBoost =
      anticipationWeight * 3 +
      collapseWeight * 12 +
      riftWeight * (isMobile ? 12 : 20) +
      revealWeight * 5;
    const fov = 45 + fovBoost;

    cachedResult.position.copy(_scratchPos);
    cachedResult.quaternion.copy(_scratchFinalQuat);
    cachedResult.lookAt.copy(_scratchLookAt);
    cachedResult.fov = fov;
    cachedResult.velocity.copy(_scratchVelocity);
    cachedResult.speed = warpIntensity;
    cachedResult.tangent.copy(_scratchForward);
    cachedResult.normalVector.copy(trueUp);
    cachedResult.binormalVector.copy(_scratchRight);
    cachedResult.warpIntensity = warpIntensity;
    cachedResult.activeStationIndex = rawU < 0.5 ? activeTrans.config.fromIndex : activeTrans.config.toIndex;
    cachedResult.fromStationIndex = activeTrans.config.fromIndex;
    cachedResult.toStationIndex = activeTrans.config.toIndex;
    cachedResult.isTransitioning = true;
    cachedResult.transitionProgress = rawU;
    cachedResult.stage = stage;
    cachedResult.anticipationWeight = anticipationWeight;
    cachedResult.collapseWeight = collapseWeight;
    cachedResult.riftWeight = riftWeight;
    cachedResult.revealWeight = revealWeight;
    cachedResult.arrivalWeight = arrivalWeight;
    cachedResult.bankAngle = bankAngle;

    return cachedResult;
  }

  // ── CASE B: STATIONARY DWELL AT A STATION ──
  // Find nearest station
  let stationIndex = 0;
  let minDiff = 999;
  for (let i = 0; i < STATION_WAYPOINTS.length; i++) {
    const diff = Math.abs(p - STATION_WAYPOINTS[i]);
    if (diff < minDiff) {
      minDiff = diff;
      stationIndex = i;
    }
  }

  const st = STATIONS_3D[stationIndex];
  const stPos = st.stationPosition;
  const camOff = st.cameraOffset;
  const lookOff = st.lookAtOffset;

  // Gentle pointer parallax
  const parallaxMult = isMobile ? 0.15 : 0.45;
  const targetX = stPos[0] + camOff[0] + pointer.x * parallaxMult;
  const targetY = stPos[1] + camOff[1] + pointer.y * (parallaxMult * 0.45);
  const targetZ = stPos[2] + camOff[2];

  _scratchPos.set(targetX, targetY, targetZ);
  _scratchLookAt.set(stPos[0] + lookOff[0], stPos[1] + lookOff[1], stPos[2] + lookOff[2]);

  _scratchRotMatrix.lookAt(_scratchPos, _scratchLookAt, _scratchUp);
  _scratchFinalQuat.setFromRotationMatrix(_scratchRotMatrix);

  cachedResult.position.copy(_scratchPos);
  cachedResult.quaternion.copy(_scratchFinalQuat);
  cachedResult.lookAt.copy(_scratchLookAt);
  cachedResult.fov = st.targetFov || 45;
  cachedResult.velocity.set(0, 0, 0);
  cachedResult.speed = 0;
  cachedResult.tangent.set(0, 0, -1);
  cachedResult.normalVector.set(0, 1, 0);
  cachedResult.binormalVector.set(1, 0, 0);
  cachedResult.warpIntensity = 0;
  cachedResult.activeStationIndex = stationIndex;
  cachedResult.fromStationIndex = stationIndex;
  cachedResult.toStationIndex = stationIndex;
  cachedResult.isTransitioning = false;
  cachedResult.transitionProgress = 0;
  cachedResult.stage = 5;
  cachedResult.anticipationWeight = 0;
  cachedResult.collapseWeight = 0;
  cachedResult.riftWeight = 0;
  cachedResult.revealWeight = 0;
  cachedResult.arrivalWeight = 1;
  cachedResult.bankAngle = 0;

  return cachedResult;
}

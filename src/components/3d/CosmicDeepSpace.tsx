'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicDeepSpaceProps {
  scrollProgress: number;
  activeSector: number;
  cameraTangent?: THREE.Vector3;
  warpIntensity?: number;
  anticipationWeight?: number;
  collapseWeight?: number;
  riftWeight?: number;
  revealWeight?: number;
}

export default function CosmicDeepSpace({
  scrollProgress,
  cameraTangent,
  warpIntensity = 0,
  anticipationWeight = 0,
  collapseWeight = 0,
  riftWeight = 0,
  revealWeight = 0,
}: CosmicDeepSpaceProps) {
  const { camera } = useThree();
  const starsRef = useRef<THREE.Points>(null!);
  const warpLinesRef = useRef<THREE.LineSegments>(null!);
  const nebulaeRef = useRef<THREE.Group>(null!);
  const warpGroupRef = useRef<THREE.Group>(null!);

  const smoothWarpRef = useRef(0);
  const currentTangentRef = useRef(new THREE.Vector3(0, 0, -1));

  // 1. Generate 4,500 vast cosmic stars throughout the full 1000-unit galactic corridor
  const { starPositions, starColors, starSizes } = useMemo(() => {
    const count = 4500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color('#00f5ff'), // Electric cyan
      new THREE.Color('#7928ca'), // Deep violet
      new THREE.Color('#ff0080'), // Magenta accent
      new THREE.Color('#38bdf8'), // Sky cyan
      new THREE.Color('#c084fc'), // Galactic violet
      new THREE.Color('#ffffff'), // Pure white starlight
      new THREE.Color('#e0f2fe'), // Luminous white-blue
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Cylindrical distribution around galactic corridor with random radius
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.pow(Math.random(), 0.7) * 95;
      positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
      positions[i3 + 1] = Math.sin(angle) * radius * 0.75 + (Math.random() - 0.5) * 30;
      // Stretched along the full galactic span [50 to -1050]
      positions[i3 + 2] = 50 - Math.random() * 1100;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = 1.0 + Math.random() * 2.8;
    }

    return { starPositions: positions, starColors: colors, starSizes: sizes };
  }, []);

  // 2. Generate 600 Camera-Centric Cosmic Rift Warp Streak Lines
  const { warpLocalOffsets, warpColors, lineCount } = useMemo(() => {
    const count = 600;
    const offsets = new Float32Array(count * 3);
    const colors = new Float32Array(count * 6);

    const cyanCol = new THREE.Color('#00f5ff');     // Electric cyan
    const violetCol = new THREE.Color('#7928ca');   // Deep violet
    const magentaCol = new THREE.Color('#ff0080');  // Magenta accent
    const whiteCol = new THREE.Color('#ffffff');    // Hyper-starlight

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i6 = i * 6;

      const angle = Math.random() * Math.PI * 2;
      // Radius: distributed from near-view (1.8m) to outer periphery (26m)
      const radius = 1.8 + Math.random() * 24;
      offsets[i3] = Math.cos(angle) * radius;
      offsets[i3 + 1] = Math.sin(angle) * radius * 0.75;
      // Distance along sightline in front of camera [-5 to 45]
      offsets[i3 + 2] = -5 + Math.random() * 50;

      const col = i % 5 === 0 ? whiteCol : i % 5 === 1 ? cyanCol : i % 5 === 2 ? violetCol : i % 5 === 3 ? magentaCol : cyanCol;
      // Head vertex: bright luminous tip
      colors[i6] = col.r;
      colors[i6 + 1] = col.g;
      colors[i6 + 2] = col.b;
      // Tail vertex: fading into deep space
      colors[i6 + 3] = col.r * 0.04;
      colors[i6 + 4] = col.g * 0.04;
      colors[i6 + 5] = col.b * 0.04;
    }

    return { warpLocalOffsets: offsets, warpColors: colors, lineCount: count };
  }, []);

  // Reusable position buffer for warp lines
  const warpPositions = useMemo(() => new Float32Array(lineCount * 6), [lineCount]);

  // Scratch vectors for zero GC allocation in useFrame
  const scratchCamRight = useRef(new THREE.Vector3());
  const scratchCamUp = useRef(new THREE.Vector3());
  const scratchCamForward = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // 1. Smooth warp intensity
    const targetWarp = warpIntensity;
    smoothWarpRef.current = THREE.MathUtils.lerp(smoothWarpRef.current, targetWarp, delta * 14);
    const warp = smoothWarpRef.current;

    // 2. Camera flight tangent vector (direction of movement in 3D world space)
    if (cameraTangent && cameraTangent.lengthSq() > 0.1) {
      currentTangentRef.current.lerp(cameraTangent, delta * 12).normalize();
    } else {
      camera.getWorldDirection(currentTangentRef.current);
    }
    const flightDir = currentTangentRef.current;

    // 3. Update Camera-Following Warp Rig
    if (warpGroupRef.current) {
      warpGroupRef.current.position.copy(camera.position);
    }

    // 4. Update dynamic warp streak lines
    if (warpLinesRef.current) {
      const mat = warpLinesRef.current.material as THREE.LineBasicMaterial;
      const targetOpacity = warp > 0.02 ? Math.min(0.95, warp * 1.35) : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 15);
      warpLinesRef.current.visible = mat.opacity > 0.01;

      if (warpLinesRef.current.visible) {
        const attr = warpLinesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const posArray = attr.array as Float32Array;
        // Streak length stretches proportionally with speed: from 1.5 to 28 units!
        const streakLength = 1.5 + warp * 26.0;

        // Camera local axes (Zero GC via scratch vectors)
        scratchCamRight.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
        scratchCamUp.current.set(0, 1, 0).applyQuaternion(camera.quaternion);
        scratchCamForward.current.set(0, 0, -1).applyQuaternion(camera.quaternion);

        const camRight = scratchCamRight.current;
        const camUp = scratchCamUp.current;
        const camForward = scratchCamForward.current;

        // Space-Time collapse vortex spin angle
        const collapseSpin = collapseWeight * 0.45;

        for (let i = 0; i < lineCount; i++) {
          const i3 = i * 3;
          const i6 = i * 6;

          let lx = warpLocalOffsets[i3];
          let ly = warpLocalOffsets[i3 + 1];
          const lz = warpLocalOffsets[i3 + 2];

          // Stage 2 Collapse: Vortex swirl around sightline
          if (collapseSpin > 0.01) {
            const cosS = Math.cos(collapseSpin);
            const sinS = Math.sin(collapseSpin);
            const rotX = lx * cosS - ly * sinS;
            const rotY = lx * sinS + ly * cosS;
            lx = rotX;
            ly = rotY;
          }

          // Compute head position in local camera space
          const hX = camRight.x * lx + camUp.x * ly + camForward.x * lz;
          const hY = camRight.y * lx + camUp.y * ly + camForward.y * lz;
          const hZ = camRight.z * lx + camUp.z * ly + camForward.z * lz;

          // Head vertex
          posArray[i6] = hX;
          posArray[i6 + 1] = hY;
          posArray[i6 + 2] = hZ;

          // Tail vertex stretches OPPOSITE to flight direction (optical flow)
          posArray[i6 + 3] = hX - flightDir.x * streakLength;
          posArray[i6 + 4] = hY - flightDir.y * streakLength;
          posArray[i6 + 5] = hZ - flightDir.z * streakLength;
        }

        attr.needsUpdate = true;
      }
    }

    // 5. Stage 1: Ambient starfield subtle drift and breathing pulsation
    if (starsRef.current) {
      starsRef.current.rotation.z += (0.00015 + anticipationWeight * 0.0008);
      // Subtle drift along Y
      if (anticipationWeight > 0.01) {
        starsRef.current.position.y = Math.sin(scrollProgress * 20) * 0.4 * anticipationWeight;
      }
    }

    // 6. Ambient nebula gentle cosmic pulsation
    if (nebulaeRef.current) {
      nebulaeRef.current.rotation.z += 0.0002;
    }
  });

  return (
    <group name="CosmicDeepSpace">
      {/* 1. Full-Galactic Ambient Twinkling Starfield (4,500 Stars Across 1,000 Units) */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Motion-Harmonized Warp Streak Rig (Anchored to Camera Position) */}
      <group ref={warpGroupRef}>
        <lineSegments ref={warpLinesRef} visible={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[warpPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[warpColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            linewidth={2}
          />
        </lineSegments>
      </group>

      {/* 3. Deep Space Atmospheric Cosmic Nebulae at Sector Waypoints */}
      <group ref={nebulaeRef}>
        {/* Sector 0: Emerald-Mint Welcome Nebula Core */}
        <mesh position={[0, 0, -25]}>
          <sphereGeometry args={[45, 16, 16]} />
          <meshBasicMaterial
            color="#0E946E"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 1: Services Sky-Cyan Nebula */}
        <mesh position={[-20, 10, -200]}>
          <sphereGeometry args={[75, 16, 16]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 2: Masterworks Indigo-Violet Nebula */}
        <mesh position={[15, -15, -600]}>
          <sphereGeometry args={[85, 16, 16]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.045}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 3 & 4: Galactic Sanctum Amber-Teal Core Aura */}
        <mesh position={[0, 0, -890]}>
          <sphereGeometry args={[95, 16, 16]} />
          <meshBasicMaterial
            color="#0d9488"
            transparent
            opacity={0.055}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicDeepSpaceProps {
  scrollProgress: number;
  activeSector: number;
}

export default function CosmicDeepSpace({ scrollProgress, activeSector }: CosmicDeepSpaceProps) {
  const { camera } = useThree();
  const starsRef = useRef<THREE.Points>(null!);
  const warpLinesRef = useRef<THREE.LineSegments>(null!);
  const nebulaeRef = useRef<THREE.Group>(null!);

  const prevProgressRef = useRef(scrollProgress);
  const prevCamPosRef = useRef(new THREE.Vector3());
  const velocityRef = useRef(0);
  const warpIntensityRef = useRef(0);

  // 1. Generate 3,600 ambient twinkling cosmic stars filling the full galactic volume
  const { starPositions, starColors, starSizes } = useMemo(() => {
    const count = 3600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const brandColors = [
      new THREE.Color('#5ef0c4'), // Neon mint
      new THREE.Color('#0E946E'), // Emerald
      new THREE.Color('#38bdf8'), // Sky cyan
      new THREE.Color('#c084fc'), // Galactic violet
      new THREE.Color('#ffffff'), // Pure white
      new THREE.Color('#fef08a'), // Warm starlight
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across deep space volume
      positions[i3] = (Math.random() - 0.5) * 160;
      positions[i3 + 1] = (Math.random() - 0.5) * 120;
      positions[i3 + 2] = -Math.random() * 880 + 40;

      const col = brandColors[Math.floor(Math.random() * brandColors.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = 1.0 + Math.random() * 2.5;
    }

    return { starPositions: positions, starColors: colors, starSizes: sizes };
  }, []);

  // 2. Generate Warp Streak Lines for Hyper-drive transition (surrounding camera)
  const { warpPositions, warpColors } = useMemo(() => {
    const lineCount = 420;
    const positions = new Float32Array(lineCount * 6);
    const colors = new Float32Array(lineCount * 6);

    const cyanCol = new THREE.Color('#5ef0c4');
    const emeraldCol = new THREE.Color('#0E946E');
    const skyCol = new THREE.Color('#38bdf8');

    for (let i = 0; i < lineCount; i++) {
      const idx = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 22;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.75 + (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 60;
      const streakLength = 10 + Math.random() * 24;

      // Start vertex
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // End vertex (stretched in Z)
      positions[idx + 3] = x;
      positions[idx + 4] = y;
      positions[idx + 5] = z + streakLength;

      const col = i % 3 === 0 ? cyanCol : i % 3 === 1 ? emeraldCol : skyCol;
      // Head vertex
      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
      // Tail vertex (smooth fade)
      colors[idx + 3] = col.r * 0.12;
      colors[idx + 4] = col.g * 0.12;
      colors[idx + 5] = col.b * 0.12;
    }

    return { warpPositions: positions, warpColors: colors };
  }, []);

  useFrame((state, delta) => {
    // Measure camera travel speed in 3D
    const camDist = camera.position.distanceTo(prevCamPosRef.current);
    prevCamPosRef.current.copy(camera.position);

    const progressDiff = Math.abs(scrollProgress - prevProgressRef.current);
    prevProgressRef.current = scrollProgress;

    // Smooth velocity calculation based on camera flight and scroll input
    const currentSpeed = Math.max(camDist * 18, progressDiff * 45);
    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, currentSpeed, delta * 10);

    // Warp intensity target
    const targetWarp = Math.min(1.0, velocityRef.current * 1.8);
    warpIntensityRef.current = THREE.MathUtils.lerp(warpIntensityRef.current, targetWarp, delta * 8);

    // Dynamic Warp FOV expansion during hyper-speed travel
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = 45 + warpIntensityRef.current * 16;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 6);
      camera.updateProjectionMatrix();
    }

    // Keep warp lines tightly anchored around the moving camera
    if (warpLinesRef.current) {
      const mat = warpLinesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, warpIntensityRef.current * 0.88, delta * 12);
      warpLinesRef.current.visible = mat.opacity > 0.01;

      // Position warp tunnel relative to camera
      warpLinesRef.current.position.copy(camera.position);
      warpLinesRef.current.position.z -= 10;
    }

    // Slow ambient cosmic rotation
    if (starsRef.current) {
      starsRef.current.rotation.z += 0.0002;
    }
    if (nebulaeRef.current) {
      nebulaeRef.current.rotation.z += 0.00015;
    }
  });

  return (
    <group name="CosmicDeepSpace">
      {/* 1. Ambient Twinkling Cosmic Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
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

      {/* 2. Hyper-Speed Warp Streak Lines (Ignites dynamically during travel) */}
      <lineSegments ref={warpLinesRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[warpPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[warpColors, 3]}
          />
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

      {/* 3. Deep Space Planetary Nebulae Clouds at Sector Regions */}
      <group ref={nebulaeRef}>
        {/* Origin / Sector 0 Glow */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[18, 16, 16]} />
          <meshBasicMaterial
            color="#0E946E"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 1 Upper-Left Sapphire Nebula */}
        <mesh position={[-14, 8, -60]}>
          <sphereGeometry args={[26, 16, 16]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 1 Lower-Right Crimson/Purple Cloud */}
        <mesh position={[16, -8, -120]}>
          <sphereGeometry args={[28, 16, 16]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 2 Masterworks Deep Nebula */}
        <mesh position={[0, 4, -320]}>
          <sphereGeometry args={[38, 16, 16]} />
          <meshBasicMaterial
            color="#0f766e"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 3 Collaboration Orbital Belt */}
        <mesh position={[0, -6, -600]}>
          <sphereGeometry args={[42, 16, 16]} />
          <meshBasicMaterial
            color="#064e3b"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sector 4 Galactic Core Sovereign Glow */}
        <mesh position={[0, 4, -790]}>
          <sphereGeometry args={[32, 16, 16]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

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
  const velocityRef = useRef(0);
  const warpIntensityRef = useRef(0);

  // 1. Generate 2,800 ambient twinkling cosmic stars
  const { starPositions, starColors, starSizes } = useMemo(() => {
    const count = 2800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const brandColors = [
      new THREE.Color('#5ef0c4'), // Brand neon mint
      new THREE.Color('#0E946E'), // Brand emerald
      new THREE.Color('#38bdf8'), // Sky cyan
      new THREE.Color('#ffffff'), // Pure white
      new THREE.Color('#a7f3d0'), // Soft mint
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across a deep cylindrical space corridor
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 45;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 45;
      positions[i3 + 2] = -Math.random() * 220 + 20;

      const col = brandColors[Math.floor(Math.random() * brandColors.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = 1.0 + Math.random() * 2.5;
    }

    return { starPositions: positions, starColors: colors, starSizes: sizes };
  }, []);

  // 2. Generate Warp Streak Lines for Hyper-drive transition
  const { warpPositions, warpColors } = useMemo(() => {
    const lineCount = 380;
    const positions = new Float32Array(lineCount * 6);
    const colors = new Float32Array(lineCount * 6);

    const cyanCol = new THREE.Color('#5ef0c4');
    const greenCol = new THREE.Color('#0E946E');

    for (let i = 0; i < lineCount; i++) {
      const idx = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const radius = 3.5 + Math.random() * 28;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.75 + (Math.random() - 0.5) * 8;
      const z = -Math.random() * 200 + 10;
      const streakLength = 8 + Math.random() * 18;

      // Start vertex
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // End vertex (stretched in Z)
      positions[idx + 3] = x;
      positions[idx + 4] = y;
      positions[idx + 5] = z + streakLength;

      const col = i % 2 === 0 ? cyanCol : greenCol;
      // Head vertex
      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
      // Tail vertex (fade)
      colors[idx + 3] = col.r * 0.15;
      colors[idx + 4] = col.g * 0.15;
      colors[idx + 5] = col.b * 0.15;
    }

    return { warpPositions: positions, warpColors: colors };
  }, []);

  // 3. Station Gateways / Energy Rings along the Z-axis
  const stationDepths = useMemo(() => [0, -22, -27, -32, -37, -43, -56, -94, -146], []);

  useFrame((state, delta) => {
    // Measure instantaneous scroll velocity
    const progressDiff = Math.abs(scrollProgress - prevProgressRef.current);
    prevProgressRef.current = scrollProgress;

    // Smooth velocity smoothing
    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, progressDiff * 45, delta * 12);

    // Warp intensity target
    const targetWarp = Math.min(1.0, velocityRef.current * 2.5);
    warpIntensityRef.current = THREE.MathUtils.lerp(warpIntensityRef.current, targetWarp, delta * 8);

    // Animate twinkling ambient stars
    if (starsRef.current) {
      starsRef.current.rotation.z += 0.0003;
    }

    // Dynamic Warp FOV expansion (Cinematic Warp Speed effect)
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = 45 + warpIntensityRef.current * 14;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 6);
      camera.updateProjectionMatrix();
    }

    // Update Warp Lines visibility and position
    if (warpLinesRef.current) {
      const mat = warpLinesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, warpIntensityRef.current * 0.85, delta * 10);
      warpLinesRef.current.visible = mat.opacity > 0.01;

      // Move lines with camera so streaks surround the traveler
      warpLinesRef.current.position.z = camera.position.z - 20;
    }

    // Subtle breathing on nebulae
    if (nebulaeRef.current) {
      nebulaeRef.current.rotation.z += 0.0002;
    }
  });

  return (
    <group name="CosmicDeepSpace">
      {/* 1. Deep Space Twinkling Starfield */}
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
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Hyper-Speed Warp Lines (Active during station transitions) */}
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

      {/* 3. Ambient Nebulae & Emerald/Teal Horizon Glows */}
      <group ref={nebulaeRef}>
        {/* Entrance Core Glow */}
        <mesh position={[0, 0, 10]}>
          <sphereGeometry args={[14, 16, 16]} />
          <meshBasicMaterial
            color="#0E946E"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Mid-journey Galaxy Glow */}
        <mesh position={[-6, 2, -60]}>
          <sphereGeometry args={[22, 16, 16]} />
          <meshBasicMaterial
            color="#064e3b"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Far Horizon Deep Blue-Emerald Glow */}
        <mesh position={[6, -2, -130]}>
          <sphereGeometry args={[28, 16, 16]} />
          <meshBasicMaterial
            color="#0f766e"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 4. Station Rings / Holographic Gateways */}
      {stationDepths.map((z, idx) => (
        <group key={`station-ring-${idx}`} position={[0, 0, z]}>
          {/* Subtle perimeter ring */}
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[5.2, 5.25, 48]} />
            <meshBasicMaterial
              color="#5ef0c4"
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Inner pulse circle */}
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[4.8, 4.82, 36]} />
            <meshBasicMaterial
              color="#0E946E"
              transparent
              opacity={0.08}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicDeepSpaceProps {
  scrollProgress: number;
  activeSector: number;
}

export default function CosmicDeepSpace({ scrollProgress }: CosmicDeepSpaceProps) {
  const { camera } = useThree();
  const starsRef = useRef<THREE.Points>(null!);
  const warpLinesRef = useRef<THREE.LineSegments>(null!);
  const nebulaeRef = useRef<THREE.Group>(null!);

  const prevProgressRef = useRef(scrollProgress);
  const velocityRef = useRef(0);
  const warpIntensityRef = useRef(0);

  // 1. Generate 3,200 ambient twinkling cosmic stars in deep space tunnel
  const { starPositions, starColors, starSizes } = useMemo(() => {
    const count = 3200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color('#5ef0c4'), // Neon mint
      new THREE.Color('#0E946E'), // Emerald
      new THREE.Color('#38bdf8'), // Sky cyan
      new THREE.Color('#c084fc'), // Galactic violet
      new THREE.Color('#ffffff'), // Pure white
      new THREE.Color('#fef08a'), // Warm starlight
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 26;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius * 0.8;
      // Stretched along Z space
      positions[i3 + 2] = (Math.random() - 0.5) * 80;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = 1.0 + Math.random() * 2.6;
    }

    return { starPositions: positions, starColors: colors, starSizes: sizes };
  }, []);

  // 2. Generate Hyper-Speed Warp Streak Lines directed along the forward Z vector
  const { warpPositions, warpColors, lineCount } = useMemo(() => {
    const count = 480;
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);

    const cyanCol = new THREE.Color('#5ef0c4');
    const emeraldCol = new THREE.Color('#0E946E');
    const skyCol = new THREE.Color('#38bdf8');

    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.8 + Math.random() * 18;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.75;
      const z = -Math.random() * 45 + 5;
      const streakLength = 6 + Math.random() * 16;

      // Start vertex (deep Z)
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // End vertex (near Z - forward streak)
      positions[idx + 3] = x;
      positions[idx + 4] = y;
      positions[idx + 5] = z + streakLength;

      const col = i % 3 === 0 ? cyanCol : i % 3 === 1 ? emeraldCol : skyCol;
      // Head vertex (bright tip)
      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
      // Tail vertex (smooth fade)
      colors[idx + 3] = col.r * 0.08;
      colors[idx + 4] = col.g * 0.08;
      colors[idx + 5] = col.b * 0.08;
    }

    return { warpPositions: positions, warpColors: colors, lineCount: count };
  }, []);

  useFrame((state, delta) => {
    // Instantaneous scroll speed calculation
    const progressDiff = Math.abs(scrollProgress - prevProgressRef.current);
    prevProgressRef.current = scrollProgress;

    // Smooth velocity
    const targetVel = progressDiff * 80;
    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, targetVel, delta * 14);

    // Warp intensity target
    const targetWarp = Math.min(1.0, velocityRef.current * 1.6);
    warpIntensityRef.current = THREE.MathUtils.lerp(warpIntensityRef.current, targetWarp, delta * 10);

    // Dynamic Warp FOV expansion during travel
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = 45 + warpIntensityRef.current * 14;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 8);
      camera.updateProjectionMatrix();
    }

    // Update Warp Lines visibility & stretch
    if (warpLinesRef.current) {
      const mat = warpLinesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, warpIntensityRef.current * 0.95, delta * 12);
      warpLinesRef.current.visible = mat.opacity > 0.02;

      // Dynamically stretch lines during fast scroll
      const scaleZ = 1.0 + warpIntensityRef.current * 1.5;
      warpLinesRef.current.scale.set(1, 1, scaleZ);
    }

    // Gentle star drift along Z to give continuous forward space flight sensation
    if (starsRef.current) {
      const attr = starsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = attr.array as Float32Array;
      const speed = 0.05 + warpIntensityRef.current * 1.8;

      for (let i = 2; i < array.length; i += 3) {
        array[i] += speed;
        // Wrap around when star passes camera
        if (array[i] > 10) {
          array[i] = -60;
        }
      }
      attr.needsUpdate = true;
      starsRef.current.rotation.z += 0.0003;
    }

    // Ambient nebula breathing
    if (nebulaeRef.current) {
      nebulaeRef.current.rotation.z += 0.0002;
    }
  });

  return (
    <group name="CosmicDeepSpace">
      {/* 1. Forward-Drifting Twinkling Starfield */}
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
          size={0.15}
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

      {/* 3. Deep Space Atmospheric Cosmic Nebulae */}
      <group ref={nebulaeRef}>
        <mesh position={[0, 0, -10]}>
          <sphereGeometry args={[22, 16, 16]} />
          <meshBasicMaterial
            color="#0E946E"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[4, 2, -25]}>
          <sphereGeometry args={[28, 16, 16]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[-4, -2, -40]}>
          <sphereGeometry args={[32, 16, 16]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.045}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

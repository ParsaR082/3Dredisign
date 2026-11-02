'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraStateResult } from './InterstellarFlightPath';

interface CosmicRiftTunnelProps {
  cameraState: CameraStateResult;
  scrollProgress: number;
  isDiving?: boolean;
}

// ── CUSTOM GLSL SHADERS FOR THE COSMIC RIFT SPACE-TIME TUNNEL ──
const RiftTunnelShader = {
  uniforms: {
    uTime: { value: 0 },
    uRiftIntensity: { value: 0 },
    uCollapseWeight: { value: 0 },
    uRevealWeight: { value: 0 },
    uAnticipationWeight: { value: 0 },
    uScrollProgress: { value: 0 },
    uColorCore: { value: new THREE.Color('#00f5ff') },     // Electric cyan
    uColorEnergy: { value: new THREE.Color('#7928ca') },   // Deep violet
    uColorAccent: { value: new THREE.Color('#ff0080') },   // Magenta accent
    uColorDeep: { value: new THREE.Color('#030712') },     // Deep space black
  },
  vertexShader: `
    uniform float uTime;
    uniform float uRiftIntensity;
    uniform float uCollapseWeight;
    uniform float uRevealWeight;
    uniform float uAnticipationWeight;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistance;
    varying float vTwist;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      
      // Distance along tunnel length (z axis in local camera orientation)
      float z = pos.z;
      vDistance = z;
      
      // 1. Twisted space-time spiral rotation around travel axis
      float twistAngle = z * 0.075 + uTime * 1.8 + uCollapseWeight * 2.5;
      vTwist = twistAngle;
      float c = cos(twistAngle);
      float s = sin(twistAngle);
      vec2 twistedXY = vec2(
        pos.x * c - pos.y * s,
        pos.x * s + pos.y * c
      );
      
      // 2. Non-cylindrical irregular warping & breathing space-time ripples
      float angle = atan(pos.y, pos.x);
      float wave1 = sin(angle * 3.0 + z * 0.15 - uTime * 3.5) * 0.28;
      float wave2 = cos(angle * 5.0 - z * 0.22 + uTime * 2.8) * 0.16;
      float ripple = 1.0 + wave1 + wave2;
      
      // 3. Stage 2 Space-Time Collapse inward pinch
      float pinch = 1.0 - uCollapseWeight * 0.45 * smoothstep(10.0, 45.0, z);
      
      // 4. Stage 4 The Reveal: Grand radial expansion peeling the rift apart
      float expansion = 1.0 + uRevealWeight * 3.8 * smoothstep(5.0, 60.0, z);
      
      // Apply deformation to radial dimensions
      pos.x = twistedXY.x * ripple * pinch * expansion;
      pos.y = twistedXY.y * ripple * pinch * expansion;
      
      // Dynamic camera perspective projection
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uRiftIntensity;
    uniform float uCollapseWeight;
    uniform float uRevealWeight;
    uniform float uAnticipationWeight;
    uniform vec3 uColorCore;
    uniform vec3 uColorEnergy;
    uniform vec3 uColorAccent;
    uniform vec3 uColorDeep;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistance;
    varying float vTwist;

    void main() {
      // 1. High-speed electric energy bands flowing backwards along UV
      float stream1 = sin(vUv.y * 32.0 - uTime * 7.5 + sin(vUv.x * 16.0) * 1.8);
      float stream2 = cos(vUv.y * 18.0 - uTime * 5.0 + vTwist * 1.2);
      float electricFilaments = pow(max(0.0, stream1 * 0.6 + stream2 * 0.4), 3.2);
      
      // 2. Multi-layered chromatic plasma noise
      float plasma = sin(vUv.x * 10.0 + vUv.y * 24.0 - uTime * 3.0) *
                     cos(vUv.x * 18.0 - vUv.y * 14.0 + uTime * 4.2);
      plasma = plasma * 0.5 + 0.5;
      
      // 3. Harmonic color gradient: Electric Cyan -> Deep Violet -> Magenta Accents
      vec3 col = mix(uColorEnergy, uColorCore, smoothstep(0.2, 0.85, plasma));
      
      // Intense magenta energy streaks
      float magentaPulse = pow(max(0.0, sin(vUv.y * 22.0 - uTime * 4.0 + vUv.x * 8.0)), 5.0);
      col = mix(col, uColorAccent, magentaPulse * 0.85);
      
      // Hyper-bright white core filaments along streams
      col += vec3(0.9, 0.98, 1.0) * electricFilaments * 1.4;
      
      // 4. Fresnel rim glow at dimensional rift boundary
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = 1.0 - abs(dot(vNormal, viewDir));
      fresnel = pow(fresnel, 2.2);
      col += uColorCore * fresnel * 1.6;
      
      // 5. Opacity modulation
      // Fades smoothly at the front & rear of tunnel to prevent clipping
      float depthFade = smoothstep(-12.0, 4.0, vDistance) * (1.0 - smoothstep(45.0, 78.0, vDistance));
      
      // Overall intensity driven by Cosmic Rift stage weights
      float stageAlpha = (uRiftIntensity * 0.95 + uCollapseWeight * 0.65 + uAnticipationWeight * 0.18);
      // Dissolve during Stage 4 The Reveal
      stageAlpha *= (1.0 - uRevealWeight * 0.85);
      
      float finalAlpha = (0.28 + 0.72 * electricFilaments + fresnel * 0.5) * depthFade * stageAlpha;
      
      if (finalAlpha < 0.005) discard;
      
      gl_FragColor = vec4(col, finalAlpha);
    }
  `,
};

// ── CUSTOM SHADER FOR ROTATING COSMIC ENERGY RINGS ──
const EnergyRingShader = {
  uniforms: {
    uTime: { value: 0 },
    uRiftIntensity: { value: 0 },
    uRingIndex: { value: 0 },
    uColorCyan: { value: new THREE.Color('#00f5ff') },
    uColorViolet: { value: new THREE.Color('#7928ca') },
    uColorMagenta: { value: new THREE.Color('#ff0080') },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uRiftIntensity;
    uniform float uRingIndex;
    
    varying vec2 vUv;
    varying float vArc;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Breathing contraction and spiral expansion
      float pulse = sin(uTime * 3.5 + uRingIndex * 1.2) * 0.12;
      pos.xy *= (1.0 + pulse);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uRiftIntensity;
    uniform float uRingIndex;
    uniform vec3 uColorCyan;
    uniform vec3 uColorViolet;
    uniform vec3 uColorMagenta;
    
    varying vec2 vUv;

    void main() {
      // Rotating arcs of light around ring circumference
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float spinSpeed = (mod(uRingIndex, 2.0) == 0.0 ? 1.0 : -1.0) * (2.8 + uRingIndex * 0.4);
      float arc1 = sin(angle * 4.0 + uTime * spinSpeed);
      float arc2 = cos(angle * 6.0 - uTime * (spinSpeed * 0.7));
      float intensity = pow(max(0.0, arc1 * 0.5 + arc2 * 0.5 + 0.2), 3.0);
      
      vec3 ringColor = mod(uRingIndex, 3.0) == 0.0
        ? uColorCyan
        : mod(uRingIndex, 3.0) == 1.0
        ? uColorViolet
        : uColorMagenta;
        
      ringColor += vec3(0.8, 0.95, 1.0) * intensity * 0.7;
      
      float alpha = intensity * uRiftIntensity * 0.9;
      if (alpha < 0.01) discard;
      
      gl_FragColor = vec4(ringColor, alpha);
    }
  `,
};

// ── CUSTOM SHADER FOR GPU SWIRLING VORTEX PARTICLES ──
const ParticleVortexShader = {
  uniforms: {
    uTime: { value: 0 },
    uRiftIntensity: { value: 0 },
    uSpeed: { value: 0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uRiftIntensity;
    uniform float uSpeed;
    
    attribute float aRadius;
    attribute float aInitialAngle;
    attribute float aSpeed;
    attribute float aSize;
    attribute vec3 aColor;
    
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;
      
      // Particle streams backwards past the camera along Z axis
      // z moves from +75 down to -15, cycling continuously
      float cycleLength = 90.0;
      float zOffset = mod(position.z - uTime * (18.0 + uSpeed * 45.0) * aSpeed, cycleLength) - 15.0;
      
      // Double-helical spiral swirl around travel corridor
      float swirl = aInitialAngle + zOffset * 0.14 + uTime * (3.5 + uSpeed * 9.0) * aSpeed;
      float currentRadius = aRadius * (0.65 + 0.35 * sin(zOffset * 0.12 + uTime * 2.0));
      
      vec3 dynamicPos;
      dynamicPos.x = cos(swirl) * currentRadius;
      dynamicPos.y = sin(swirl) * currentRadius * 0.85;
      dynamicPos.z = zOffset;
      
      vec4 mvPosition = modelViewMatrix * vec4(dynamicPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Point size attenuation with camera distance
      gl_PointSize = aSize * (160.0 / -mvPosition.z) * (1.0 + uRiftIntensity * 1.2);
      
      // Fade out at extremities
      float edgeFade = smoothstep(-15.0, -2.0, zOffset) * (1.0 - smoothstep(55.0, 75.0, zOffset));
      vAlpha = edgeFade * (0.3 + uRiftIntensity * 0.7);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Circular glowing particle core
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;
      
      float core = pow(1.0 - dist * 2.0, 1.8);
      gl_FragColor = vec4(vColor, core * vAlpha);
    }
  `,
};

export default function CosmicRiftTunnel({
  cameraState,
  scrollProgress,
  isDiving = false,
}: CosmicRiftTunnelProps) {
  const { camera } = useThree();
  const rigRef = useRef<THREE.Group>(null!);
  const tunnelMeshRef = useRef<THREE.Mesh>(null!);
  const ringsGroupRef = useRef<THREE.Group>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const singularityRef = useRef<THREE.Mesh>(null!);

  // Reusable scratch vectors for camera alignment
  const scratchCamForward = useRef(new THREE.Vector3());
  const scratchCamUp = useRef(new THREE.Vector3());
  const scratchCamRight = useRef(new THREE.Vector3());
  const scratchMatrix = useRef(new THREE.Matrix4());
  const scratchQuat = useRef(new THREE.Quaternion());

  // 1. Memoize Procedural Tunnel Geometry (Tube along travel axis)
  const tunnelGeometry = useMemo(() => {
    // High-resolution open cylinder: radius 5.5, length 90 units
    const geom = new THREE.CylinderGeometry(5.2, 5.2, 90, 54, 72, true);
    // Rotate cylinder so its length extends along Z axis [from -15 to +75]
    geom.rotateX(Math.PI / 2);
    geom.translate(0, 0, 30);
    return geom;
  }, []);

  // 2. Memoize Tunnel Shader Material
  const tunnelMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(RiftTunnelShader.uniforms),
      vertexShader: RiftTunnelShader.vertexShader,
      fragmentShader: RiftTunnelShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  // 3. Memoize 10 Concentric Energy Rings
  const ringCount = 10;
  const ringDistances = useMemo(() => [6, 12, 19, 27, 36, 45, 54, 63, 72, 82], []);
  const ringMaterials = useMemo(() => {
    return ringDistances.map((_, i) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(EnergyRingShader.uniforms),
        vertexShader: EnergyRingShader.vertexShader,
        fragmentShader: EnergyRingShader.fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      mat.uniforms.uRingIndex.value = i;
      return mat;
    });
  }, [ringDistances]);

  const ringGeometry = useMemo(() => {
    return new THREE.RingGeometry(4.2, 5.5, 48);
  }, []);

  // 4. Memoize 1,200 Swirling GPU Helical Particles
  const { particlePositions, particleRadius, particleAngles, particleSpeeds, particleSizes, particleColors } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const radius = new Float32Array(count);
    const angles = new Float32Array(count);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#00f5ff'), // Electric cyan
      new THREE.Color('#7928ca'), // Deep violet
      new THREE.Color('#ff0080'), // Magenta accent
      new THREE.Color('#38bdf8'), // Sky blue
      new THREE.Color('#ffffff'), // White starlight
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Z spread through corridor [-15 to +75]
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = -15 + Math.random() * 90;

      radius[i] = 1.8 + Math.pow(Math.random(), 0.7) * 4.6;
      angles[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.7 + Math.random() * 0.8;
      sizes[i] = 1.2 + Math.random() * 2.8;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    return {
      particlePositions: positions,
      particleRadius: radius,
      particleAngles: angles,
      particleSpeeds: speeds,
      particleSizes: sizes,
      particleColors: colors,
    };
  }, []);

  const particleGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    geom.setAttribute('aRadius', new THREE.BufferAttribute(particleRadius, 1));
    geom.setAttribute('aInitialAngle', new THREE.BufferAttribute(particleAngles, 1));
    geom.setAttribute('aSpeed', new THREE.BufferAttribute(particleSpeeds, 1));
    geom.setAttribute('aSize', new THREE.BufferAttribute(particleSizes, 1));
    geom.setAttribute('aColor', new THREE.BufferAttribute(particleColors, 3));
    return geom;
  }, [particlePositions, particleRadius, particleAngles, particleSpeeds, particleSizes, particleColors]);

  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(ParticleVortexShader.uniforms),
      vertexShader: ParticleVortexShader.vertexShader,
      fragmentShader: ParticleVortexShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // 5. Stage 2 Space-Time Collapse Singularity Ring (Accretion Disk)
  const singularityGeometry = useMemo(() => new THREE.RingGeometry(0.8, 8.5, 64), []);
  const singularityMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#00f5ff',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  // Frame Loop: Update Rig position & orientation, uniforms, and stage animations
  useFrame((state, delta) => {
    // If diving on a 2D screen or not transitioning, hide the rift completely
    const isTransitioning = cameraState.isTransitioning && !isDiving;
    const warp = cameraState.warpIntensity;

    if (!rigRef.current) return;

    // Fast visibility cull: If resting at a station, hide entire rig to free GPU
    if (!isTransitioning || warp < 0.005) {
      rigRef.current.visible = false;
      return;
    }

    rigRef.current.visible = true;

    // 1. Position the rig precisely at camera world position
    rigRef.current.position.copy(camera.position);

    // 2. Orient the rig so its +Z axis points directly in the camera's travel direction
    // Flight tangent vector
    const tangent = cameraState.tangent;
    const upVector = cameraState.normalVector;
    const rightVector = cameraState.binormalVector;

    // Align local Z with tangent, local Y with upVector, local X with rightVector
    scratchCamForward.current.copy(tangent).normalize();
    scratchCamRight.current.copy(rightVector).normalize();
    scratchCamUp.current.copy(upVector).normalize();

    scratchMatrix.current.makeBasis(
      scratchCamRight.current,
      scratchCamUp.current,
      scratchCamForward.current
    );
    scratchQuat.current.setFromRotationMatrix(scratchMatrix.current);
    rigRef.current.quaternion.copy(scratchQuat.current);

    // 3. Update Tunnel Shader Uniforms
    const elapsedTime = state.clock.getElapsedTime();
    tunnelMaterial.uniforms.uTime.value = elapsedTime;
    tunnelMaterial.uniforms.uRiftIntensity.value = cameraState.riftWeight;
    tunnelMaterial.uniforms.uCollapseWeight.value = cameraState.collapseWeight;
    tunnelMaterial.uniforms.uRevealWeight.value = cameraState.revealWeight;
    tunnelMaterial.uniforms.uAnticipationWeight.value = cameraState.anticipationWeight;
    tunnelMaterial.uniforms.uScrollProgress.value = scrollProgress;

    // 4. Update Rotating Energy Rings Uniforms & Spin
    ringMaterials.forEach((mat) => {
      mat.uniforms.uTime.value = elapsedTime;
      mat.uniforms.uRiftIntensity.value = cameraState.riftWeight;
    });

    if (ringsGroupRef.current) {
      ringsGroupRef.current.children.forEach((child, idx) => {
        const ringMesh = child as THREE.Mesh;
        const dir = idx % 2 === 0 ? 1 : -1;
        ringMesh.rotation.z += delta * (1.5 + idx * 0.25) * dir;
      });
    }

    // 5. Update Particle Vortex Uniforms
    particleMaterial.uniforms.uTime.value = elapsedTime;
    particleMaterial.uniforms.uRiftIntensity.value = cameraState.riftWeight;
    particleMaterial.uniforms.uSpeed.value = cameraState.speed;

    // 6. Stage 2 Space-Time Collapse Singularity Ring
    if (singularityRef.current) {
      const collapseW = cameraState.collapseWeight;
      singularityMaterial.opacity = collapseW * 0.85;
      singularityRef.current.visible = collapseW > 0.01;
      if (singularityRef.current.visible) {
        singularityRef.current.rotation.z += delta * 6.0;
        // Inward breathing scale
        const scale = 1.0 - collapseW * 0.45;
        singularityRef.current.scale.set(scale, scale, 1);
      }
    }
  });

  return (
    <group ref={rigRef} name="CosmicRiftTunnelRig" visible={false}>
      {/* 1. The Twisted Procedural Space-Time Tunnel */}
      <mesh
        ref={tunnelMeshRef}
        geometry={tunnelGeometry}
        material={tunnelMaterial}
        renderOrder={10}
      />

      {/* 2. Concentric Rotating Cosmic Energy Rings */}
      <group ref={ringsGroupRef} name="CosmicRiftEnergyRings">
        {ringDistances.map((dist, idx) => (
          <mesh
            key={idx}
            position={[0, 0, dist]}
            geometry={ringGeometry}
            material={ringMaterials[idx]}
            renderOrder={11}
          />
        ))}
      </group>

      {/* 3. GPU Swirling Helical Particle Vortex */}
      <points
        ref={particlesRef}
        geometry={particleGeometry}
        material={particleMaterial}
        renderOrder={12}
      />

      {/* 4. Stage 2 Space-Time Collapse Singularity (Accretion Vortex Disk) */}
      <mesh
        ref={singularityRef}
        position={[0, 0, 32]}
        geometry={singularityGeometry}
        material={singularityMaterial}
        renderOrder={13}
        visible={false}
      />
    </group>
  );
}

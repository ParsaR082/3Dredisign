'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import DigitalArchitectureCampus from './DigitalArchitectureCampus';
import { ProjectTVConfig, DiveTargetConfig, DivePhase } from './stationsConfig';

interface Props {
  scrollProgress: number;
  activeSector: number;
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

// Lightweight React Error Boundary for WebGL initialization and rendering failures
interface WebGLErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends React.Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[CampusCanvas] WebGL render error intercepted by ErrorBoundary:', error?.message);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Child component inside Canvas to handle WebGL context loss and restoration with clean event cleanup
function WebGLContextWatcher({
  onContextLost,
  onContextRestored,
}: {
  onContextLost: () => void;
  onContextRestored: () => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const domEl = gl?.domElement;
    if (!domEl) return;

    const handleLost = (event: Event) => {
      event.preventDefault();
      console.warn('[CampusCanvas] WebGL context lost event fired.');
      onContextLost();
    };

    const handleRestored = () => {
      console.info('[CampusCanvas] WebGL context restored event fired.');
      onContextRestored();
    };

    domEl.addEventListener('webglcontextlost', handleLost, false);
    domEl.addEventListener('webglcontextrestored', handleRestored, false);

    return () => {
      domEl.removeEventListener('webglcontextlost', handleLost);
      domEl.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
}

// Visual ambient static fallback that matches the brand spatial identity without requiring WebGL
function AmbientStaticFallback() {
  return (
    <div
      data-testid="ambient-static-fallback"
      className="fixed inset-0 w-full h-full bg-[#070B12] pointer-events-none -z-10 overflow-hidden"
    >
      {/* Subtle architectural geometric grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15" />
      {/* Ambient luminous glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/5 rounded-full blur-[180px]" />
    </div>
  );
}

// Client-side detection of actual WebGL context creation capability
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  // Controlled simulation hook for testing fallback behavior without disabling OS drivers
  if ((window as unknown as { __FORCE_WEBGL_FALLBACK?: boolean }).__FORCE_WEBGL_FALLBACK) {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export default function CampusCanvas(props: Props) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check reduced motion media query
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(m.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    m.addEventListener?.('change', motionHandler);

    // Check client WebGL context creation capability
    const supported = checkWebGLSupport();
    setWebglSupported(supported);

    return () => {
      m.removeEventListener?.('change', motionHandler);
    };
  }, []);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextLost(false);
  }, []);

  const handleBoundaryError = useCallback(() => {
    setWebglSupported(false);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#070B12] pointer-events-none -z-10" />
    );
  }

  // Use static fallback if reduced motion is requested, WebGL is unsupported, or context was lost
  if (reducedMotion || !webglSupported || contextLost) {
    return <AmbientStaticFallback />;
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden touch-none overscroll-none">
      <WebGLErrorBoundary fallback={<AmbientStaticFallback />} onError={handleBoundaryError}>
        <Canvas
          camera={{ position: [0, 5.0, 15], fov: 45, near: 0.1, far: 260 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <WebGLContextWatcher
            onContextLost={handleContextLost}
            onContextRestored={handleContextRestored}
          />
          <React.Suspense fallback={null}>
            <DigitalArchitectureCampus {...props} />
          </React.Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

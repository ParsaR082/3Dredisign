'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useProgress } from '@react-three/drei';
import { Sparkles, Box, Cpu, CheckCircle2, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';

interface ExperienceLoaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
  skipIfReturning?: boolean;
}

export default function ExperienceLoader({
  onLoaded,
  minDurationMs = 1200,
  skipIfReturning = true,
}: ExperienceLoaderProps) {
  const { active, progress, loaded, total, item } = useProgress();

  // If user is returning from detail page dive, skip loader immediately
  const isReturning = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return Boolean(urlParams.get('returnFrom') || sessionStorage.getItem('last_dive_target'));
    } catch (_) {
      return false;
    }
  }, []);

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(!isReturning || !skipIfReturning);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const completedRef = useRef<boolean>(false);

  // Clean filename of currently loading item for display
  const currentFileName = useMemo(() => {
    if (!item) return '';
    try {
      const clean = decodeURIComponent(item).split('/').pop()?.split('?')[0] || '';
      return clean.length > 25 ? clean.slice(0, 22) + '...' : clean;
    } catch (_) {
      return '';
    }
  }, [item]);

  // Dynamic status text based on progress
  const statusMessage = useMemo(() => {
    if (displayProgress < 20) {
      return 'اتصال به موتور رندر فضایی و راه‌اندازی شتاب‌دهنده گرافیکی...';
    }
    if (displayProgress < 45) {
      return 'دریافت معماری سه‌بعدی پردیس و استودیوهای دیجیتال...';
    }
    if (displayProgress < 70) {
      return 'بارگذاری المان‌های تعاملی، بافت‌ها و متریال‌های بصری...';
    }
    if (displayProgress < 90) {
      return 'کامپایل شیدرها، پردازش نورپردازی سینماتیک و سایه‌ها...';
    }
    if (displayProgress < 100) {
      return 'بهینه‌سازی نرخ فریم (60 FPS) و آماده‌سازی نهایی...';
    }
    return 'معماری سه‌بعدی اروم‌سیما با موفقیت بارگذاری شد';
  }, [displayProgress]);

  // Smooth progress interpolation & tick loop
  useEffect(() => {
    if (isReturning && skipIfReturning) {
      setIsMounted(false);
      onLoaded?.();
      return;
    }

    let rafId: number;

    const tick = () => {
      setDisplayProgress((prev) => {
        // Natural gradual crawl up to 18% during initial connection
        const target = Math.max(progress, 18);
        const diff = target - prev;

        if (diff > 0.1) {
          // Smooth ease toward target
          const step = Math.max(diff * 0.12, 0.4);
          return Math.min(prev + step, 100);
        }

        return prev;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Show quick skip button after 2.8 seconds if user is on slow connection
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 2800);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(skipTimer);
    };
  }, [progress, isReturning, skipIfReturning, onLoaded]);

  // Trigger completion once assets finish and min duration elapsed
  useEffect(() => {
    if (completedRef.current) return;

    const isComplete = (!active && progress >= 100) || displayProgress >= 99.5;
    const elapsed = Date.now() - startTimeRef.current;

    if (isComplete) {
      const remainingTime = Math.max(0, minDurationMs - elapsed);

      const finishTimer = setTimeout(() => {
        completedRef.current = true;
        setDisplayProgress(100);

        // Hold at 100% for 350ms to show the "ready" state, then initiate fade out
        const fadeTimer = setTimeout(() => {
          setIsFadingOut(true);
          onLoaded?.();

          // After fade transition (750ms), unmount from DOM completely
          const unmountTimer = setTimeout(() => {
            setIsMounted(false);
          }, 750);

          return () => clearTimeout(unmountTimer);
        }, 350);

        return () => clearTimeout(fadeTimer);
      }, remainingTime);

      return () => clearTimeout(finishTimer);
    }
  }, [active, progress, displayProgress, minDurationMs, onLoaded]);

  // Fallback safety timeout (maximum 9 seconds)
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        setDisplayProgress(100);
        setIsFadingOut(true);
        onLoaded?.();
        setTimeout(() => setIsMounted(false), 750);
      }
    }, 9000);

    return () => clearTimeout(safetyTimer);
  }, [onLoaded]);

  const handleManualEnter = () => {
    completedRef.current = true;
    setDisplayProgress(100);
    setIsFadingOut(true);
    onLoaded?.();
    setTimeout(() => setIsMounted(false), 750);
  };

  if (!isMounted) return null;

  const roundedPercent = Math.min(100, Math.round(displayProgress));

  return (
    <div
      data-testid="experience-loader"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070B12] text-white transition-all duration-700 ease-out select-none overflow-hidden ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      style={{ direction: 'rtl' }}
    >
      {/* ── BACKGROUND AMBIENT GLOWS & GRID ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* ── MAIN HOLOGRAPHIC CORE CARD ── */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Holographic Gyroscope / Orbital Loader */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-8">
          {/* Outer dashed spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-400/30 animate-spin-slow" />

          {/* Middle counter-rotating neon ring */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border-2 border-cyan-400/40 border-t-transparent border-b-transparent animate-spin-reverse-slow" />

          {/* Inner glowing pulse ring */}
          <div className="absolute inset-6 sm:inset-7 rounded-full border border-emerald-400/50 bg-emerald-500/5 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.25)] animate-pulse" />

          {/* Central 3D Core Logo / Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {roundedPercent === 100 ? (
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 animate-bounce transition-transform" />
            ) : (
              <Box className="w-9 h-9 sm:w-11 sm:h-11 text-brand-400 animate-pulse transition-transform" />
            )}
          </div>

          {/* Orbiting particle dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_10px_#34D399]" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22D3EE]" />
        </div>

        {/* ── BRANDING & SUBTITLE ── */}
        <div className="space-y-1.5 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-white drop-shadow-md">
              اروم سیما <span className="text-brand-400 text-lg font-light tracking-normal">| پردیس ۳D</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            استودیو معماری دیجیتال و تجربه تعاملی وب سه‌بعدی
          </p>
        </div>

        {/* ── PROGRESS BAR CONTAINER ── */}
        <div className="w-full space-y-3 mb-6">
          {/* Header over bar: Percentage + Asset Count */}
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-gray-300 px-1">
            <span className="flex items-center gap-1.5 text-brand-300">
              <Cpu className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>{roundedPercent}٪</span>
            </span>

            {total > 0 && (
              <span className="text-[11px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                {loaded} / {total} آبجکت
              </span>
            )}
          </div>

          {/* Modern High-Tech Gradient Progress Bar */}
          <div className="relative w-full h-2.5 sm:h-3 rounded-full bg-[#111827]/90 border border-white/10 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-l from-brand-400 via-teal-400 to-emerald-500 transition-all duration-300 ease-out shadow-[0_0_18px_rgba(52,211,153,0.7)] relative"
              style={{ width: `${displayProgress}%` }}
            >
              {/* Glowing Leading Edge */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-white/70 blur-[2px] rounded-full" />
            </div>
          </div>

          {/* Status Message */}
          <p className="text-xs sm:text-[13px] text-gray-300/90 font-medium h-6 flex items-center justify-center transition-all">
            {statusMessage}
          </p>

          {/* Currently loading file indicator (if available) */}
          {currentFileName && displayProgress < 100 && (
            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 font-mono tracking-tight dir-ltr">
              <span className="text-brand-400/80">لود فایل:</span>
              <span className="text-gray-300 bg-black/30 border border-white/5 px-2 py-0.5 rounded">
                {currentFileName}
              </span>
            </div>
          )}
        </div>

        {/* ── QUICK SKIP BUTTON (Appears if network takes longer) ── */}
        {showSkipButton && displayProgress < 100 && (
          <button
            onClick={handleManualEnter}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-500/40 backdrop-blur-md transition-all duration-200 group cursor-pointer shadow-lg"
          >
            <span>ورود مستقیم به محیط</span>
            <ArrowLeft className="w-3.5 h-3.5 text-brand-400 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* ── BOTTOM BRAND FOOTER BADGE ── */}
      <div className="absolute bottom-6 sm:bottom-8 flex items-center gap-2 text-[11px] text-gray-400 bg-black/40 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
        <span>رندر بی‌درنگ ۶۰ فریم بر ثانیه (WebGL 2.0 Accelerated)</span>
      </div>
    </div>
  );
}

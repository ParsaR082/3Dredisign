'use client';

import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Compass,
  CheckCircle2,
  Code,
  TrendingUp,
  Megaphone,
  Video,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { LandingData, SiteSettings } from '@/types/content';

interface HeroBillboardProps {
  scrollProgress: number; // 0.0 to 1.0 from parent HomeView
  landing: LandingData;
  settings: SiteSettings;
  onExploreServices: () => void;
  onExploreProjects: () => void;
}

export default function HeroBillboard({
  scrollProgress,
  landing,
  settings,
  onExploreServices,
  onExploreProjects,
}: HeroBillboardProps) {
  // ── 1. AUTHENTIC PHYSICAL CARD FALLING CHOREOGRAPHY ──
  // The Card stands upright on the ground and unlatches, accelerates downward
  // with gravitational rotation around its bottom hinge, and slams flat onto the runway floor.
  // The entire fall occurs across scrollProgress 0.00 to 0.16.
  const heroT = Math.min(1, Math.max(0, scrollProgress / 0.16));

  const physics = useMemo(() => {
    // Stage 0: Initial pure 2D corporate website (Scroll = 0)
    if (heroT <= 0.015) {
      return {
        tiltX: 0,
        backdropOpacity: 1, // 100% solid, hides all 3D canvas
        shockwaveOpacity: 0,
        shockwaveScale: 0.2,
        isLanded: false,
        rumbleY: 0,
      };
    }

    // Stage 1: Mechanical Unlatch & Cable Tension (0.015 -> 0.08)
    if (heroT < 0.08) {
      const p = (heroT - 0.015) / 0.065;
      // Anticipation jerk: slight upward tension shudder before falling
      const recoilLift = -Math.sin(p * Math.PI) * 1.5; // degrees
      const shake = Math.sin(p * Math.PI * 6) * 1.2;
      return {
        tiltX: recoilLift,
        backdropOpacity: Math.max(0, 1 - p * 0.4),
        shockwaveOpacity: 0,
        shockwaveScale: 0.2,
        isLanded: false,
        rumbleY: shake,
      };
    }

    // Stage 2: Accelerated Gravitational Free Fall (0.08 -> 0.78)
    if (heroT < 0.78) {
      const p = (heroT - 0.08) / 0.70;
      // Quadratic gravity acceleration curve: starts smoothly, crashes fast
      const fallCurve = Math.pow(p, 2.3);
      // Card rotates backward around its bottom hinge all the way down to the runway floor (88 deg)
      const tiltX = fallCurve * 88.0;
      const backdropOpacity = Math.max(0, 0.6 - p * 0.6);

      return {
        tiltX,
        backdropOpacity,
        shockwaveOpacity: 0,
        shockwaveScale: 0.2,
        isLanded: false,
        rumbleY: 0,
      };
    }

    // Stage 3: Seismic Touchdown Slam & Damped Harmonic Recoil (0.78 -> 0.96)
    if (heroT < 0.96) {
      const p = (heroT - 0.78) / 0.18;
      // Heavy card hits the ground and rebounds with damped harmonic oscillation
      const bounce = -Math.sin(p * Math.PI * 3.4) * Math.exp(-p * 4.6) * 5.8; // degrees
      const tiltX = 88.0 + bounce;
      const shockwaveOpacity = Math.max(0, (1 - p * 1.6) * 0.95);
      const shockwaveScale = 0.2 + p * 3.2;
      const rumble = Math.sin(p * Math.PI * 8) * Math.exp(-p * 5) * 4;

      return {
        tiltX,
        backdropOpacity: 0,
        shockwaveOpacity,
        shockwaveScale,
        isLanded: true,
        rumbleY: rumble,
      };
    }

    // Stage 4: Settled Monumental Card Resting Flat on Runway (0.96 -> 1.0)
    return {
      tiltX: 88.0,
      backdropOpacity: 0,
      shockwaveOpacity: 0,
      shockwaveScale: 3.2,
      isLanded: true,
      rumbleY: 0,
    };
  }, [heroT]);

  // Authentic Ticker Items from urumsima.ir
  const tickerItems = [
    'پشتیبانی ۲۴/۷',
    'اجرای صدها پروژه موفق در ارومیه و سراسر کشور',
    'تحویل به‌موقع پروژه ها',
    'ضمانت کیفیت',
    'طراحی ریسپانسیو (موبایل فرندلی)',
    'سئو فنی قوی',
  ];

  // When camera flies forward past the gate (scrollProgress > 0.22), disable pointer events
  // but keep the card in place on the runway floor
  const isPastGate = scrollProgress > 0.22;

  return (
    <div
      id="sector-hero"
      className="relative w-full h-full flex flex-col justify-end items-center select-none"
      style={{
        transform: `translateY(${physics.rumbleY}px)`,
        pointerEvents: isPastGate ? 'none' : 'auto',
      }}
    >
      {/* ── 0. OPAQUE SOLID COVERING FOR INITIAL 2D STATE ── */}
      {/* When scroll = 0, this is 100% solid #050c0a so ZERO 3D is visible */}
      <div
        className="fixed inset-0 bg-[#050c0a] pointer-events-none transition-opacity duration-150 -z-5"
        style={{
          opacity: physics.backdropOpacity,
        }}
        aria-hidden="true"
      />

      {/* ── 1. 3D BILLBOARD STAGE CONTAINER (PERSPECTIVE PROJECTION) ── */}
      {/* Perspective origin locked to bottom center (ground hinge axis) */}
      <div
        className="relative w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col justify-end items-center px-3 sm:px-6"
        style={{
          perspective: '1600px',
          perspectiveOrigin: '50% 100%',
        }}
      >
        {/* Ground Touchdown Shockwave Light Pulse */}
        {physics.shockwaveOpacity > 0.01 && (
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[850px] h-[350px] rounded-full pointer-events-none blur-2xl z-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(16,185,129,0.85) 0%, rgba(14,148,110,0.35) 45%, transparent 70%)',
              opacity: physics.shockwaveOpacity,
              transform: `translateX(-50%) scale(${physics.shockwaveScale})`,
              transition: 'opacity 0.04s ease-out',
            }}
          />
        )}

        {/* ── 2. THE MONUMENTAL BILLBOARD CARD (PHYSICAL HINGE AT BOTTOM) ── */}
        <div
          className="billboard-chassis relative w-full h-[calc(100vh-84px)] max-h-[720px] rounded-3xl border-2 border-emerald-500/40 bg-[#050C0A] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(16,185,129,0.18)] overflow-hidden flex flex-col justify-between transition-transform duration-75 ease-out z-10"
          style={{
            transformOrigin: '50% 100%',
            transform: `rotateX(${physics.tiltX}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Top Industrial Cable Suspension Brackets (Detaches during unlatching) */}
          <div
            className="absolute -top-7 left-10 right-10 flex justify-between items-center pointer-events-none transition-opacity duration-300 z-30"
            style={{ opacity: heroT > 0.01 ? 1 : 0 }}
          >
            {/* Left High-Tension Suspension Anchor */}
            <div className="flex flex-col items-center">
              <div className="w-1.5 h-10 bg-gradient-to-t from-gray-400 via-gray-600 to-transparent shadow-lg" />
              <div className="w-6 h-6 rounded-md bg-[#1E293B] border-2 border-emerald-500/60 shadow-lg flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Stadium Floodlight Fixtures */}
            <div className="flex items-center gap-16">
              {[0, 1].map((idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-1 h-6 bg-gray-600" />
                  <div className="w-8 h-4 rounded-t-sm bg-gradient-to-b from-[#334155] to-[#1E293B] border border-gray-500 shadow-md flex items-center justify-center">
                    <span className="w-5 h-1 rounded-full bg-amber-200/90 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right High-Tension Suspension Anchor */}
            <div className="flex flex-col items-center">
              <div className="w-1.5 h-10 bg-gradient-to-t from-gray-400 via-gray-600 to-transparent shadow-lg" />
              <div className="w-6 h-6 rounded-md bg-[#1E293B] border-2 border-emerald-500/60 shadow-lg flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Glowing Top Emerald Neon Conduit Trim */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-600 z-30 shadow-[0_0_12px_#10B981]" />

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ── PART A: TEAM BANNER (ALL HEADS & SUITS 100% VISIBLE) ── */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="relative w-full h-44 sm:h-52 md:h-60 shrink-0 overflow-hidden bg-[#050c0a] group">
            <img
              src="/images/team-hero-framed.webp"
              alt="تیم متخصصان اروم سیما"
              width={1920}
              height={490}
              className="w-full h-full object-cover object-[center_top] filter contrast-[1.05] group-hover:contrast-[1.08] transition-all duration-700"
              loading="eager"
            />

            {/* Subtle Vignettes (Preserves all hair and facial features) */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050c0a] to-transparent pointer-events-none z-10" />

            {/* Authentic "THE TEAM" Label Badge */}
            <div className="absolute bottom-3 right-6 sm:right-8 z-20 flex items-center gap-2 pointer-events-none">
              <div className="w-6 h-[1.5px] bg-[#5ef0c4] opacity-80" />
              <span className="text-[10px] font-bold tracking-[2.5px] text-[#5ef0c4] uppercase opacity-90 font-mono">
                THE TEAM
              </span>
            </div>

            {/* Industrial Chassis Telemetry Stamp */}
            <div
              className="absolute top-3 left-5 z-20 hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/60 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 backdrop-blur-md transition-opacity duration-300"
              style={{ opacity: heroT > 0.05 ? 1 : 0 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>CARD MONOLITH // GROUND-HINGED</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ── PART B: MARQUEE TICKER (EXACT TICKER FROM URUMSIMA.IR) ── */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="relative w-full bg-[#080f0d] border-y border-emerald-950/40 py-2 sm:py-2.5 shrink-0 overflow-hidden z-20">
            {/* Fade Edges */}
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#080f0d] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#080f0d] to-transparent z-10 pointer-events-none" />

            {/* Continuous Infinite Sliding Marquee Track */}
            <div className="flex ticker-track-infinite w-max">
              {[...tickerItems, ...tickerItems, ...tickerItems].map((txt, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-6 sm:px-8 whitespace-nowrap text-xs sm:text-xs font-semibold text-emerald-100/70 hover:text-emerald-300 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E946E] shadow-[0_0_8px_#10B981] flex-shrink-0" />
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ── PART C: CORE HERO CONTENT (TEXT, PILLS & STRATEGIC CTAS) ── */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="relative w-full px-4 sm:px-8 py-5 sm:py-7 flex-1 flex flex-col justify-between text-center bg-[#050c0a]">
            {/* Ambient Grid and Radial Glow */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[250px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {/* Official Main Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                <span className="block text-gray-100">اروم سیما؛</span>
                <span className="block mt-1 bg-gradient-to-r from-[#34d399] via-[#0E946E] to-[#14B8A6] bg-clip-text text-transparent">
                  آژانس دیجیتال مارکتینگ در ارومیه
                </span>
              </h1>

              {/* Separator rule */}
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#0E946E] to-transparent mx-auto rounded-full" />

              {/* Subtitle / Description */}
              <p className="text-xs sm:text-sm text-[#8ab5a7] max-w-xl mx-auto leading-relaxed font-light">
                تیمی از متخصصان طراحی سایت، سئو و تولید محتوا در ارومیه؛ از ایده تا اجرا، با خلاقیت و شناخت عمیق بازار کنار شما هستیم تا برندتان دیده شود.
              </p>

              {/* Quick Service Pills */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {[
                  { label: 'طراحی سایت', icon: Code },
                  { label: 'سئو حرفه‌ای', icon: TrendingUp },
                  { label: 'تبلیغات دیجیتال', icon: Megaphone },
                  { label: 'تولید محتوا', icon: Video },
                ].map((srv, idx) => {
                  const Icon = srv.icon;
                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-800/40 text-xs font-medium text-emerald-200/90 shadow-sm"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#34d399]" />
                      <span>{srv.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Strategic Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onExploreServices}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#0E946E] via-[#10B981] to-[#047857] hover:from-[#10B981] hover:to-[#059669] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>مشاهده خدمات استراتژیک</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreProjects}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-emerald-100 font-bold text-xs sm:text-sm border border-emerald-900/50 hover:border-emerald-500/50 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#34d399]" />
                  <span>بررسی پروژه‌های شاخص</span>
                </button>
              </div>

              {/* Trust Signals Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-gray-400 font-medium border-t border-emerald-950/40 max-w-lg mx-auto">
                <div className="flex items-center gap-1 text-gray-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>پشتیبانی ۲۴/۷</span>
                </div>
                <span className="text-emerald-900">•</span>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>تحویل به‌موقع</span>
                </div>
                <span className="text-emerald-900">•</span>
                <div className="flex items-center gap-1 text-gray-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>ضمانت کیفیت</span>
                </div>
                <span className="text-emerald-900">•</span>
                <div className="flex items-center gap-1 text-gray-300">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>مشاوره رایگان</span>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ── PART D: HEAVY INDUSTRIAL GROUND HINGE MOUNTS ── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* These hinge feet visually plant the card firmly on the runway floor */}
            <div className="relative w-full pt-2 flex justify-between items-center px-10 pointer-events-none">
              {/* Left Ground Pivot Foot */}
              <div className="flex items-center gap-1.5">
                <div className="w-12 sm:w-16 h-3.5 bg-[#1E293B] border border-emerald-500/60 rounded-t-sm shadow-md flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 hidden sm:inline">PIVOT-L</span>
              </div>

              {/* Center Ground Anchor Rail */}
              <div className="w-32 sm:w-48 h-1.5 bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />

              {/* Right Ground Pivot Foot */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-gray-500 hidden sm:inline">PIVOT-R</span>
                <div className="w-12 sm:w-16 h-3.5 bg-[#1E293B] border border-emerald-500/60 rounded-t-sm shadow-md flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

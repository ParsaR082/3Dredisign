'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  PhoneCall,
  Compass,
  Calculator,
  Layers,
  Trophy,
  MapPin,
  Clock,
  Instagram,
  Send,
} from 'lucide-react';
import CampusCanvas from '@/components/3d/CampusCanvas';
import SpatialHUD from '@/components/3d/SpatialHUD';
import { PORTFOLIO_TVS_CONFIG } from '@/components/3d/stationsConfig';
import type { LandingData, Service, Project, SiteSettings } from '@/types/content';

interface HomeViewProps {
  landing: LandingData;
  services: Service[];
  projects: Project[];
  settings: SiteSettings;
}

export default function HomeView({
  landing,
  services,
  projects,
  settings,
}: HomeViewProps) {
  const router = useRouter();

  // ── VIRTUAL SMOOTH SPATIAL SCROLL CONTROLLER ──
  // The HTML window does NOT scroll down. Wheel and touch inputs smoothly drive
  // scrollProgress, keeping the hero card grounded and eliminating page shifting.
  const [targetProgress, setTargetProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSector, setActiveSector] = useState(0);
  const [hoveredServiceSlug, setHoveredServiceSlug] = useState<string | null>(null);
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string | null>(null);

  // Toggle for 2D overlay panels (hidden by default for clean 3D experience)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Growth calculator interactive state
  const [calcBudget, setCalcBudget] = useState<number>(45); // in millions

  // Target progress ref for event handlers to avoid stale closures
  const targetProgressRef = useRef(0);
  targetProgressRef.current = targetProgress;

  // Silky smooth damping interpolation loop
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setScrollProgress((curr) => {
        const diff = targetProgressRef.current - curr;
        if (Math.abs(diff) < 0.0003) return targetProgressRef.current;
        return curr + diff * 0.14;
      });
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Update activeSector based on scrollProgress
  useEffect(() => {
    if (scrollProgress < 0.18) setActiveSector(0);
    else if (scrollProgress < 0.42) setActiveSector(1);
    else if (scrollProgress < 0.68) setActiveSector(2);
    else if (scrollProgress < 0.88) setActiveSector(3);
    else setActiveSector(4);
  }, [scrollProgress]);

  // Jump to specific sector waypoint
  const handleJumpToSector = useCallback((sectorIndex: number) => {
    const waypoints = [0.0, 0.28, 0.55, 0.78, 0.98];
    const target = waypoints[sectorIndex] ?? 0;
    targetProgressRef.current = target;
    setTargetProgress(target);
  }, []);

  // Mouse Wheel listener: Prevents standard window scroll down, drives 3D spatial progress
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Allow internal scrolling inside docked card containers
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest('.allow-card-scroll');
      if (scrollable) {
        const isAtTop = scrollable.scrollTop <= 0 && e.deltaY < 0;
        const isAtBottom =
          scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2 &&
          e.deltaY > 0;
        if (!isAtTop && !isAtBottom) {
          return; // Allow native scroll inside the card
        }
      }

      e.preventDefault();
      const delta = e.deltaY * 0.00042;
      const next = Math.min(1, Math.max(0, targetProgressRef.current + delta));
      targetProgressRef.current = next;
      setTargetProgress(next);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // Touch listener for mobile devices / trackpad swipe
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('.allow-card-scroll')) return;

      const deltaY = startY - e.touches[0].clientY;
      startY = e.touches[0].clientY;
      const next = Math.min(1, Math.max(0, targetProgressRef.current + deltaY * 0.0009));
      targetProgressRef.current = next;
      setTargetProgress(next);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(1, targetProgressRef.current + 0.08);
        targetProgressRef.current = next;
        setTargetProgress(next);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const next = Math.max(0, targetProgressRef.current - 0.08);
        targetProgressRef.current = next;
        setTargetProgress(next);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelectServiceFrom3D = (slug: string) => {
    const service = services.find((s) => s.slug === slug);
    if (service) {
      router.push(service.dedicated_url || ('/services/' + service.slug + '/'));
    }
  };

  const handleSelectProjectFrom3D = (slug: string) => {
    router.push('/portfolio/' + slug + '/');
  };

  // Dynamic mapping of backend/database projects to the 4 3D TV displays
  const portfolioTVs = useMemo(() => {
    if (!projects || projects.length === 0) return undefined;
    return PORTFOLIO_TVS_CONFIG.map((tvDefault, idx) => {
      const p = projects[idx];
      if (!p) return tvDefault;
      return {
        ...tvDefault,
        slug: p.slug || tvDefault.slug,
        title: p.title || tvDefault.title,
        category: p.category || tvDefault.category,
        kpi: p.kpis?.[0]?.value || tvDefault.kpi,
        screenImage: p.thumbnail_image || tvDefault.screenImage,
      };
    });
  }, [projects]);

  return (
    <div className="fixed inset-0 overflow-hidden text-gray-100 select-none">
      {/* ── PERSISTENT 3D DIGITAL ARCHITECTURE BACKGROUND ── */}
      <CampusCanvas
        scrollProgress={scrollProgress}
        activeSector={activeSector}
        hoveredServiceSlug={hoveredServiceSlug}
        hoveredProjectSlug={hoveredProjectSlug}
        portfolioProjects={portfolioTVs}
        onSelectService={handleSelectServiceFrom3D}
        onSelectProject={handleSelectProjectFrom3D}
        onHoverService={setHoveredServiceSlug}
        onHoverProject={setHoveredProjectSlug}
        onExploreServices={() => handleJumpToSector(1)}
        onExploreProjects={() => handleJumpToSector(2)}
      />

      {/* ── SPATIAL NAVIGATION HUD ── */}
      <SpatialHUD
        activeSector={activeSector}
        scrollProgress={scrollProgress}
        onJumpToSector={handleJumpToSector}
        isOverlayVisible={isOverlayVisible}
        onToggleOverlay={() => setIsOverlayVisible((prev) => !prev)}
      />

      {/* ── دکمه فلش‌طور کناره صفحه برای مشاهده توضیحات (در حالت عادی مخفی) ── */}
      {scrollProgress > 0.08 && !isOverlayVisible && (
        <button
          onClick={() => setIsOverlayVisible(true)}
          aria-label="مشاهده توضیحات و مشخصات"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 py-3 px-3.5 sm:px-4 rounded-l-2xl glass-panel-dock border-y border-l border-brand-500/40 bg-[#030712]/90 hover:bg-[#070E1B] text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:pr-5 group cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-brand-400 group-hover:-translate-x-1 transition-transform animate-pulse" />
          <span className="text-xs font-bold text-gray-200 group-hover:text-white select-none hidden sm:inline">
            مشاهده توضیحات
          </span>
          <span className="w-2 h-2 rounded-full bg-brand-400 shadow-md shadow-brand-500/50" />
        </button>
      )}

      {/* ── دکمه بستن پنل توضیحات ── */}
      {isOverlayVisible && (
        <button
          onClick={() => setIsOverlayVisible(false)}
          aria-label="بستن توضیحات"
          className="fixed top-24 right-4 sm:right-8 md:right-12 z-30 flex items-center gap-2 py-2 px-3.5 rounded-xl bg-brand-600/90 hover:bg-brand-500 text-white shadow-xl backdrop-blur-md border border-brand-400/40 transition-all duration-300 group cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          <span className="text-xs font-bold select-none">بستن پنل توضیحات</span>
        </button>
      )}

      {/* ── DOCKED NARRATIVE PANELS FOR SECTORS 1, 2, 3, 4 ── */}
      {/* Sector 0 has the Ground-Hinged 3D Card right on the runway floor */}

      {/* ── SECTOR 1: INNOVATION PAVILIONS (SERVICES) ── */}
      <div
        id="sector-services"
        className={`fixed top-20 bottom-6 right-4 sm:right-8 md:right-12 w-full max-w-md lg:max-w-lg z-20 transition-all duration-500 flex flex-col justify-center pointer-events-none ${
          activeSector === 1 && isOverlayVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-16 pointer-events-none'
        }`}
      >
        <div className={`allow-card-scroll overflow-y-auto max-h-[calc(100vh-120px)] space-y-4 pr-1 pl-2 ${isOverlayVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className="glass-panel-dock p-6 sm:p-7 rounded-3xl space-y-2.5 backdrop-blur-xl bg-[#030712]/60 border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setIsOverlayVisible(false)}
              className="absolute top-5 left-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="بستن توضیحات"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>پاویون‌های تعاملی خدمات ۳۶۰ درجه</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              ۵ ایستگاه استراتژیک برای خلق امپراتوری دیجیتال
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              با کلیک یا هاور روی هر خدمت، پاویون سه‌بعدی متناظر در پردیس روشن می‌شود.
            </p>
          </div>

          {/* Compact Interactive Service Plinths */}
          <div className="space-y-2.5">
            {services.map((service) => {
              const isHovered = hoveredServiceSlug === service.slug;

              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setHoveredServiceSlug(service.slug)}
                  onMouseLeave={() => setHoveredServiceSlug(null)}
                  className={
                    'p-4 rounded-2xl transition-all duration-300 cursor-pointer border backdrop-blur-md ' +
                    (isHovered
                      ? 'glass-panel-brand border-brand-400/80 translate-x-[-6px] shadow-lg shadow-brand-600/30 bg-[#0E946E]/30'
                      : 'glass-panel-spatial border-white/10 hover:border-brand-500/40 bg-[#070B12]/60')
                  }
                  onClick={() => handleSelectServiceFrom3D(service.slug)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                        {service.features[0]?.icon || '✨'}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white">
                          {service.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                          {service.short_description}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={service.dedicated_url || ('/services/' + service.slug + '/')}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-white/5 hover:bg-brand-600 hover:text-white text-gray-300 shrink-0 transition-colors"
                      aria-label={'مشاهده پکیج ' + service.title}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Services Link */}
          <div className="pt-1">
            <Link
              href="/services/"
              className="w-full py-3 rounded-xl glass-panel-dock hover:bg-brand-600/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-brand-500/30 group backdrop-blur-md bg-[#030712]/60 shadow-lg"
            >
              <Layers className="w-4 h-4 text-brand-400" />
              <span>مشاهده آرشیو و مشخصات کامل خدمات</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── SECTOR 2: MASTERWORKS EXHIBITION HALL (PORTFOLIO) ── */}
      <div
        id="sector-portfolio"
        className={`fixed top-20 bottom-6 right-4 sm:right-8 md:right-12 w-full max-w-md lg:max-w-lg z-20 transition-all duration-500 flex flex-col justify-center pointer-events-none ${
          activeSector === 2 && isOverlayVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-16 pointer-events-none'
        }`}
      >
        <div className={`allow-card-scroll overflow-y-auto max-h-[calc(100vh-120px)] space-y-4 pr-1 pl-2 ${isOverlayVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className="glass-panel-dock p-6 sm:p-7 rounded-3xl space-y-2.5 backdrop-blur-xl bg-[#030712]/60 border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setIsOverlayVisible(false)}
              className="absolute top-5 left-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="بستن توضیحات"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>تالار نمایش آثار شاخص</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              پروژه‌های مهندسی‌شده با نتایج واقعی در بازار
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              سکوهای سه‌بعدی ماکت پروژه‌های برجسته اروم‌سیما را با شاخص‌های کلیدی عملکرد نمایش می‌دهند.
            </p>
          </div>

          {/* Compact Project Cards */}
          <div className="space-y-2.5">
            {projects.map((project) => {
              const isHovered = hoveredProjectSlug === project.slug;

              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredProjectSlug(project.slug)}
                  onMouseLeave={() => setHoveredProjectSlug(null)}
                  className={
                    'p-4 rounded-2xl transition-all duration-300 cursor-pointer border backdrop-blur-md ' +
                    (isHovered
                      ? 'glass-panel-brand border-brand-400/80 translate-x-[-6px] shadow-lg shadow-brand-600/30 bg-[#0E946E]/30'
                      : 'glass-panel-spatial border-white/10 hover:border-brand-500/40 bg-[#070B12]/60')
                  }
                  onClick={() => handleSelectProjectFrom3D(project.slug)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                          {project.category}
                        </span>
                        <span className="text-[10px] text-gray-400">{project.industry}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        {project.title}
                      </h3>
                    </div>

                    {project.kpis[0] && (
                      <div className="text-left shrink-0 bg-white/5 p-2 rounded-xl border border-white/5">
                        <div className="text-xs font-black text-brand-400">{project.kpis[0].value}</div>
                        <div className="text-[9px] text-gray-400">{project.kpis[0].label}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Portfolio Link */}
          <div className="pt-1">
            <Link
              href="/portfolio/"
              className="w-full py-3 rounded-xl glass-panel-dock hover:bg-brand-600/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-brand-500/30 group backdrop-blur-md bg-[#030712]/60 shadow-lg"
            >
              <Trophy className="w-4 h-4 text-brand-400" />
              <span>مشاهده گالری و آرشیو کامل نمونه‌کارها</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── SECTOR 3: GROWTH CALCULATOR & 5-STEP STRATEGY CONCOURSE ── */}
      <div
        id="sector-process"
        className={`fixed top-20 bottom-6 right-4 sm:right-8 md:right-12 w-full max-w-md lg:max-w-lg z-20 transition-all duration-500 flex flex-col justify-center pointer-events-none ${
          activeSector === 3 && isOverlayVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-16 pointer-events-none'
        }`}
      >
        <div className={`allow-card-scroll overflow-y-auto max-h-[calc(100vh-120px)] space-y-4 pr-1 pl-2 ${isOverlayVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className="glass-panel-dock p-6 sm:p-7 rounded-3xl space-y-2.5 backdrop-blur-xl bg-[#030712]/60 border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setIsOverlayVisible(false)}
              className="absolute top-5 left-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="بستن توضیحات"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>نقشه راه ۵ مرحله‌ای همکاری و خلق ارزش</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {landing.process_title}
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              {landing.process_subtitle}
            </p>
          </div>

          {/* Smart Growth Calculator Docked Panel */}
          <div className="glass-panel-spatial p-5 rounded-2xl border border-brand-500/30 space-y-4 backdrop-blur-xl bg-[#070B12]/60 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-bold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-300" />
                <span>بودجه ماهانه مارکتینگ:</span>
              </span>
              <span className="text-brand-300 font-black font-mono text-sm">{calcBudget} میلیون تومان</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={calcBudget}
              onChange={(e) => setCalcBudget(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-dark-base rounded-lg"
            />
            <div className="grid grid-cols-2 gap-3 text-center pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-black text-brand-400 font-mono">
                  +{Math.round(calcBudget * 18).toLocaleString('fa-IR')}
                </div>
                <div className="text-[10px] text-gray-300">بازدید ماهانه هدفمند</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-lg font-black text-teal-300 font-mono">
                  +{Math.round(calcBudget * 1.6).toLocaleString('fa-IR')}
                </div>
                <div className="text-[10px] text-gray-300">سرنخ و تماس فروش</div>
              </div>
            </div>
          </div>

          {/* 5-Step Process Timeline Badges */}
          <div className="space-y-2">
            {landing.process_steps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#070B12]/60 border border-white/10 flex items-center justify-between gap-3 text-xs backdrop-blur-md shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-brand-400 font-mono bg-brand-500/10 px-2 py-0.5 rounded-md">
                    {step.step}
                  </span>
                  <span className="font-bold text-white text-[12px]">{step.title}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{step.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTOR 4: TERMINAL PORTAL (CTA & CONTACT) ── */}
      <div
        id="sector-contact"
        className={`fixed top-20 bottom-6 right-4 sm:right-8 md:right-12 w-full max-w-md lg:max-w-lg z-20 transition-all duration-500 flex flex-col justify-center pointer-events-none ${
          activeSector === 4 && isOverlayVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-16 pointer-events-none'
        }`}
      >
        <div className={`allow-card-scroll overflow-y-auto max-h-[calc(100vh-120px)] space-y-4 pr-1 pl-2 ${isOverlayVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className="glass-panel-dock p-6 sm:p-7 rounded-3xl space-y-3 backdrop-blur-xl bg-[#030712]/60 border border-brand-500/40 shadow-2xl relative">
            <button
              onClick={() => setIsOverlayVisible(false)}
              className="absolute top-5 left-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="بستن توضیحات"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="inline-flex items-center gap-2 text-brand-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-brand-300 animate-pulse" />
              <span>آغاز تحول دیجیتال • مشاوره و استعلام مستقیم</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              آماده‌اید هویت دیجیتال برند خود را وارد مدار جدیدی کنید؟
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              جلسه مشاوره اختصاصی با مدیران ارشد اروم‌سیما در دفتر مرکزی خیابان مدنی ۲ ارومیه یا به صورت آنلاین.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/contact-us/"
                className="w-full py-3.5 rounded-xl bg-white text-dark-base font-black text-xs hover:bg-gray-100 shadow-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>ثبت آنلاین درخواست استعلام</span>
              </Link>

              <a
                href={'tel:' + settings.phone_e164}
                className="w-full py-3 rounded-xl border border-white/20 text-white font-bold text-xs hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-brand-300" />
                <span>تماس مستقیم: {settings.phone_display}</span>
              </a>
            </div>
          </div>

          {/* Quick NAP & Social Hub for Terminal Station */}
          <div className="glass-panel-spatial p-5 rounded-2xl border border-white/10 backdrop-blur-xl bg-[#070B12]/60 space-y-3 text-xs text-gray-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{settings.office_address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{settings.footer_working_hours}</span>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-brand-600/30 text-gray-300 hover:text-brand-300 transition-colors"
                  aria-label="اینستاگرام"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-teal-600/30 text-gray-300 hover:text-teal-300 transition-colors"
                  aria-label="تلگرام"
                >
                  <Send className="w-4 h-4" />
                </a>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {settings.footer_copyright_text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

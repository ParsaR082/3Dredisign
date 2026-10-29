'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  RotateCw,
  Sparkles,
  Layers,
  Globe,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import type { Project } from '@/types/content';

interface ProjectDeviceShowcaseProps {
  project: Project;
}

type ViewMode = 'trio' | 'desktop' | 'tablet' | 'mobile';
type SourceMode = 'mockup' | 'live';

export default function ProjectDeviceShowcase({ project }: ProjectDeviceShowcaseProps) {
  const hasLiveUrl = Boolean(project.website_url && project.website_url.trim().length > 0);
  const hasDesktopMockup = Boolean(project.mockups?.desktop);
  const hasMobileMockup = Boolean(project.mockups?.mobile);
  const hasTabletMockup = Boolean(project.mockups?.tablet);
  const hasAnyMockup = hasDesktopMockup || hasMobileMockup || hasTabletMockup;

  // Strict conditional rendering: if neither mockups nor website URL are present, hide completely
  if (!hasLiveUrl && !hasAnyMockup) {
    return null;
  }

  const desktopImg = project.mockups?.desktop || project.thumbnail_image || '';
  const mobileImg = project.mockups?.mobile || project.mockups?.desktop || project.thumbnail_image || '';
  const tabletImg = project.mockups?.tablet || project.mockups?.desktop || project.thumbnail_image || '';

  // Initial source and view mode
  const initialSource: SourceMode = hasAnyMockup ? 'mockup' : 'live';
  const initialView: ViewMode = hasAnyMockup ? 'trio' : 'desktop';

  const [sourceMode, setSourceMode] = useState<SourceMode>(initialSource);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleRefreshIframe = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const previewProxyUrl = hasLiveUrl
    ? `/api/preview-proxy?url=${encodeURIComponent(project.website_url!)}`
    : '';

  return (
    <section className="relative w-full rounded-2xl sm:rounded-3xl bg-[#070A0F] border border-white/10 p-3.5 sm:p-8 lg:p-10 shadow-2xl overflow-hidden space-y-4 sm:space-y-6">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
        {/* Title & Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm sm:text-lg font-bold text-white">
              ویترین پیش‌نمایش دستگاه‌ها و نسخه زنده
            </h3>
            {hasLiveUrl && (
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                سایت فعال
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-gray-400">
            بررسی ظاهر در ابعاد دسکتاپ، تبلت و موبایل با امکان تعامل مستقیم با وب‌سایت
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-between sm:justify-start">
          {/* Toggle: Mockups vs Live Web */}
          {hasLiveUrl && hasAnyMockup && (
            <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 text-[11px] sm:text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setSourceMode('mockup');
                  setViewMode('trio');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
                  sourceMode === 'mockup'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>موکاپ‌ها</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSourceMode('live');
                  if (viewMode === 'trio') setViewMode('desktop');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
                  sourceMode === 'live'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>سایت زنده</span>
              </button>
            </div>
          )}

          {/* Viewport Selectors */}
          <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 text-[11px] sm:text-xs font-semibold">
            {sourceMode === 'mockup' && (
              <button
                type="button"
                onClick={() => setViewMode('trio')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'trio'
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="نمایش سه‌گانه همزمان"
              >
                سه‌گانه
              </button>
            )}

            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'desktop'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="دسکتاپ"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دسکتاپ</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('tablet')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'tablet'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="تبلت"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تبلت</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'mobile'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="موبایل"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">موبایل</span>
            </button>
          </div>

          {/* Open live website in new tab */}
          {hasLiveUrl && (
            <a
              href={project.website_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="مشاهده مستقیم سایت در پنجره جدید"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* ── MODE 1: TRIO MOCKUP COMPOSITION (Matches Screenshot Exactly) ── */}
      {viewMode === 'trio' && sourceMode === 'mockup' && (
        <div className="relative py-6 sm:py-12 min-h-[320px] sm:min-h-[560px] flex items-center justify-center">
          {/* Floating badge: Desktop Ready (Top Left) */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-6 z-20 hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-dark-card/90 backdrop-blur-md border border-white/10 shadow-xl">
            <div className="text-right">
              <div className="text-xs sm:text-sm font-bold text-white">Desktop Ready</div>
              <div className="text-[10px] text-emerald-400 font-medium">تجربه کامل دسکتاپ</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Monitor className="w-4 h-4" />
            </div>
          </div>

          {/* Floating badge: Mobile Friendly (Top Right) */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-6 z-20 hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-dark-card/90 backdrop-blur-md border border-white/10 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-xs sm:text-sm font-bold text-white">Mobile Friendly</div>
              <div className="text-[10px] text-teal-400 font-medium">نمایش بهینه موبایل</div>
            </div>
          </div>

          {/* Trio Composition */}
          <div className="relative w-full max-w-5xl mx-auto flex items-end justify-center">
            {/* 1. Mobile Phone (Left Side, Overlapping) */}
            <div
              onClick={() => setViewMode('mobile')}
              className="relative z-20 -mr-4 sm:-mr-12 mb-1 sm:mb-2 w-20 sm:w-44 md:w-56 cursor-pointer group transition-transform hover:scale-105 shrink-0"
              title="مشاهده بزرگنمایی موبایل"
            >
              <div className="relative rounded-[1.2rem] sm:rounded-[2.2rem] p-1 sm:p-2 bg-[#1b2234] border sm:border-2 border-white/20 shadow-2xl overflow-hidden">
                <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-2 sm:h-3 bg-black/80 rounded-full z-30" />
                <div className="aspect-[9/19] rounded-[1rem] sm:rounded-[1.8rem] overflow-hidden bg-black">
                  <img
                    src={mobileImg}
                    alt={`${project.title} - Mobile Mockup`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Desktop Monitor (Center) */}
            <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl">
              {/* Monitor Bezel */}
              <div className="relative rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-[#1e2333] border-2 border-white/15 shadow-2xl">
                {/* Browser Title Bar with 3 Dots */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                    {project.website_url || project.slug}
                  </span>
                  <div className="w-8" />
                </div>

                {/* Desktop Screen Content */}
                <div
                  onClick={() => setViewMode('desktop')}
                  className="aspect-[16/10] rounded-xl overflow-hidden bg-black relative group cursor-pointer"
                  title="مشاهده بزرگنمایی دسکتاپ"
                >
                  <img
                    src={desktopImg}
                    alt={`${project.title} - Desktop Mockup`}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  {hasLiveUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        سوییچ به حالت وب‌سایت زنده
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Monitor Stand & Base */}
              <div className="mx-auto w-24 sm:w-36 h-6 sm:h-8 bg-gradient-to-b from-[#242b3e] to-[#121622] rounded-b-lg shadow-md" />
              <div className="mx-auto w-40 sm:w-56 h-2 bg-[#2a3249] rounded-full shadow-lg" />
            </div>

            {/* 3. Tablet Device (Right Side, Overlapping) */}
            <div
              onClick={() => setViewMode('tablet')}
              className="relative z-20 -ml-4 sm:-ml-12 mb-2 sm:mb-4 w-24 sm:w-52 md:w-64 cursor-pointer group transition-transform hover:scale-105 shrink-0"
              title="مشاهده بزرگنمایی تبلت"
            >
              <div className="relative rounded-[1.2rem] sm:rounded-[2rem] p-1 sm:p-2 bg-[#1b2234] border sm:border-2 border-white/20 shadow-2xl overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full z-30" />
                <div className="aspect-[4/3] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-black">
                  <img
                    src={tabletImg}
                    alt={`${project.title} - Tablet Mockup`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: SINGLE DEVICE VIEW (Desktop, Tablet, or Mobile with Live Iframe or Mockup) ── */}
      {(viewMode !== 'trio' || sourceMode === 'live') && (
        <div className="relative flex flex-col items-center justify-center py-4">
          {/* DESKTOP VIEWPORT */}
          {viewMode === 'desktop' && (
            <div className="w-full max-w-5xl mx-auto space-y-0">
              <div className="rounded-2xl sm:rounded-3xl p-2 sm:p-4 bg-[#1e2333] border sm:border-2 border-white/15 shadow-2xl">
                {/* Browser Top Bar */}
                <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-white/10 mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                  </div>

                  {/* Browser Address Bar */}
                  <div className="flex-1 max-w-md mx-2 sm:mx-4 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-black/40 border border-white/10 text-[10px] sm:text-xs text-gray-300 font-mono text-center truncate flex items-center justify-center gap-1.5 sm:gap-2 min-w-0">
                    <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{project.website_url || `https://urumsima.ir/portfolio/${project.slug}/`}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sourceMode === 'live' && hasLiveUrl && (
                      <button
                        type="button"
                        onClick={handleRefreshIframe}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                        title="تازه‌سازی صفحه زنده"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {hasLiveUrl && (
                      <a
                        href={project.website_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                        title="مشاهده مستقیم"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Display Canvas */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black">
                  {sourceMode === 'live' && hasLiveUrl ? (
                    <>
                      <iframe
                        key={iframeKey}
                        src={previewProxyUrl}
                        title={project.title}
                        className="w-full h-full border-0 bg-white"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        onLoad={() => setIframeLoading(false)}
                      />
                      {/* Floating Open New Tab action */}
                      <div className="absolute bottom-4 left-4 z-20">
                        <a
                          href={project.website_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md transition-all"
                        >
                          <span>مشاهده سایت در تب جدید</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <img
                      src={desktopImg}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Monitor Stand & Foot */}
              <div className="mx-auto w-28 sm:w-40 h-8 sm:h-10 bg-gradient-to-b from-[#242b3e] to-[#121622] rounded-b-lg shadow-md" />
              <div className="mx-auto w-44 sm:w-64 h-2.5 bg-[#2a3249] rounded-full shadow-lg" />
            </div>
          )}

          {/* TABLET VIEWPORT */}
          {viewMode === 'tablet' && (
            <div className="w-full max-w-3xl mx-auto">
              <div className="relative rounded-[2.5rem] p-3 sm:p-5 bg-[#1b2234] border-2 border-white/20 shadow-2xl">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rounded-full z-30" />
                <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden bg-black">
                  {sourceMode === 'live' && hasLiveUrl ? (
                    <>
                      <iframe
                        key={iframeKey}
                        src={previewProxyUrl}
                        title={project.title}
                        className="w-full h-full border-0 bg-white"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />
                      <div className="absolute bottom-4 left-4 z-20">
                        <a
                          href={project.website_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md"
                        >
                          <span>مشاهده تب جدید</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <img
                      src={tabletImg}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MOBILE VIEWPORT */}
          {viewMode === 'mobile' && (
            <div className="w-full max-w-sm mx-auto">
              <div className="relative rounded-[2.8rem] p-3 bg-[#1b2234] border-2 border-white/20 shadow-2xl">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-30" />
                <div className="relative aspect-[9/19] w-full rounded-[2.4rem] overflow-hidden bg-black">
                  {sourceMode === 'live' && hasLiveUrl ? (
                    <>
                      <iframe
                        key={iframeKey}
                        src={previewProxyUrl}
                        title={project.title}
                        className="w-full h-full border-0 bg-white"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      />
                      <div className="absolute bottom-4 left-4 z-20">
                        <a
                          href={project.website_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-brand-600/90 hover:bg-brand-500 text-white text-[11px] font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md"
                        >
                          <span>تب جدید</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <img
                      src={mobileImg}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom helper tip */}
      {hasLiveUrl && (
        <div className="text-center pt-2 border-t border-white/5">
          <p className="text-[11px] text-gray-400">
            برای گشت‌وگذار مستقیم و سریع در وب‌سایت اصلی، می‌توانید از دکمه{' '}
            <a
              href={project.website_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4 inline-flex items-center gap-1"
            >
              <span>مشاهده مستقیم در تب جدید</span>
              <ExternalLink className="w-3 h-3" />
            </a>{' '}
            استفاده نمایید.
          </p>
        </div>
      )}
    </section>
  );
}

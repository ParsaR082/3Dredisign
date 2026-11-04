'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Sparkles,
  X,
  ExternalLink,
  Share2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Radio,
  Sliders,
  Check,
  Maximize2,
} from 'lucide-react';
import type { BackstageItem, BackstageCategory } from '@/lib/db';

interface BackstageDirectorViewProps {
  items: BackstageItem[];
  categories: BackstageCategory[];
  settings?: {
    hero_badge?: string;
    hero_title?: string;
    hero_description?: string;
  };
}

export default function BackstageDirectorView({
  items = [],
  categories = [],
  settings,
}: BackstageDirectorViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [activeModalItem, setActiveModalItem] = useState<BackstageItem | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter items
  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category_id === selectedCategory);

  // Timecode generator for HUD
  const [hudTimecode, setHudTimecode] = useState('00:14:28:06');
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      const frames = String(Math.floor((d.getMilliseconds() / 1000) * 24)).padStart(2, '0');
      setHudTimecode(`${h}:${m}:${s}:${frames}`);
    }, 41); // ~24fps HUD tick
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = (slug: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/backstage/${slug}/`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleNextModalItem = () => {
    if (!activeModalItem) return;
    const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveModalItem(filteredItems[nextIndex]);
  };

  const handlePrevModalItem = () => {
    if (!activeModalItem) return;
    const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveModalItem(filteredItems[prevIndex]);
  };

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">
          خانه
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">پشت‌صحنه و استودیو</span>
      </nav>

      {/* Hero Header: Director's Studio Masthead */}
      <div className="relative rounded-3xl p-6 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-950/30 backdrop-blur-xl shadow-2xl">
        {/* Subtle decorative background lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{settings?.hero_badge || 'پشت دوربین • لحظه‌هایی که روی پرده نمی‌بینید'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {settings?.hero_title || 'مانیتور کارگردانی و پشت‌صحنه‌های تولید'}
          </h1>

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            {settings?.hero_description ||
              'نگاهی بدون واسطه به روند تصویربرداری صنعتی، نورپردازی صحنه، سناریونویسی و چالش‌های گروه کارگردانی استودیو اروم‌سیما در قالب ویدیوهای عمودی اختصاصی.'}
          </p>

          {/* Director Viewfinder Live Stats Header Strip */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-400 border-t border-white/5 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE CAM ACTIVE</span>
            </div>
            <div className="text-gray-300">
              <span className="text-gray-500 ml-1">TC:</span>
              <span className="text-white">{hudTimecode}</span>
            </div>
            <div className="text-gray-300">
              <span className="text-gray-500 ml-1">FPS:</span>
              <span className="text-white">60.00P</span>
            </div>
            <div className="text-gray-300">
              <span className="text-gray-500 ml-1">CODEC:</span>
              <span className="text-white">Apple ProRes 422</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
            selectedCategory === 'all'
              ? 'bg-brand-500 text-brand-950 border-brand-400 shadow-lg shadow-brand-500/20'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          همه پروژه‌ها ({items.length})
        </button>

        {categories.map((cat) => {
          const count = items.filter((it) => it.category_id === cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 border flex items-center gap-2 ${
                isSelected
                  ? 'bg-brand-500 text-brand-950 border-brand-400 shadow-lg shadow-brand-500/20'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-black/20 text-brand-950' : 'bg-white/10 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Director's Field Monitors (9:16 Vertical Ratio) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {filteredItems.map((item, idx) => {
          const isHovered = hoveredItemId === item.id;
          const sceneNumber = String(idx + 1).padStart(2, '0');

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
              className="group relative flex flex-col"
            >
              {/* Director's Field Monitor Bezel & Chassis */}
              <div className="relative rounded-[28px] p-3 sm:p-3.5 bg-gradient-to-b from-[#1c1d24] via-[#121319] to-[#0a0a0d] border border-white/15 shadow-2xl transition-all duration-500 group-hover:border-brand-500/50 group-hover:shadow-brand-500/10">
                {/* Chassis Hex Screws Accents */}
                <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-white/40" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-white/40" />
                <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-white/40" />
                <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-white/40" />

                {/* Top Monitor Bezel Header (Brand & Tally Light) */}
                <div className="flex items-center justify-between px-2 pb-2 text-[10px] text-gray-400 font-mono select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:animate-ping" />
                    <span className="font-bold text-gray-300 tracking-wider">ATOMOS / 9:16</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-emerald-400 font-bold">
                      RAW
                    </span>
                    <span>BAT 96%</span>
                  </div>
                </div>

                {/* 9:16 Portrait Screen Viewfinder */}
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                  {/* Video or Poster */}
                  {item.cover_video ? (
                    <video
                      src={item.cover_video}
                      poster={item.cover_image}
                      muted
                      loop
                      playsInline
                      autoPlay={isHovered}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

                  {/* Viewfinder Rule-of-Thirds Grid */}
                  <div className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
                    {/* Horizontal lines */}
                    <div className="absolute top-1/3 inset-x-0 border-b border-dashed border-white/30" />
                    <div className="absolute top-2/3 inset-x-0 border-b border-dashed border-white/30" />
                    {/* Vertical lines */}
                    <div className="absolute left-1/3 inset-y-0 border-r border-dashed border-white/30" />
                    <div className="absolute left-2/3 inset-y-0 border-r border-dashed border-white/30" />
                    {/* Center focus crosshair */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-brand-400/60 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-brand-400 rounded-full" />
                    </div>
                  </div>

                  {/* Top HUD: Blinking REC & Timecode */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-mono z-10">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-rose-400">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="font-bold">REC</span>
                    </div>

                    <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-gray-200">
                      <span>{hudTimecode}</span>
                    </div>
                  </div>

                  {/* Side HUD: Stereo Audio VU Meter */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-end gap-1 h-20 px-1 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 z-10">
                    <div className="w-1 h-full bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
                      <motion.div
                        animate={{ height: isHovered ? ['30%', '95%', '60%', '85%', '40%'] : '35%' }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500"
                      />
                    </div>
                    <div className="w-1 h-full bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
                      <motion.div
                        animate={{ height: isHovered ? ['45%', '70%', '90%', '50%', '80%'] : '25%' }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                        className="w-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-rose-500"
                      />
                    </div>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="w-14 h-14 rounded-full bg-brand-500/90 text-brand-950 flex items-center justify-center shadow-2xl group-hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/30 backdrop-blur-md"
                      aria-label={`پخش ویدیوی ${item.title}`}
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Bottom Slate Overlay: Camera Specs & Take */}
                  <div className="absolute bottom-3 inset-x-3 space-y-2 z-10 text-right">
                    <div className="flex items-center justify-between text-[10px] text-gray-300 font-mono">
                      <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-brand-300 font-bold">
                        SCENE {sceneNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-gray-300">
                        {item.duration_label || '4K 60P'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 space-y-1">
                      {item.category_name && (
                        <span className="text-[10px] text-brand-400 font-semibold block">
                          {item.category_name}
                        </span>
                      )}
                      <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Bottom Monitor Control Deck */}
                <div className="flex items-center justify-between px-2 pt-2.5 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="truncate">{item.location || 'ارومیه'}</span>
                  </div>

                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <span>مشاهده کامل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-24 text-center text-gray-400 bg-white/5 rounded-3xl border border-white/10 space-y-3">
          <Film className="w-12 h-12 mx-auto text-gray-500" />
          <h3 className="text-base font-bold text-white">ویدیویی در این دسته‌بندی یافت نشد</h3>
          <p className="text-xs text-gray-400">لطفاً سایر دسته‌ها را برای مشاهده شات‌های پشت‌صحنه بررسی کنید.</p>
        </div>
      )}

      {/* Cinematic Master Viewfinder Modal (Fullscreen Lightbox) */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalItem(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0c0d12] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row my-auto max-h-[92vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 left-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-gray-400 hover:text-white border border-white/10 transition-colors"
                aria-label="بستن پنجره"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left / Navigation Arrows */}
              <button
                onClick={handlePrevModalItem}
                className="absolute top-1/2 -translate-y-1/2 right-3 z-30 p-2.5 rounded-full bg-black/70 hover:bg-brand-500 hover:text-brand-950 text-white border border-white/10 transition-all hidden sm:flex items-center justify-center"
                title="ویدیوی قبلی"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextModalItem}
                className="absolute top-1/2 -translate-y-1/2 left-3 z-30 p-2.5 rounded-full bg-black/70 hover:bg-brand-500 hover:text-brand-950 text-white border border-white/10 transition-all hidden sm:flex items-center justify-center"
                title="ویدیوی بعدی"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Video Player Column (9:16 Portrait Monitor) */}
              <div className="relative w-full lg:w-1/2 bg-black flex items-center justify-center overflow-hidden min-h-[380px] sm:min-h-[500px]">
                {activeModalItem.cover_video ? (
                  <video
                    src={activeModalItem.cover_video}
                    poster={activeModalItem.cover_image}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full max-h-[80vh] object-contain"
                  />
                ) : activeModalItem.cover_image ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={activeModalItem.cover_image}
                      alt={activeModalItem.title}
                      className="w-full h-full object-contain max-h-[80vh]"
                    />
                    {activeModalItem.embed_url && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                        <p className="text-xs text-gray-200">این ویدیو به صورت آنلاین در اینستاگرام و آپارات بارگذاری شده است.</p>
                        <a
                          href={activeModalItem.embed_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-brand-950 text-xs font-bold inline-flex items-center gap-2 shadow-xl shadow-brand-500/20 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>مشاهده ویدیوی باکیفیت در اینستاگرام</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Production Slate & Metadata Column */}
              <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[80vh]">
                <div className="space-y-4">
                  {/* Category and Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-300">
                      {activeModalItem.category_name || 'پشت صحنه استودیو'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300">
                      {activeModalItem.duration_label || '4K 60FPS'}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">
                    {activeModalItem.title}
                  </h2>

                  {activeModalItem.subtitle && (
                    <p className="text-xs sm:text-sm text-brand-300 font-medium leading-relaxed">
                      {activeModalItem.subtitle}
                    </p>
                  )}

                  {/* Shoot Details Slate */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs text-gray-300 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">لوکیشن ضبط:</span>
                      <span className="text-white flex items-center gap-1 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        {activeModalItem.location || 'ارومیه'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">فرمت رکورد:</span>
                      <span className="text-white">9:16 Vertical / DCI 4K</span>
                    </div>
                    {activeModalItem.published_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">تاریخ ثبت:</span>
                        <span className="text-white">{activeModalItem.published_at}</span>
                      </div>
                    )}
                  </div>

                  {/* Narrative & Body */}
                  <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed text-justify border-t border-white/5 pt-4">
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-brand-400" />
                      <span>یادداشت کارگردان و روایت صحنه:</span>
                    </h4>
                    <p>{activeModalItem.body || activeModalItem.excerpt}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(activeModalItem.slug)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">لینک کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>اشتراک‌گذاری ویدیو</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/backstage/${encodeURIComponent(activeModalItem.slug)}/`}
                      className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30 flex items-center gap-1.5"
                    >
                      <span>صفحه کامل</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>استودیو دیجیتال مارکتینگ و تیزرسازی اروم‌سیما</span>
                    <span className="font-mono">URUMSIMA BTS ARCHIVE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

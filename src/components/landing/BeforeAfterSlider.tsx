'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, ArrowLeft } from 'lucide-react';

interface BeforeAfterSliderProps {
  project: {
    title: string;
    slug: string;
    before_url: string;
    after_url: string;
  } | null;
}

export default function BeforeAfterSlider({ project }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!project) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(2, prev - 4));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(98, prev + 4));
    }
  };

  return (
    <section className="ba-showcase rv py-16 px-4 sm:px-6 bg-[#060D0B] border-b border-emerald-500/15" id="results-before-after">
      <div className="ba-showcase__inner max-w-5xl mx-auto">
        <div className="ba-showcase__head text-center mb-10">
          <span className="ba-showcase__lbl inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>نتایج واقعی و دگرگونی</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            قبل و <span className="text-emerald-400">بعد</span> تحول دیجیتال
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto font-light mb-4">
            {project.title} — نشانگر را بکشید تا ارتقای هویت، طراحی اختصاصی و رابط کاربری را مشاهده کنید.
          </p>
          <Link
            href={`/portfolio/${project.slug}/`}
            className="ba-showcase__link inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>مشاهده مطالعه موردی کامل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive Comparison Stage */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-valuenow={Math.round(sliderPosition)}
          aria-label="اسلایدر مقایسه قبل و بعد"
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[550px] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl cursor-ew-resize select-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {/* Before Image Layer (Background) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={project.before_url}
              alt="نسخه اولیه"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
              پیش از اروم‌سیما
            </span>
          </div>

          {/* After Image Layer (Clipped) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <img
              src={project.after_url}
              alt="نسخه اروم‌سیما"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold border border-emerald-400/30 shadow-lg shadow-emerald-900/50">
              پس از اجرای اروم‌سیما
            </span>
          </div>

          {/* Divider Handle Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xl">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

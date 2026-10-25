'use client';

import React from 'react';
import { Compass, Layers, ShieldCheck, Trophy, Sparkles, Send } from 'lucide-react';

interface SpatialHUDProps {
  activeSector: number;
  scrollProgress?: number;
  onJumpToSector: (sectorIndex: number) => void;
}

export default function SpatialHUD({ activeSector, scrollProgress = 0, onJumpToSector }: SpatialHUDProps) {
  const isVisible = scrollProgress > 0.08;

  const sectors = [
    { label: 'ورود به اروم‌سیما', icon: Sparkles, desc: 'معماری هویت دیجیتال' },
    { label: 'پاویون خدمات ۳۶۰°', icon: Layers, desc: '۵ حوزه تخصصی خلق ارزش' },
    { label: 'گالری پروژه‌ها', icon: Trophy, desc: 'نمونه‌کارهای شاخص' },
    { label: 'نقشه راه همکاری', icon: ShieldCheck, desc: 'فرآیند ۵ مرحله‌ای' },
    { label: 'مشاوره و تماس', icon: Send, desc: 'پایانه ارتباط و استعلام' },
  ];

  return (
    <aside
      aria-label="راهنمای ناوبری سه‌بعدی محیط"
      className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-8 pointer-events-none'
      }`}
    >
      <div className="glass-panel-elevated p-2 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-1.5 backdrop-blur-xl">
        <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between text-[11px] font-bold text-gray-400">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-400 animate-spin" style={{ animationDuration: '14s' }} />
            <span>ناوبری سه‌بعدی</span>
          </span>
          <span className="font-mono text-brand-300">ایستگاه ۰{activeSector + 1} از ۰۵</span>
        </div>

        {sectors.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeSector === idx;

          return (
            <button
              key={idx}
              onClick={() => onJumpToSector(idx)}
              className={
                'px-3 py-2 rounded-xl text-right transition-all flex items-center justify-between gap-3 text-xs group ' +
                (isActive
                  ? 'bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5')
              }
            >
              <div className="flex items-center gap-2">
                <Icon className={'w-3.5 h-3.5 ' + (isActive ? 'text-white' : 'text-brand-400')} />
                <span>{s.label}</span>
              </div>
              <span
                className={
                  'w-1.5 h-1.5 rounded-full transition-transform ' +
                  (isActive ? 'bg-white scale-125' : 'bg-white/20 group-hover:bg-brand-400')
                }
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

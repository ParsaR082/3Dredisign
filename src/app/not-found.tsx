import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6 glass-panel-dock p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>خطای ۴۰۴ • صفحه مورد نظر یافت نشد</span>
        </div>

        <div className="text-6xl sm:text-7xl font-black text-gradient-brand font-mono">
          ۴۰۴
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white">
          مسیر فراخوانی‌شده در پردیس دیجیتال وجود ندارد
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          صفحه‌ای که به دنبال آن بودید ممکن است تغییر نام یافته باشد یا از دسترس خارج شده باشد. می‌توانید از طریق پیوندهای زیر به بخش‌های اصلی بازگردید.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/30"
          >
            <Compass className="w-4 h-4" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>

          <Link
            href="/services/"
            className="px-6 py-3.5 rounded-xl glass-panel-spatial text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10"
          >
            <span>مشاهده خدمات استراتژیک</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

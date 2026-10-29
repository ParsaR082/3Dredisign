'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { MotionDiv, MotionBadge, transitionSpring } from '@/components/ui/motion';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <MotionDiv
        variant="scale-up"
        className="max-w-lg w-full text-center space-y-5 sm:space-y-6 glass-panel-dock p-6 sm:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <MotionBadge className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold cursor-default">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>خطای ۴۰۴ • صفحه مورد نظر یافت نشد</span>
        </MotionBadge>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={transitionSpring}
          className="text-5xl sm:text-7xl font-black text-gradient-brand font-mono"
        >
          ۴۰۴
        </motion.div>

        <h1 className="text-lg sm:text-2xl font-bold text-white">
          مسیر فراخوانی‌شده در پردیس دیجیتال وجود ندارد
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          صفحه‌ای که به دنبال آن بودید ممکن است تغییر نام یافته باشد یا از دسترس خارج شده باشد. می‌توانید از طریق پیوندهای زیر به بخش‌های اصلی بازگردید.
        </p>

        <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              href="/"
              className="w-full px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-600/30"
            >
              <Compass className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              href="/services/"
              className="w-full px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl glass-panel-spatial text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 hover:border-brand-500/40 transition-colors"
            >
              <span>مشاهده خدمات استراتژیک</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </MotionDiv>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { MotionDiv, MotionBadge } from '@/components/ui/motion';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <MotionDiv
        variant="scale-up"
        className="max-w-lg w-full text-center space-y-5 sm:space-y-6 glass-panel-dock p-6 sm:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <MotionBadge className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-brand text-amber-300 text-xs font-semibold cursor-default">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>خطای پردازش سرور</span>
        </MotionBadge>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl sm:text-6xl font-black text-amber-400 font-mono"
        >
          ۵۰۰
        </motion.div>

        <h1 className="text-lg sm:text-2xl font-bold text-white">
          وقفه‌ای در ارتباط با سرور رخ داده است
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          سیستم در بارگذاری این صفحه با یک وقفه موقت مواجه شد. می‌توانید صفحه را مجدداً بارگذاری کنید یا به صفحه اصلی بازگردید.
        </p>

        <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تلاش مجدد</span>
          </motion.button>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              href="/"
              className="w-full px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl glass-panel-spatial text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 hover:border-emerald-500/40 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </motion.div>
        </div>
      </MotionDiv>
    </div>
  );
}

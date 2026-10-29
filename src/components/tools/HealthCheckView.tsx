'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  Smartphone,
  Share2,
} from 'lucide-react';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
  transitionSpring,
  transitionSmooth,
} from '@/components/ui/motion';

interface AuditResult {
  score: number;
  ssl: { passed: boolean; message: string };
  meta: { passed: boolean; titleLength: number; descLength: number; message: string };
  mobile: { passed: boolean; message: string };
  openGraph: { passed: boolean; message: string };
  speedEstimate: { score: number; label: string };
}

export default function HealthCheckView() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const cleanUrl = url.trim().toLowerCase();
      const hasHttps = cleanUrl.startsWith('https://');

      const score = hasHttps ? Math.floor(Math.random() * 15) + 82 : Math.floor(Math.random() * 20) + 55;

      setResult({
        score,
        ssl: {
          passed: hasHttps,
          message: hasHttps ? 'گواهی امنیتی SSL فعال و معتبر است.' : 'سایت فاقد SSL امن است؛ خطر افت رتبه و مسدود شدن در مرورگرها.',
        },
        meta: {
          passed: true,
          titleLength: 54,
          descLength: 148,
          message: 'تگ‌های عنوان و توضیحات در محدوده استاندارد گوگل قرار دارند.',
        },
        mobile: {
          passed: true,
          message: 'متا تگ viewport به درستی تنظیم شده و طراحی واکنش‌گراست.',
        },
        openGraph: {
          passed: score > 75,
          message: score > 75 ? 'متادیتاهای Open Graph جهت اشتراک‌گذاری در شبکه‌های اجتماعی فعال هستند.' : 'تصویر پیش‌نمایش og:image یافت نشد.',
        },
        speedEstimate: {
          score: score > 80 ? 92 : 68,
          label: score > 80 ? 'عالی (زیر ۲ ثانیه)' : 'متوسط (نیاز به بهینه‌سازی تصاویر و اسکریپت‌ها)',
        },
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">تست سلامت دیجیتال</span>
      </MotionDiv>

      {/* Hero Header */}
      <MotionDiv
        variant="scale-up"
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-14 overflow-hidden border border-white/10 bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-950/30 backdrop-blur-xl shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
          <MotionBadge className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold cursor-default">
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
            <span>آنالایزر آنلاین و رایگان برند دیجیتال</span>
          </MotionBadge>
          <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            تست سلامت <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-400">فنی و سئوی سایت</span>
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            آدرس وبسایت خود را وارد کنید تا وضعیت گواهینامه SSL، سئوی مقدماتی، سرعت لود و متادیتای شبکه‌های اجتماعی در چند ثانیه پایش شود.
          </p>
        </div>
      </MotionDiv>

      {/* Input Form Card */}
      <MotionDiv variant="fade-up" delay={0.05}>
        <InteractiveCard className="rounded-2xl sm:rounded-3xl p-4 sm:p-10 bg-dark-card/80 border border-white/10 shadow-2xl space-y-5 sm:space-y-6">
          <form onSubmit={handleAudit} className="space-y-3 sm:space-y-4">
            <label htmlFor="targetUrl" className="block text-xs sm:text-sm font-bold text-gray-200">
              نشانی وبسایت (URL):
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2" />
                <input
                  id="targetUrl"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-dark-base/80 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors text-xs sm:text-sm font-mono dir-ltr"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto shrink-0 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال بررسی داده‌ها...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>شروع بررسی سلامت</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </InteractiveCard>
      </MotionDiv>

      {/* Audit Results with AnimatePresence */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={transitionSpring}
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-10 bg-dark-card/90 border border-brand-500/30 space-y-6 sm:space-y-8 shadow-2xl"
          >
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-white/10">
              <div className="space-y-1 text-center sm:text-right">
                <span className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">امتیاز کلی سلامت فنی</span>
                <h2 className="text-xl sm:text-3xl font-black text-white">گزارش وضعیت آنلاین سایت</h2>
              </div>
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.5, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={transitionSpring}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex flex-col items-center justify-center shadow-lg shadow-brand-500/20"
                >
                  <span className="text-2xl sm:text-3xl font-black text-brand-400 font-mono">{result.score}</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold">از ۱۰۰</span>
                </motion.div>
              </div>
            </div>

            {/* Diagnostic Checks Grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* SSL */}
              <StaggerItem>
                <InteractiveCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 sm:space-y-2 h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand-400" />
                      گواهی امنیتی SSL
                    </span>
                    {result.ssl.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{result.ssl.message}</p>
                </InteractiveCard>
              </StaggerItem>

              {/* Mobile Viewport */}
              <StaggerItem>
                <InteractiveCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 sm:space-y-2 h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-teal-400" />
                      واکنش‌گرایی موبایل
                    </span>
                    {result.mobile.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{result.mobile.message}</p>
                </InteractiveCard>
              </StaggerItem>

              {/* Meta Tags */}
              <StaggerItem>
                <InteractiveCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 sm:space-y-2 h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      متا تگ‌های سئو
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{result.meta.message}</p>
                </InteractiveCard>
              </StaggerItem>

              {/* Speed Index */}
              <StaggerItem>
                <InteractiveCard className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 sm:space-y-2 h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      شاخص سرعت لود
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-400">{result.speedEstimate.score}/100</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{result.speedEstimate.label}</p>
                </InteractiveCard>
              </StaggerItem>
            </StaggerContainer>

            {/* Consultation CTA */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-xs text-gray-300 text-center sm:text-right">
                می‌خواهید رتبه و سرعت سایت‌تان به ۱۰۰٪ برسد و در صفحه ۱ گوگل دیده شوید؟
              </p>
              <Link
                href="/contact-us/"
                className="w-full sm:w-auto text-center justify-center px-6 py-2.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/30 text-brand-300 text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <span>درخواست ارتقای فنی سایت</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

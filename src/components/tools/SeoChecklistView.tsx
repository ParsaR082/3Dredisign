'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Printer,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  FileText,
  Search,
  RotateCcw,
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

interface ChecklistItem {
  id: string;
  title: string;
  desc: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  icon: any;
  items: ChecklistItem[];
}

const CHECKLIST_DATA: ChecklistSection[] = [
  {
    id: 'tech',
    title: '۱. فنی و سرعت (Technical SEO)',
    icon: Zap,
    items: [
      { id: 't1', title: 'فعال‌سازی HTTPS و گواهینامه امنیتی SSL', desc: 'تضمین ارتباط رمزنگاری‌شده و جلوگیری از هشدار Not Secure در مرورگرها.' },
      { id: 't2', title: 'سرعت لود نسخه موبایل زیر ۲.۵ ثانیه', desc: 'پاس کردن شاخص‌های حیاتی گوگل (Core Web Vitals: LCP, FID, CLS).' },
      { id: 't3', title: 'فایل sitemap.xml پویا و استاندارد', desc: 'معرفی نقشه سایت به Google Search Console با اولویت‌بندی صحیح صفحات.' },
      { id: 't4', title: 'پیکربندی هوشمند robots.txt', desc: 'هدایت ربات‌های گوگل و صدور دسترسی برای ربات‌های هوش مصنوعی (GPTBot, Perplexity).' },
      { id: 't5', title: 'بهینه‌سازی تصاویر با فرمت WebP و تگ alt', desc: 'کاهش حجم عکس‌ها بدون افت کیفیت و توصیف دقیق برای بخش جستجوی تصاویر گوگل.' },
      { id: 't6', title: 'ساختار URL تمیز و کوتاه (Clean Slugs)', desc: 'استفاده از اسلاگ‌های هدفمند بدون کاراکترهای نامفهوم و پارامترهای اضافی.' },
    ],
  },
  {
    id: 'content',
    title: '۲. محتوا و معماری کلمات کلیدی (On-Page SEO)',
    icon: FileText,
    items: [
      { id: 'c1', title: 'عنوان سئو (Title Tag) منحصربه‌فرد برای هر صفحه', desc: '۵۰ تا ۶۰ کاراکتر با قرارگیری کلمه کلیدی اصلی در ابتدای عنوان.' },
      { id: 'c2', title: 'متا دیسکریپشن جذاب و ترغیب‌کننده به کلیک (CTR)', desc: '۱۴۰ تا ۱۶۰ کاراکتر حاوی پیشنهاد ارزش افزوده و دعوت به اقدام (CTA).' },
      { id: 'c3', title: 'تنها یک تگ H1 در هر صفحه با سلسله‌مراتب H2-H4', desc: 'رعایت ساختار درختی تیترها برای درک بهتر ساختار محتوا توسط خزنده‌های وب.' },
      { id: 'c4', title: 'لینک‌سازی داخلی هوشمندانه (Internal Linking)', desc: 'اتصال صفحات خدمات به نمونه‌کارها و مقالات وبلاگ برای انتقال اعتبار سئو.' },
      { id: 'c5', title: 'داده‌های ساختاریافته (Schema Markup / JSON-LD)', desc: 'پیاده‌سازی اسکیماهای Organization, LocalBusiness, FAQPage و Article.' },
    ],
  },
  {
    id: 'local',
    title: '۳. سئو محلی ارومیه و استان (Local SEO)',
    icon: Globe,
    items: [
      { id: 'l1', title: 'ثبت موقعیت دقیق در نقشه نشان، بلد و گوگل‌مپ', desc: 'تطابق کامل نام، آدرس و شماره تلفن (NAP Consistency).' },
      { id: 'l2', title: 'صفحات اختصاصی محلی با نام شهر (ارومیه)', desc: 'مانند طراحی سایت در ارومیه، سئو در ارومیه و تیزر تبلیغاتی ارومیه.' },
      { id: 'l3', title: 'جمع‌آوری نظرات و امتیازات مثبت مشتریان محلی', desc: 'ثبت فیدبک‌های ۵ ستاره در پروفایل‌های عمومی کسب‌وکار.' },
    ],
  },
  {
    id: 'ux',
    title: '۴. تجربه کاربری، ریسپانسیو و امنیت',
    icon: ShieldCheck,
    items: [
      { id: 'u1', title: 'طراحی Mobile-First و واکنش‌گرایی بدون نقص', desc: 'تست نمایش صحیح در انواع سایزهای موبایل و تبلت بدون اسکرول افقی ناخواسته.' },
      { id: 'u2', title: 'دکمه‌های تماس سریع و واتساپ شناور', desc: 'دسترسی با یک کلیک کاربران موبایل به مشاوره و سفارش پروژه.' },
      { id: 'u3', title: 'صفحه ۴۰۴ سفارشی و ریدایرکت‌های ۳۰۱ بدون حلقه', desc: 'راهنمایی کاربرانی که به آدرس‌های تغییریافته مراجعه می‌کنند.' },
    ],
  },
];

export default function SeoChecklistView() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('urumsima_seo_checklist');
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch (_) {}
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('urumsima_seo_checklist', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleReset = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem('urumsima_seo_checklist');
    } catch (_) {}
  };

  const totalItems = CHECKLIST_DATA.reduce((acc, sec) => acc + sec.items.length, 0);
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400 print:hidden">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">چک‌لیست سئو سایت</span>
      </MotionDiv>

      {/* Hero Header */}
      <MotionDiv
        variant="scale-up"
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-950/30 backdrop-blur-xl shadow-2xl"
      >
        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <MotionBadge className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold cursor-default">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
              <span>ابزار تخصصی و رایگان اروم‌سیما</span>
            </MotionBadge>
            <div className="flex items-center gap-2 print:hidden">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.print()}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-brand-400" />
                <span>چاپ / PDF</span>
              </motion.button>
              {completedCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/[0.04] hover:bg-red-500/10 border border-white/10 text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-all cursor-pointer"
                  title="بازنشانی موارد"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black text-white leading-tight">
            چک‌لیست عملی <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-400">سئو و بهینه‌سازی سایت</span>
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed max-w-3xl">
            این فهرست استاندارد را گام‌به‌گام در سایت خود اجرا کنید تا خطاهای فنی برطرف شده و رتبه‌بندی شما در نتایج جستجوی گوگل جهش چشم‌گیری داشته باشد.
          </p>

          {/* Progress Bar */}
          <div className="pt-3 sm:pt-4 space-y-1.5 sm:space-y-2 print:hidden">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-300">میزان پیشرفت شما:</span>
              <span className="text-brand-400 font-mono">{completedCount} از {totalItems} مورد ({progressPercent}٪)</span>
            </div>
            <div className="w-full h-2.5 sm:h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full shadow-lg shadow-brand-500/30"
              />
            </div>
          </div>
        </div>
      </MotionDiv>

      {/* Sections & Items */}
      <StaggerContainer className="space-y-6 sm:space-y-8">
        {CHECKLIST_DATA.map((section) => {
          const Icon = section.icon;
          return (
            <StaggerItem key={section.id}>
              <InteractiveCard className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-dark-card/70 border border-white/5 space-y-4 sm:space-y-6 shadow-xl">
                <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-white/5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {section.items.map((item) => {
                    const isChecked = Boolean(checkedItems[item.id]);
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleItem(item.id)}
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-start gap-3 sm:gap-4 ${
                          isChecked
                            ? 'bg-brand-950/20 border-brand-500/30 text-gray-300'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-brand-500 border-brand-400 text-white'
                              : 'border-white/20 bg-dark-base'
                          }`}
                        >
                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={transitionSpring}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.div>
                          )}
                        </div>

                        <div className="space-y-0.5 sm:space-y-1">
                          <h3
                            className={`text-xs sm:text-sm font-bold transition-colors ${
                              isChecked ? 'line-through text-gray-400' : 'text-white'
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </InteractiveCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* CTA Bottom Banner */}
      <MotionDiv variant="scale-up" className="print:hidden">
        <InteractiveCard className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-r from-brand-950/40 via-dark-card to-dark-surface border border-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-2xl">
          <div className="space-y-1.5 sm:space-y-2 text-center sm:text-right">
            <h3 className="text-lg sm:text-xl font-black text-white">نیاز به اجرای تخصصی سئو توسط مهندسین اروم‌سیما دارید؟</h3>
            <p className="text-gray-300 text-xs sm:text-sm">آنالیز فنی رایگان سایت شما و تدوین استراتژی رتبه ۱ گوگل در ارومیه.</p>
          </div>
          <Link
            href="/contact-us/"
            className="w-full sm:w-auto text-center shrink-0 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            درخواست آنالیز و مشاوره سئو
          </Link>
        </InteractiveCard>
      </MotionDiv>
    </div>
  );
}

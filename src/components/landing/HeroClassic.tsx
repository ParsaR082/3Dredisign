'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Check,
  Play,
  Zap,
  Award,
  Globe,
  Search,
  TrendingUp,
  Activity,
  Video,
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

interface HeroClassicProps {
  badge: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  service1Title?: string;
  service2Title?: string;
  service3Title?: string;
  service4Title?: string;
  trust1?: string;
  trust2?: string;
  trust3?: string;
  trust4?: string;
  counters?: { value: number; suffix: string; label: string }[];
}

type TabKey = 'web' | 'seo' | 'media';

export default function HeroClassic({
  badge,
  title,
  highlight,
  description,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  service1Title = 'طراحی سایت',
  service2Title = 'سئو حرفه‌ای',
  service3Title = 'تبلیغات دیجیتال',
  service4Title = 'تولید محتوا',
  trust1 = 'پشتیبانی ۲۴/۷',
  trust2 = 'تحویل به‌موقع',
  trust3 = 'ضمانت کیفیت',
  trust4 = 'مشاوره رایگان',
  counters = [],
}: HeroClassicProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('web');

  // Convert Persian numbers
  const toPersian = (num: number | string) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const showcaseData = {
    web: {
      tabName: 'طراحی وب‌سایت',
      badge: 'معماری مدرن Next.js 15',
      growthRate: '+۲۸۰٪',
      growthLabel: 'رشد میانگین ترافیک و نرخ تبدیل مشتریان',
      chartPath: 'M 10 75 Q 70 65, 130 50 T 250 35 T 370 12',
      chartArea: 'M 10 75 Q 70 65, 130 50 T 250 35 T 370 12 L 370 90 L 10 90 Z',
      metric1: { label: 'سرعت بارگذاری', val: '۰.۸s', sub: 'Core Web Vitals سبز' },
      metric2: { label: 'کسب نمره فنی', val: '۱۰۰/۱۰۰', sub: 'استاندارد لایت‌هاوس گوگل' },
      metric3: { label: 'طراحی اختصاصی', val: '۱۰۰٪', sub: 'ریسپانسیو و بدون باگ' },
      tag: 'UI/UX اختصاصی و سرعت مافوق‌صوت',
    },
    seo: {
      tabName: 'سئو و رتبه ۱ گوگل',
      badge: 'استراتژی داده‌محور و ارگانیک',
      growthRate: '+۳۴۰٪',
      growthLabel: 'افزایش ایمپرشن و ورودی‌های هدفمند گوگل',
      chartPath: 'M 10 80 Q 80 70, 140 45 T 260 25 T 370 8',
      chartArea: 'M 10 80 Q 80 70, 140 45 T 260 25 T 370 8 L 370 90 L 10 90 Z',
      metric1: { label: 'کلمات صدر نتایج', val: '+۳۲', sub: 'کلیدواژه‌های پولساز بازار' },
      metric2: { label: 'ثبات در صفحه اول', val: 'پایدار', sub: 'سئو کلاه‌سفید تکنیکال' },
      metric3: { label: 'نرخ بازگشت سرمایه', val: '۴.۲x', sub: 'تبدیل ترافیک به سفارش' },
      tag: 'صدرنشینی در کلمات پررقابت بازار',
    },
    media: {
      tabName: 'تولید محتوا و ریلز',
      badge: 'تجهیزات سینمایی و استودیویی',
      growthRate: '+۴۸۰K',
      growthLabel: 'ایمپرشن ارگانیک و ورود به اکسپلور اینستاگرام',
      chartPath: 'M 10 78 Q 90 60, 160 40 T 270 20 T 370 10',
      chartArea: 'M 10 78 Q 90 60, 160 40 T 270 20 T 370 10 L 370 90 L 10 90 Z',
      metric1: { label: 'سناریونویسی خلاق', val: 'وایرال', sub: 'منطبق با الگوریتم روز' },
      metric2: { label: 'کیفیت تصویربرداری', val: '4K سینما', sub: 'صنعتی، تبلیغاتی و شخصی' },
      metric3: { label: 'نرخ تعامل (ER)', val: '+۱۸.۵٪', sub: 'جذب فالوور وفادار و خریدار' },
      tag: 'هویت بصری لوکس و ریلزهای پرفروش',
    },
  };

  const current = showcaseData[activeTab];

  return (
    <section className="hero">
      <div className="h-spot" aria-hidden="true" />
      <div className="hbg-grid" aria-hidden="true" />
      <div className="orb orb1" aria-hidden="true" />
      <div className="orb orb2" aria-hidden="true" />
      <div className="orb orb3" aria-hidden="true" />

      <div className="hero-container rv">
        {/* Right Column: High-Impact Typography & Action Content */}
        <div className="hero-text">
          {/* Badge */}
          {badge && (
            <div className="h-badge">
              <div className="h-badge-dot" />
              <span className="h-badge-txt">{badge}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="h-title">
            <span className="l1">{title}</span>
            {highlight && <span className="l2">{highlight}</span>}
          </h1>

          <span className="h-rule" aria-hidden="true" />

          {/* Description */}
          {description && <p className="h-desc">{description}</p>}

          {/* Quick Service Pills */}
          <div className="h-services-quick">
            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                </svg>
              </div>
              <span>{service1Title}</span>
            </div>

            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span>{service2Title}</span>
            </div>

            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 11v2a1 1 0 0 0 1 1h1l2 9h12l2-9h1a1 1 0 0 0 1-1v-2" />
                  <path d="M12 3a4 4 0 0 1 4 4v1H8V7a4 4 0 0 1 4-4z" />
                </svg>
              </div>
              <span>{service3Title}</span>
            </div>

            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <span>{service4Title}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="h-actions">
            {primaryCtaText && (
              <Link href={primaryCtaUrl || '/contact/'} className="btn-p">
                <span>{primaryCtaText}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}

            {secondaryCtaText && (
              <Link href={secondaryCtaUrl || '/services/'} className="btn-s">
                <div className="btn-s-icon">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>{secondaryCtaText}</span>
              </Link>
            )}
          </div>

          {/* Trust Bar */}
          <div className="h-trust-bar">
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust1}</span>
            </div>
            <div className="h-trust-dot" />
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust2}</span>
            </div>
            <div className="h-trust-dot" />
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust3}</span>
            </div>
            <div className="h-trust-dot" />
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust4}</span>
            </div>
          </div>

          {/* Stats */}
          {counters.length > 0 && (
            <div className="h-stats">
              {counters.slice(0, 3).map((stat, idx) => (
                <React.Fragment key={idx}>
                  <div className="h-stat">
                    <span className="h-stat-n">
                      {toPersian(stat.value)}
                      {stat.suffix && <sup>{stat.suffix}</sup>}
                    </span>
                    <div className="h-stat-l">{stat.label}</div>
                  </div>
                  {idx < Math.min(counters.length, 3) - 1 && <div className="h-stat-div" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Left Column: Visual Centerpiece (Digital Architecture & Performance Showcase) */}
        <div className="hero-image" aria-label="شاخص‌های عملکرد دیجیتال اروم سیما">
          <div className="hero-visual-card relative w-full max-w-[560px] 2xl:max-w-[620px] 3xl:max-w-[680px]">
            {/* Ambient Background Aura - High performance pure radial gradient without blur filter */}
            <div
              className="absolute -inset-6 rounded-3xl -z-10 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14, 148, 110, 0.18) 0%, rgba(14, 148, 110, 0.04) 50%, transparent 75%)',
              }}
              aria-hidden="true"
            />

            {/* Floating Pill Top Left */}
            <div className="floating-badge-top absolute -top-3 left-2 sm:-top-4 sm:left-4 z-20 px-3.5 py-2 rounded-2xl bg-[#081512] border border-emerald-400/35 shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Zap className="w-4 h-4 fill-emerald-400/30 text-emerald-300" />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black text-white leading-tight">لود زیر ۱ ثانیه</div>
                <div className="text-[9.5px] text-emerald-300/80 font-medium">Core Web Vitals سبز</div>
              </div>
            </div>

            {/* Floating Pill Bottom Right */}
            <div className="floating-badge-bottom absolute -bottom-3 right-2 sm:-bottom-4 sm:right-4 z-20 px-3.5 py-2 rounded-2xl bg-[#081512] border border-emerald-400/35 shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black text-white leading-tight">۹۹.۴٪ رضایت کارفرمایان</div>
                <div className="text-[9.5px] text-emerald-300/80 font-medium">+۱۵۰ پروژه معتبر در کشور</div>
              </div>
            </div>

            {/* Main Interactive Showcase Console */}
            <div className="console-box rounded-3xl bg-[#091512] border border-emerald-500/25 p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
              {/* Console Top Header */}
              <div className="console-head flex items-center justify-between pb-4 mb-4 border-b border-emerald-500/15">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="console-url flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono" dir="ltr">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>urumsima.ir/growth-engine</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>مانیتورینگ زنده</span>
                </div>
              </div>

              {/* Service Mode Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#050f0c] border border-emerald-500/15 mb-5" role="tablist">
                {(['web', 'seo', 'media'] as TabKey[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/40'
                        : 'text-gray-400 hover:text-emerald-200 hover:bg-emerald-950/20'
                    }`}
                  >
                    {tab === 'web' && <Globe className="w-3.5 h-3.5" />}
                    {tab === 'seo' && <Search className="w-3.5 h-3.5" />}
                    {tab === 'media' && <Video className="w-3.5 h-3.5" />}
                    <span>{showcaseData[tab].tabName}</span>
                  </button>
                ))}
              </div>

              {/* Performance Indicator Banner */}
              <div className="metric-highlight p-4 rounded-2xl bg-[#0a1714] border border-emerald-500/20 mb-4 relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10 mb-2">
                  <div className="text-right">
                    <span className="inline-block text-[10.5px] font-bold text-emerald-400 tracking-wider uppercase mb-1">
                      {current.badge}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                      {current.growthRate}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10.5px] font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>روند صعودی</span>
                  </span>
                </div>
                <p className="text-[11.5px] text-gray-300 relative z-10 font-light mb-3">
                  {current.growthLabel}
                </p>

                {/* SVG Live Trajectory Wave Chart */}
                <div className="relative h-20 w-full overflow-hidden">
                  <svg viewBox="0 0 380 90" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0E946E" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0E946E" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="heroChartStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0E946E" />
                        <stop offset="50%" stopColor="#12b085" />
                        <stop offset="100%" stopColor="#5ef0c4" />
                      </linearGradient>
                    </defs>
                    <path d={current.chartArea} fill="url(#heroChartFill)" />
                    <path
                      d={current.chartPath}
                      fill="none"
                      stroke="url(#heroChartStroke)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="370" cy="12" r="5" fill="#5ef0c4" opacity="0.3" />
                    <circle cx="370" cy="12" r="3" fill="#5ef0c4" />
                  </svg>
                </div>
              </div>

              {/* 3 Performance Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#081310] border border-emerald-500/15 text-center">
                  <div className="text-[10px] text-gray-400 mb-0.5">{current.metric1.label}</div>
                  <div className="text-sm sm:text-base font-black text-emerald-300 font-mono" dir="ltr">
                    {current.metric1.val}
                  </div>
                  <div className="text-[9px] text-gray-400 truncate">{current.metric1.sub}</div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-[#081310] border border-emerald-500/15 text-center">
                  <div className="text-[10px] text-gray-400 mb-0.5">{current.metric2.label}</div>
                  <div className="text-sm sm:text-base font-black text-white font-mono" dir="ltr">
                    {current.metric2.val}
                  </div>
                  <div className="text-[9px] text-emerald-400 truncate">{current.metric2.sub}</div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-[#081310] border border-emerald-500/15 text-center">
                  <div className="text-[10px] text-gray-400 mb-0.5">{current.metric3.label}</div>
                  <div className="text-sm sm:text-base font-black text-emerald-300 font-mono" dir="ltr">
                    {current.metric3.val}
                  </div>
                  <div className="text-[9px] text-gray-400 truncate">{current.metric3.sub}</div>
                </div>
              </div>

              {/* Console Foot Tag */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/20 border border-emerald-500/15">
                <span className="text-[11px] text-emerald-200/90 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{current.tag}</span>
                </span>
                <Link
                  href="/services/"
                  className="text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5"
                >
                  <span>جزئیات خدمات</span>
                  <ArrowLeft className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

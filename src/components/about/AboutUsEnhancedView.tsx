'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Code2,
  Atom,
  TrendingUp,
  Video,
  Target,
  Headphones,
  CheckCircle2,
  ArrowLeft,
  Zap,
  Search,
  Layers,
  Rocket,
  Cpu,
  BarChart3,
  Flame,
  Check,
} from 'lucide-react';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  MotionBadge,
} from '@/components/ui/motion';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { TiltCard } from '@/components/ui/TiltCard';
import { KineticTypography } from '@/components/ui/KineticTypography';
import { TextScramble } from '@/components/ui/TextScramble';

const ParticleMorph = dynamic(
  () => import('@/components/3d/ParticleMorph').then((m) => m.ParticleMorph),
  {
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-3xl bg-white/5 animate-pulse" />,
  }
);

// ── 4 SPECIALIZED OPERATIONAL UNITS ──
const DEPARTMENTS = [
  {
    id: 'web-engineering',
    number: '۰۱',
    title: 'دپارتمان مهندسی وب ۳بعدی و سیستم‌های ابری',
    englishTitle: 'Web & Spatial 3D Engineering',
    desc: 'معماری و کدنویسی اختصاصی با Next.js و React بدون وابستگی به قالب‌های آماده و کدهای سنگین؛ پیاده‌سازی صحنه‌های تعاملی سه‌بعدی با WebGL و Three.js، امنیت چندلایه و سرورهای فوق‌سریع.',
    icon: Code2,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderHover: 'hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10 text-emerald-400',
    tags: ['Next.js 15', 'Three.js / WebGL', 'Clean Architecture', 'Core Web Vitals 99+'],
    stat: '۱۰۰٪ اختصاصی',
  },
  {
    id: 'seo-data',
    number: '۰۲',
    title: 'دپارتمان سئو تکنیکال و هوش جستجو',
    englishTitle: 'Technical SEO & Data Intelligence',
    desc: 'تحلیل دقیق داده‌های جستجو و رفتار کاربران، بهینه‌سازی ساختار معنایی (Semantic SEO)، رفع موانع تکنیکال ایندکس و کلاسترینگ کلمات کلیدی هدف برای دستیابی به جایگاه‌های برتر و پرفروش گوگل.',
    icon: TrendingUp,
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderHover: 'hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/10 text-cyan-400',
    tags: ['Semantic SEO', 'Keyword Clustering', 'Technical Audit', 'CRO & Analytics'],
    stat: 'رشد پایدار ارگانیک',
  },
  {
    id: 'media-studio',
    number: '۰۳',
    title: 'استودیو تولید مدیا، تیزر و ریلزهای صنعتی',
    englishTitle: 'Cinematic Media & Visual Studio',
    desc: 'استودیو مجهز به دوربین‌ها و لنزهای سینمایی 4K، سناریونویسی و استوری‌بورد تبلیغاتی، ساخت تیزرهای فاخر سازمانی، ریلزهای اینستاگرامی با نرخ تعامل بالا و جلوه‌های بصری مدرن.',
    icon: Video,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderHover: 'hover:border-amber-500/50',
    iconBg: 'bg-amber-500/10 text-amber-400',
    tags: ['تجهیزات 4K استودیویی', 'سناریونویسی تبلیغاتی', 'ریلزهای پربازدید', 'موشن‌گرافیک ۳D'],
    stat: 'کیفیت سینمایی',
  },
  {
    id: 'ooh-branding',
    number: '۰۴',
    title: 'دپارتمان استراتژی برند و تبلیغات محیطی',
    englishTitle: 'Brand Strategy & OOH Advertising',
    desc: 'شبکه انحصاری بیلبوردهای استراتژیک و تلویزیون‌های شهری آبنر در شریان‌های اصلی شمال‌غرب، هویت بصری یکپارچه و راه‌اندازی کمپین‌های ۳۶۰ درجه منطقه‌ای و ملی برای تثبیت نام تجاری.',
    icon: Target,
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderHover: 'hover:border-rose-500/50',
    iconBg: 'bg-rose-500/10 text-rose-400',
    tags: ['شبکه بیلبورد شهری', 'نمایشگرهای آبنر', 'هویت بصری یکپارچه', 'کمپین‌های ۳۶۰ درجه'],
    stat: 'بزرگترین شبکه محیطی',
  },
];

// ── 4-STEP VALUE CREATION & DELIVERY METHODOLOGY ──
const DELIVERY_WORKFLOW = [
  {
    step: '۰۱',
    title: 'کشف و تحلیل داده',
    englishTitle: 'Discovery & Market Intelligence',
    desc: 'شناخت دقیق مدل درآمدی کسب‌وکار، تحلیل عمیق رقبا و نقاط ضعف آن‌ها در بازار، بررسی پرسونای مخاطب و تدوین RoadMap فنی و تبلیغاتی.',
    icon: Search,
    accent: 'emerald',
    iconColor: 'text-emerald-400',
    stepBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    step: '۰۲',
    title: 'معماری سیستم و طراحی تعاملی',
    englishTitle: 'Architecture & Interactive UX/UI',
    desc: 'تدوین وایرفریم‌ها، معماری پایگاه داده، سناریونویسی مسیر کاربر (User Journey) و طراحی پروتوتایپ‌های ۳بعدی واکنش‌گرا.',
    icon: Layers,
    accent: 'teal',
    iconColor: 'text-teal-400',
    stepBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  },
  {
    step: '۰۳',
    title: 'پیاده‌سازی تمیز و تولید استودیویی',
    englishTitle: 'Clean Engineering & Production',
    desc: 'کدنویسی مهندسی‌شده و استاندارد، انیمیشن‌های WebGL، فیلمبرداری تیزرهای استودیویی و اجرای فشرده‌سازی حداکثری دارایی‌ها.',
    icon: Code2,
    accent: 'cyan',
    iconColor: 'text-cyan-400',
    stepBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    step: '۰۴',
    title: 'استقرار ابری و شتاب‌دهی رشد',
    englishTitle: 'Cloud Deployment & Growth Engine',
    desc: 'لانچ روی زیرساخت امن ابری، راه‌اندازی مانیتورینگ ۲۴/۷، اجرای کمپین‌های سئو و تبلیغات محیطی و گزارش‌دهی شفاف ماهانه بازگشت سرمایه.',
    icon: Rocket,
    accent: 'amber',
    iconColor: 'text-amber-400',
    stepBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
];

const QUALITY_PILLARS = [
  {
    icon: Code2,
    badge: 'توسعه تمیز و مدرن',
    title: 'مهندسی نرم‌افزار تمیز و کدنویسی اختصاصی',
    desc: 'طراحی زیرساخت اختصاصی با Next.js و React بدون وابستگی به قالب‌های آماده و کدهای سنگین؛ تضمین سرعت لود زیر ۱ ثانیه، معماری ماژولار و کسب بالاترین نمرات در ارزیابی Core Web Vitals گوگل.',
    accent: 'emerald',
    stats: '۱۰۰٪ اختصاصی',
  },
  {
    icon: ShieldCheck,
    badge: 'امنیت و پایداری',
    title: 'امنیت چندلایه و پایداری تضمین‌شده سرور',
    desc: 'حفاظت پیشرفته در برابر حملات DDoS و نفوذهای سایبری، فایروال‌های ابری چندلایه، رمزنگاری End-to-End داده‌ها، بکاپ‌گیری منظم و اجرای بالاترین استانداردهای امنیتی وب.',
    accent: 'teal',
    stats: '۹۹.۹٪ آپتایم',
  },
  {
    icon: TrendingUp,
    badge: 'سئو الگوریتمی',
    title: 'سئو داده‌محور و رشد پایدار در موتورهای جستجو',
    desc: 'تحلیل دقیق داده‌های کاربران و هوش جستجو، ساختاردهی معنایی عمیق (Semantic SEO)، استراتژی کلاسترینگ کلمات کلیدی هدف و رساندن برند شما به جایگاه‌های برتر و پرفروش گوگل.',
    accent: 'cyan',
    stats: '+۳.۸x رشد فروش',
  },
  {
    icon: Video,
    badge: 'استودیو ۳D و تیزر',
    title: 'تولید محتوای نسل بعد، ۳D و جلوه‌های بصری',
    desc: 'خلق انیمیشن‌ها و تجربیات تعاملی سه‌بعدی با WebGL و Three.js، ایده‌پردازی سناریوهای داستانی جذب مخاطب، ریلزهای اینستاگرامی و ساخت تیزرهای سینمایی با تجهیزات 4K استودیویی.',
    accent: 'amber',
    stats: 'محتوای سینمایی',
  },
  {
    icon: Target,
    badge: 'مارکتینگ منطقه‌ای',
    title: 'استراتژی ۳۶۰ درجه و تسلط بر بازار شمال‌غرب',
    desc: 'اشراف عمیق بر اکوسیستم اقتصادی ارومیه و آذربایجان غربی؛ تلفیق هوشمندانه شبکه‌های مجازی، تبلیغات محیطی بیلبورد و کمپین‌های هدفمند برای جذب حداکثری مشتریان بالفعل.',
    accent: 'rose',
    stats: 'پوشش سراسری',
  },
  {
    icon: Headphones,
    badge: 'شراکت استراتژیک',
    title: 'پشتیبانی ۲۴/۷ و همراهی گام‌به‌گام تجاری',
    desc: 'اروم‌سیما فراتر از یک مجری پروژه، بازوی فنی و تبلیغاتی پایدار کسب‌وکار شماست. از آموزش مداوم پرسنل و مشاوره دوره‌ای تا مانیتورینگ بلادرنگ سرورها و تضمین رضایت کامل.',
    accent: 'emerald',
    stats: '۲۴/۷ در کنار شما',
  },
];

interface AboutUsEnhancedViewProps {
  settings?: {
    title?: string;
    subtitle?: string;
    vision?: string;
    mission?: string;
    stats?: any[];
  };
  stats?: any[];
  leads?: any[];
  siteSettings?: any;
}

export function AboutUsEnhancedView({
  settings = {},
  stats = [],
}: AboutUsEnhancedViewProps) {
  const pageTitle = settings.title || 'درباره کانون تبلیغات اوروم سیما';
  const pageSubtitle = settings.subtitle || 'پیشگام در تبلیغات، طراحی سایت‌های مدرن ۳ بعدی و دیجیتال مارکتینگ';
  const visionText = settings.vision || 'تبدیل ارومیه به یکی از قطب‌های فناوری و بازاریابی دیجیتال خاورمیانه با محصولات کلاس جهانی.';
  const missionText = settings.mission || 'توانمندسازی کسب‌وکارهای اصیل ایرانی برای رقابت مقتدرانه در سطح ملی و بین‌المللی با تلفیق هنر و مهندسی.';

  // Determine dynamic stats from database, falling back gracefully
  const displayStats =
    stats && stats.length > 0
      ? stats
      : settings.stats && settings.stats.length > 0
      ? settings.stats
      : [
          { value: '۱۵', suffix: '+', label: 'سال تجربه مستمر', detail: 'پیشگام در شمال‌غرب کشور' },
          { value: '۳۰۰', suffix: '+', label: 'پروژه موفق سازمانی', detail: 'صنعتی، پزشکی و تجاری' },
          { value: '۵۰', suffix: '+', label: 'برند همکار معتبر', detail: 'شراکت پایدار تجاری' },
          { value: '۳۰', suffix: '', label: 'متخصص متمرکز', detail: 'در ۴ دپارتمان سازمانی' },
        ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Animated Mesh Gradient */}
      <MeshGradient intensity="subtle" speed={0.0006} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
        {/* Header */}
        <MotionDiv variant="fade-up" className="text-center max-w-3xl mx-auto space-y-4">
          <MotionBadge className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold cursor-default">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>هویت و فلسفه اروم‌سیما</span>
          </MotionBadge>

          <KineticTypography
            text={pageTitle}
            as="h1"
            type="words"
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight"
          />

          <div className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
            <TextScramble text={pageSubtitle} duration={1} />
          </div>
        </MotionDiv>

        {/* Vision & Mission Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <TiltCard maxTilt={8} glare className="h-full">
            <div className="h-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 hover:border-brand-500/40 space-y-4 shadow-xl backdrop-blur-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold text-xl">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">چشم‌انداز ما</h2>
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                {visionText}
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glare className="h-full">
            <div className="h-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 hover:border-teal-500/40 space-y-4 shadow-xl backdrop-blur-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold text-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">رسالت و تعهد ما</h2>
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                {missionText}
              </p>
            </div>
          </TiltCard>
        </div>

        {/* ── SPECIALIZED OPERATIONAL UNITS (REPLACING CREATORS/INDIVIDUALS) ── */}
        <div className="space-y-10">
          <MotionDiv variant="fade-up" className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>ساختار سازمانی و دپارتمان‌های متمرکز</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              دپارتمان‌های تخصصی و ساختار اجرایی اروم‌سیما
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              چهار ستون عملیاتی مجزا اما هماهنگ برای خلق بالاترین استانداردهای مهندسی نرم‌افزار، سئو الگوریتمی، تیزر سینمایی و تبلیغات محیطی
            </p>
          </MotionDiv>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEPARTMENTS.map((dept) => {
              const IconComp = dept.icon;
              return (
                <StaggerItem key={dept.id}>
                  <TiltCard maxTilt={6} glare className="h-full">
                    <div className="h-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl ${dept.iconBg} flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform`}>
                              <IconComp className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono tracking-wider text-brand-400 block uppercase">
                                {dept.englishTitle}
                              </span>
                              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                                {dept.title}
                              </h3>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                            {dept.number}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                          {dept.desc}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {dept.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-400 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-brand-400/90 font-medium inline-flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>تضمین خروجی کلاس جهانی</span>
                          </span>
                          <span className="font-mono text-[11px] text-amber-300/90 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {dept.stat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* ── 4-STEP VALUE CREATION & DELIVERY METHODOLOGY ── */}
        <div className="space-y-10">
          <MotionDiv variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>چرخه ارزش‌آفرینی و متدولوژی اجرا</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              متدولوژی ۴ مرحله‌ای از کشف تا رشد مستمر
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              فرایندی مهندسی‌شده و اثبات‌شده برای تبدیل اهداف استراتژیک به نتایج پایدار و قابل اندازه‌گیری
            </p>
          </MotionDiv>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DELIVERY_WORKFLOW.map((wf, idx) => {
              const WfIcon = wf.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="h-full glass-panel rounded-3xl p-6 border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4 group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`w-9 h-9 rounded-xl ${wf.stepBg} border flex items-center justify-center font-mono font-bold text-sm`}>
                          {wf.step}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                          <WfIcon className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                          {wf.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                          {wf.englishTitle}
                        </p>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed font-light">
                        {wf.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-teal-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>خروجی مستند و شفاف</span>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* 15-Year Timeline */}
        <MotionDiv
          variant="scale-up"
          className="glass-panel-elevated rounded-3xl p-6 sm:p-10 md:p-12 border border-brand-500/20 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="text-center space-y-2 relative z-10">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-wider">
              سیر تحول و رشد
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              بیش از ۱۵ سال پیشتازی در شمال‌غرب کشور
            </h2>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 relative z-10">
            <StaggerItem>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/30 space-y-2 h-full transition-colors">
                <span className="text-2xl font-black text-brand-400 font-mono">
                  ۱۳۸۸ - ۱۳۹۴
                </span>
                <h3 className="text-base font-bold text-white">
                  تاسیس و توسعه تبلیغات محیطی
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  شروع فعالیت با بزرگترین شبکه بیلبوردی و رسانه‌های محیطی ارومیه و تجهیز نمایشگرهای شهری.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-500/30 space-y-2 h-full transition-colors">
                <span className="text-2xl font-black text-teal-400 font-mono">
                  ۱۳۹۵ - ۱۴۰۰
                </span>
                <h3 className="text-base font-bold text-white">
                  ورود به وب و دیجیتال مارکتینگ
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  گسترش دپارتمان نرم‌افزار، طراحی پورتال‌های بزرگ صنعتی، استودیو تخصصی تیزر و سئو تکنیکال.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 space-y-2 h-full transition-colors">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ۱۴۰۱ - اکنون
                </span>
                <h3 className="text-base font-bold text-white">
                  عصر وب ۳ بعدی و Next.js مدرن
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  پیشگامی در خلق رابط‌های تعاملی 3D با WebGL و R3F همراه با هوش مصنوعی و زیرساخت فوق‌سریع ابری.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </MotionDiv>

        {/* Particle Morphing WebGL Showcase */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-400">
              <Atom className="w-4 h-4 text-brand-400 animate-spin" />
              <span>QUANTUM PARTICLES & INTERACTIVE MORPHING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              سیستم ذرات کوانتومی و تبدیل هندسی ۳D
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              رندرینگ بلادرنگ ۱۸۰۰ نقطه با فرمول‌های ریاضی و پاسخگویی به نشانگر ماوس
            </p>
          </div>

          <ParticleMorph />
        </div>

        {/* ── CORE QUALITY PILLARS & ENTERPRISE STANDARDS ── */}
        <div className="space-y-12">
          <MotionDiv variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>استانداردهای مهندسی اروم‌سیما</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              ارزش‌های بنیادین و تعهدات اجرایی
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              اصولی که هر روز در تحلیل، توسعه معماری، طراحی بصری و پشتیبانی پروژه‌ها رعایت می‌کنیم.
            </p>
          </MotionDiv>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUALITY_PILLARS.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <StaggerItem key={idx}>
                  <TiltCard maxTilt={5} glare className="h-full">
                    <div className="h-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-5 group">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                            {pillar.stats}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                            {pillar.badge}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {pillar.title}
                          </h3>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed font-light">
                          {pillar.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400/80">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تضمین رسمی کیفیت</span>
                        </span>
                        <span className="font-mono text-[11px] text-gray-500">
                          0{idx + 1}
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* ── ENTERPRISE IMPACT & TRUST METRICS BAR (DYNAMICALLY DRIVEN FROM DATABASE) ── */}
        <MotionDiv
          variant="scale-up"
          className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-white/10">
            {displayStats.slice(0, 4).map((stat: any, idx: number) => {
              const colorClasses = [
                'text-emerald-400',
                'text-teal-400',
                'text-cyan-400',
                'text-amber-400',
              ];
              const colorClass = colorClasses[idx % colorClasses.length];
              const suffixStr = stat.suffix || '';
              const valueStr = String(stat.value ?? '');
              const displayVal = suffixStr.startsWith('+')
                ? `${suffixStr}${valueStr}`
                : `${valueStr}${suffixStr}`;

              return (
                <div key={idx} className="pt-4 lg:pt-0 space-y-1">
                  <span className={`text-3xl sm:text-4xl font-black ${colorClass} font-mono tracking-tight`}>
                    {displayVal}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">{stat.label}</p>
                  <p className="text-[11px] text-gray-400">
                    {stat.detail || 'استاندارد کلاس جهانی اروم‌سیما'}
                  </p>
                </div>
              );
            })}
          </div>
        </MotionDiv>

        {/* ── CONSULTATION CTA ── */}
        <MotionDiv
          variant="fade-up"
          className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-emerald-950/40 border border-emerald-500/20 backdrop-blur-xl space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            آماده‌اید کسب‌وکارتان را وارد فاز بعدی رشد کنید؟
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            برای مشاوره تخصصی رایگان پیرامون طراحی سایت‌های ۳بعدی مدرن، سئو تکنیکال و کمپین‌های دیجیتال مارکتینگ با ما تماس بگیرید.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <span>دریافت مشاوره رایگان</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}

export default AboutUsEnhancedView;
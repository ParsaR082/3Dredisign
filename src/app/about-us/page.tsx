import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Cpu,
  Code2,
  Atom,
  TrendingUp,
  Video,
  Target,
  Headphones,
  CheckCircle2,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { getLiveTeamData, getLiveSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';
import dynamic from 'next/dynamic';
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
    loading: () => <div className="h-[400px] w-full rounded-3xl bg-white/5 animate-pulse" />,
  }
);

export const metadata = generatePageMetadata({
  title: 'درباره ما | هویت، استانداردها و فناوری‌های اروم سیما',
  description:
    'آشنایی با آژانس دیجیتال مارکتینگ اروم سیما؛ پیشرو در طراحی سایت‌های ۳ بعدی مدرن، سئو تکنیکال، تولید محتوای تخصصی و بیلبورد با بیش از ۱۵ سال سابقه درخشان در ارومیه.',
  path: '/about-us/',
});

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

export default async function AboutUsPage() {
  const [{ settings }, siteSettings] = await Promise.all([
    getLiveTeamData(),
    getLiveSiteSettings(),
  ]);

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
            text={settings.title}
            as="h1"
            type="words"
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight"
          />

          <div className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
            <TextScramble text={settings.subtitle} duration={1} />
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
                {settings.vision}
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
                {settings.mission}
              </p>
            </div>
          </TiltCard>
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
              <Zap className="w-3.5 h-3.5" />
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
                  <TiltCard maxTilt={8} glare className="h-full">
                    <div className="h-full glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-xl group hover:-translate-y-1">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-950/40">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300">
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

        {/* ── ENTERPRISE IMPACT & TRUST METRICS BAR ── */}
        <MotionDiv
          variant="scale-up"
          className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-white/10">
            <div className="pt-4 lg:pt-0 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                +۱۵
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">سال تجربه مستمر</p>
              <p className="text-[11px] text-gray-400">پیشگام در شمال‌غرب کشور</p>
            </div>

            <div className="pt-4 lg:pt-0 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-teal-400 font-mono">
                +۴۵۰
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">پروژه موفق سازمانی</p>
              <p className="text-[11px] text-gray-400">صنعتی، پزشکی، تجاری</p>
            </div>

            <div className="pt-4 lg:pt-0 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
                ۹۹.۸٪
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">آپتایم سرور و سرویس</p>
              <p className="text-[11px] text-gray-400">زیرساخت ابری پایدار</p>
            </div>

            <div className="pt-4 lg:pt-0 space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                +۳.۸x
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">میانگین رشد فروش</p>
              <p className="text-[11px] text-gray-400">بازگشت سرمایه مشتریان</p>
            </div>
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
            برای مشاوره تخصصی رایگان پیرامون طراحی سایت، سئو و کمپین‌های دیجیتال مارکتینگ با ما تماس بگیرید.
          </p>
          <div className="pt-2">
            <Link
              href="/contact/"
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

import React from 'react';
import { Sparkles, Award, ShieldCheck, Cpu, Code2, Users, ArrowLeft, Atom } from 'lucide-react';
import { getTeamData, getSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';
import TechLeadPlanet from '@/components/3d/TechLeadPlanetWrapper';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { ParticleMorph } from '@/components/3d/ParticleMorph';
import { TiltCard } from '@/components/ui/TiltCard';
import { KineticTypography } from '@/components/ui/KineticTypography';
import { TextScramble } from '@/components/ui/TextScramble';

export const metadata = generatePageMetadata({
  title: 'درباره ما و تیم رهبران فناوری ۳D | اروم سیما',
  description:
    'آشنایی با آژانس دیجیتال مارکتینگ اروم سیما؛ پیشرو در طراحی سایت ۳ بعدی، سئو تکنیکال و مهندسی نرم‌افزار با بیش از ۱۵ سال تجربه در ارومیه.',
  path: '/about-us/',
});

export default function AboutUsPage() {
  const { settings, leads } = getTeamData();
  const siteSettings = getSiteSettings();

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

        {/* Tech Leads with 3D Planets & 3D Tilt */}
        <div className="space-y-10">
          <MotionDiv variant="fade-up" className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest">
              تیم نخبه اروم‌سیما
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              مدیران و معماران نوآوری دیجیتال
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              هر لید با یک هویت سیاره‌ای در منظومه سه‌بعدی اروم‌سیما شناخته می‌شود.
            </p>
          </MotionDiv>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leads.map((lead, idx) => (
              <StaggerItem key={idx}>
                <TiltCard maxTilt={10} glare className="h-full">
                  <div
                    data-cursor="view"
                    className="h-full glass-panel rounded-3xl p-5 border border-white/10 hover:border-brand-500/40 transition-colors group flex flex-col justify-between shadow-xl backdrop-blur-xl"
                  >
                    <div className="space-y-4">
                      {/* 3D Planet Canvas */}
                      <div className="h-36 sm:h-44 w-full rounded-2xl bg-dark-base/60 border border-white/5 overflow-hidden relative group-hover:border-brand-500/30 transition-colors">
                        <TechLeadPlanet
                          planetType={lead.planet_type}
                          accentColor={lead.accent_color}
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] font-mono text-gray-400 bg-dark-base/80 px-2 py-0.5 rounded backdrop-blur-sm">
                          {lead.planet_type}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                          {lead.name}
                        </h3>
                        <p className="text-xs text-brand-400 font-medium mt-0.5">
                          {lead.role}
                        </p>
                      </div>

                      <p className="text-xs text-gray-300 italic line-clamp-2">
                        «{lead.tagline}»
                      </p>

                      <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                        {lead.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300 group-hover:bg-brand-500/10 group-hover:text-brand-300 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span>{lead.years_experience} سال سابقه</span>
                      <span>+{lead.total_projects} پروژه</span>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
}

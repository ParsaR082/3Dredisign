import type { Metadata } from 'next';
import Link from 'next/link';
import { Film, Play, MapPin, Clock, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveBackstageItems } from '@/lib/db';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

export const metadata: Metadata = generatePageMetadata({
  title: 'پشت صحنه تولید تیزر، عکاسی صنعتی و پروژه‌ها | اروم سیما',
  description: 'ویدیوها و تصاویر پشت‌صحنه ساخت تیزرهای تبلیغاتی، سناریونویسی، تصویربرداری هوایی و کمپین‌های اروم‌سیما در ارومیه.',
  path: '/backstage/',
});

export default async function BackstageListPage() {
  const items = await getLiveBackstageItems();

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-16">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">پشت‌صحنه</span>
      </MotionDiv>

      {/* Hero Header */}
      <MotionDiv
        variant="scale-up"
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-14 overflow-hidden border border-white/10 bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-950/30 backdrop-blur-xl shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
          <MotionBadge className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold cursor-default">
            <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
            <span>سینما، خلاقیت و پشت دوربین</span>
          </MotionBadge>
          <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            روایتی از <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-400">پشت‌صحنه تولیدات</span> اروم‌سیما
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            فرآیند ساخت تیزرهای تبلیغاتی، تجهیزات سینمایی نورپردازی و تصویربرداری، طراحی استوری‌بورد و تلاش تیم فنی در کارخانجات، استودیو و لوکیشن‌های استان.
          </p>
        </div>
      </MotionDiv>

      {/* Backstage Items Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
        {items.map((item) => (
          <StaggerItem key={item.id} className="h-full">
            <InteractiveCard className="group rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-dark-card/80 hover:border-brand-500/40 transition-colors duration-300 flex flex-col justify-between h-full shadow-2xl">
              {/* Visual with Play Overlay */}
              <div className="relative aspect-[16/10] overflow-hidden bg-dark-surface">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-black/30 to-transparent" />
                
                {/* Play Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg shadow-brand-600/40 group-hover:scale-115 transition-transform duration-300">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-dark-base/80 backdrop-blur-md text-gray-200 border border-white/10 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-400" />
                    {item.duration_label}
                  </span>
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-dark-base/80 backdrop-blur-md text-gray-200 border border-white/10 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-400" />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-3 sm:pt-4 border-t border-white/5">
                  <Link
                    href={`/backstage/${encodeURIComponent(item.slug)}/`}
                    className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all group-hover:border-brand-500/40"
                  >
                    <span>مشاهده ویدیو و مستندات</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Film, Play, MapPin, Clock, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveBackstageItems, getLiveBackstagePageSettings } from '@/lib/db';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const pageSettings = await getLiveBackstagePageSettings();
  return generatePageMetadata({
    title: pageSettings.meta_title || 'پشت صحنه تولید تیزر، عکاسی صنعتی و پروژه‌ها | اروم سیما',
    description: pageSettings.meta_description || 'ویدیوها و تصاویر پشت‌صحنه ساخت تیزرهای تبلیغاتی، سناریونویسی، تصویربرداری هوایی و کمپین‌های اروم‌سیما در ارومیه.',
    path: '/backstage/',
  });
}

export default async function BackstageListPage() {
  const [items, pageSettings] = await Promise.all([
    getLiveBackstageItems(),
    getLiveBackstagePageSettings(),
  ]);

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
            <span>{pageSettings.hero_badge || 'سینما، خلاقیت و پشت دوربین'}</span>
          </MotionBadge>
          <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {pageSettings.hero_title}
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            {pageSettings.hero_description}
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-500/90 text-brand-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" />
                        <span>{item.location}</span>
                      </span>
                    )}
                    {item.duration_label && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-brand-400" />
                        <span>{item.duration_label}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {item.excerpt || item.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                  <span>مشاهده مستند پشت صحنه</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

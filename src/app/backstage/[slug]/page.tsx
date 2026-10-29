import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Film, Play, MapPin, Clock, Calendar, ChevronRight, Share2, Sparkles, ArrowLeft } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveBackstageItems, getLiveBackstageBySlug } from '@/lib/db';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

interface BackstagePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await getLiveBackstageItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: BackstagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getLiveBackstageBySlug(slug);
  if (!item) {
    return generatePageMetadata({
      title: 'پشت‌صحنه | اروم سیما',
      path: `/backstage/${slug}/`,
    });
  }

  return generatePageMetadata({
    title: `${item.title} | پشت‌صحنه اروم سیما`,
    description: item.excerpt || item.subtitle || item.title,
    path: `/backstage/${item.slug}/`,
  });
}

export default async function BackstageDetailPage({ params }: BackstagePageProps) {
  const { slug } = await params;
  const item = await getLiveBackstageBySlug(slug);

  if (!item) {
    notFound();
  }

  const allItems = await getLiveBackstageItems();
  const otherItems = allItems.filter((b) => b.id !== item.id).slice(0, 3);

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <Link href="/backstage/" className="hover:text-brand-400 transition-colors">پشت‌صحنه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200 truncate">{item.title}</span>
      </MotionDiv>

      {/* Hero Meta Header */}
      <MotionDiv variant="fade-up" delay={0.05} className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <MotionBadge className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-300">
            تولید و تصویربرداری
          </MotionBadge>
          <span className="text-[11px] sm:text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            {item.location}
          </span>
          <span className="text-[11px] sm:text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            {item.duration_label}
          </span>
          {item.published_at && (
            <span className="text-[11px] sm:text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              {item.published_at}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {item.title}
        </h1>

        {item.subtitle && (
          <p className="text-sm sm:text-lg text-gray-300 leading-relaxed font-medium">
            {item.subtitle}
          </p>
        )}
      </MotionDiv>

      {/* Video / Visual Player Container */}
      <MotionDiv variant="scale-up" delay={0.1} className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl">
        {item.cover_video ? (
          <video
            src={item.cover_video}
            poster={item.cover_image}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="relative w-full h-full group">
            <img
              src={item.cover_image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <a
                href={item.embed_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xl shadow-brand-600/50 hover:scale-110 active:scale-95 transition-transform"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-0.5" />
              </a>
            </div>
          </div>
        )}
      </MotionDiv>

      {/* Main Narrative Article */}
      <MotionDiv variant="fade-up" delay={0.15}>
        <InteractiveCard className="rounded-2xl sm:rounded-3xl p-4 sm:p-10 bg-dark-card/60 border border-white/5 space-y-4 sm:space-y-6 shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-400" />
            <span>شرح مراحل تولید و سناریو</span>
          </h2>
          <div className="text-gray-300 text-xs sm:text-base leading-loose text-justify space-y-3 sm:space-y-4">
            <p>{item.body || item.excerpt}</p>
          </div>
        </InteractiveCard>
      </MotionDiv>

      {/* CTA Box */}
      <MotionDiv variant="scale-up">
        <InteractiveCard className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-r from-brand-950/40 via-dark-card to-dark-surface border border-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-2xl">
          <div className="space-y-1.5 sm:space-y-2 text-center sm:text-right">
            <h3 className="text-lg sm:text-xl font-black text-white">برای برند خود تیزر صنعتی و تبلیغاتی حرفه‌ای می‌خواهید؟</h3>
            <p className="text-gray-300 text-xs sm:text-sm">تیم کارگردانی و تصویربرداری اروم‌سیما آماده اجرای ایده‌های شماست.</p>
          </div>
          <Link
            href="/video-teaser-urmia/"
            className="w-full sm:w-auto text-center shrink-0 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            خدمات تیزر و فیلم ارومیه
          </Link>
        </InteractiveCard>
      </MotionDiv>

      {/* Other Backstage */}
      {otherItems.length > 0 && (
        <MotionDiv variant="fade-up" className="space-y-6 pt-8 border-t border-white/5">
          <h2 className="text-xl font-bold text-white">سایر پشت‌صحنه‌های اروم‌سیما</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherItems.map((b) => (
              <StaggerItem key={b.id}>
                <Link href={`/backstage/${encodeURIComponent(b.slug)}/`}>
                  <InteractiveCard className="group rounded-2xl overflow-hidden border border-white/10 bg-dark-card/60 p-4 space-y-3 hover:border-brand-500/30 transition-colors shadow-lg">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-dark-surface">
                      <img
                        src={b.cover_image}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                  </InteractiveCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </MotionDiv>
      )}
    </div>
  );
}

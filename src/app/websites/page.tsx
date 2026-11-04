import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ExternalLink, ArrowLeft, Laptop, ChevronRight } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveWebsites, getLiveWebsitesPageSettings } from '@/lib/db';
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
  const pageSettings = await getLiveWebsitesPageSettings();
  return generatePageMetadata({
    title: pageSettings.meta_title || 'وبسایت‌های نمونه و قالب‌های آماده مدرن | اروم سیما',
    description: pageSettings.meta_description || 'مجموعه وبسایت‌های مدرن، قالب‌های آماده و نمونه‌کارهای توسعه وب در ارومیه با استانداردهای جهانی UI/UX و سئو.',
    path: '/websites/',
  });
}

export default async function WebsitesPage() {
  const [websites, pageSettings] = await Promise.all([
    getLiveWebsites(),
    getLiveWebsitesPageSettings(),
  ]);

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-16">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200">وبسایت‌ها</span>
      </MotionDiv>

      {/* Hero Header */}
      <MotionDiv
        variant="scale-up"
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-14 overflow-hidden border border-white/10 bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-950/30 backdrop-blur-xl shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
          <MotionBadge className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold cursor-default">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
            <span>{pageSettings.hero_badge || 'ویترین وبسایت‌های آماده و اختصاصی'}</span>
          </MotionBadge>
          <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {pageSettings.hero_title}
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            {pageSettings.hero_description}
          </p>
        </div>
      </MotionDiv>

      {/* Websites Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {websites.map((site) => (
          <StaggerItem key={site.id}>
            <Link href={`/websites/${site.slug}/`} className="block group h-full">
              <InteractiveCard className="glass-panel rounded-2xl sm:rounded-3xl border border-white/10 group-hover:border-brand-500/40 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between h-full shadow-xl">
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative">
                    <img
                      src={site.cover_image}
                      alt={site.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    {site.is_featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-500/80 text-white text-[10px] font-bold backdrop-blur-md">
                        ویژه
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{site.industry || 'عمومی'}</span>
                      <span className="font-mono">{site.year || '۱۴۰۳'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                      {site.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {site.excerpt || site.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                  <span>مشاهده جزئیات و دمو</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </InteractiveCard>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

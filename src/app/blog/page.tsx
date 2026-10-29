import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { getLiveBlogData } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

export const metadata = generatePageMetadata({
  title: 'مجله تخصصی دیجیتال مارکتینگ و طراحی وب | اروم سیما',
  description: 'مقالات تحلیلی در خصوص طراحی سایت سه‌بعدی، سئو تکنیکال در ارومیه، و استراتژی‌های ویدیو مارکتینگ صنعتی.',
  path: '/blog/',
});

export default async function BlogIndexPage() {
  const { settings, articles } = await getLiveBlogData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16">
      {/* Header */}
      <MotionDiv variant="fade-up" className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <MotionBadge className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold cursor-default">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          <span>دانشنامه تخصصی اروم‌سیما</span>
        </MotionBadge>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {settings.title}
        </h1>
        <p className="text-gray-400 text-xs sm:text-base leading-relaxed">
          {settings.subtitle}
        </p>
      </MotionDiv>

      {/* Articles Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 items-stretch">
        {articles.map((art) => (
          <StaggerItem key={art.id} className="h-full">
            <InteractiveCard className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/40 transition-colors group flex flex-col justify-between h-full shadow-xl">
              <div>
                <div className="relative h-44 sm:h-48 w-full bg-dark-elevated overflow-hidden">
                  <img
                    src={art.cover_image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-brand-300 bg-dark-base/80 px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    {art.category}
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-400" />
                      <span>{art.published_at}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{art.reading_time}</span>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                    {art.title}
                  </h2>

                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0 border-t border-white/5 mt-2 sm:mt-4">
                <Link
                  href={`/blog/${art.slug}/`}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 pt-3 sm:pt-4 group-hover:-translate-x-1.5 transition-transform"
                >
                  <span>مطالعه متن کامل مقاله</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

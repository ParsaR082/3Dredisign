import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { getBlogData } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'مجله تخصصی دیجیتال مارکتینگ و طراحی وب | اروم سیما',
  description: 'مقالات تحلیلی در خصوص طراحی سایت سه‌بعدی، سئو تکنیکال در ارومیه، و استراتژی‌های ویدیو مارکتینگ صنعتی.',
  path: '/blog/',
});

export default function BlogIndexPage() {
  const { settings, articles } = getBlogData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>دانشنامه تخصصی اروم‌سیما</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
          {settings.title}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          {settings.subtitle}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.id}
            className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-dark-elevated overflow-hidden">
                <img
                  src={art.cover_image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold text-brand-300 bg-dark-base/80 px-2.5 py-1 rounded-full border border-white/10">
                  {art.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{art.published_at}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
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

            <div className="p-6 pt-0 border-t border-white/5 mt-4">
              <Link
                href={`/blog/${art.slug}/`}
                className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 pt-4 group-hover:-translate-x-1 transition-transform"
              >
                <span>مطالعه متن کامل مقاله</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

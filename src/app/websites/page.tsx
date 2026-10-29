import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ExternalLink, ArrowLeft, Laptop, ChevronRight } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveWebsites } from '@/lib/db';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

export const metadata: Metadata = generatePageMetadata({
  title: 'وبسایت‌های نمونه و قالب‌های آماده مدرن | اروم سیما',
  description: 'مجموعه وبسایت‌های مدرن، قالب‌های آماده و نمونه‌کارهای توسعه وب در ارومیه با استانداردهای جهانی UI/UX و سئو.',
  path: '/websites/',
});

export default async function WebsitesPage() {
  const websites = await getLiveWebsites();

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
            <span>ویترین وبسایت‌های آماده و اختصاصی</span>
          </MotionBadge>
          <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            برترین وبسایت‌های <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-400">نمونه و پیش‌ساخته</span>
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            مجموعه‌ای منتخب از طراحی‌های وب واکنش‌گرا، سریع و بهینه‌سازی‌شده برای سئو در اصناف مختلف از فروشگاهی تا شرکتی و لوکس. هر وبسایت قابلیت شخصی‌سازی کامل با هویت برند شما را دارد.
          </p>
        </div>
      </MotionDiv>

      {/* Websites Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
        {websites.map((ws) => (
          <StaggerItem key={ws.id} className="h-full">
            <InteractiveCard className="group rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-dark-card/80 hover:border-brand-500/35 transition-colors duration-300 flex flex-col justify-between h-full hover:shadow-2xl hover:shadow-brand-500/10">
              {/* Card Visual / Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-dark-surface">
                <img
                  src={ws.cover_image}
                  alt={ws.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-80" />
                
                {/* Badges */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
                  {ws.category_name && (
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-dark-base/80 backdrop-blur-md text-brand-300 border border-brand-500/20">
                      {ws.category_name}
                    </span>
                  )}
                  {ws.is_one_page && (
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      وان‌پیج
                    </span>
                  )}
                </div>

                {ws.pages_label && (
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[11px] sm:text-xs font-semibold text-gray-300 bg-dark-base/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg backdrop-blur-sm border border-white/5">
                    {ws.pages_label}
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 sm:space-y-5">
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                    <span>{ws.client_name}</span>
                    <span>{ws.industry}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                    {ws.title}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {ws.excerpt}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                {ws.tech_stack_csv && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 sm:pt-2">
                    {ws.tech_stack_csv.split(',').map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-gray-300 border border-white/5 group-hover:border-brand-500/20 transition-colors"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between gap-2.5 sm:gap-3">
                  <Link
                    href={`/websites/${ws.slug}/`}
                    className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all group-hover:border-brand-500/40"
                  >
                    <span>بررسی مشخصات</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                  {ws.live_url && (
                    <a
                      href={ws.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/5 transition-all hover:scale-105 active:scale-95"
                      title="مشاهده زنده"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Bottom CTA Banner */}
      <MotionDiv variant="scale-up">
        <InteractiveCard className="rounded-2xl sm:rounded-3xl p-5 sm:p-12 bg-gradient-to-r from-brand-950/40 via-dark-card to-dark-surface border border-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-2xl">
          <div className="space-y-1.5 sm:space-y-2 text-center sm:text-right">
            <h3 className="text-xl sm:text-2xl font-black text-white">وبسایت اختصاصی با مشخصات کسب‌وکار خود می‌خواهید؟</h3>
            <p className="text-gray-300 text-xs sm:text-sm">مشاوره تخصصی و برآورد زمان و هزینه را با کارشناسان فنی اروم‌سیما شروع کنید.</p>
          </div>
          <Link
            href="/contact-us/"
            className="w-full sm:w-auto text-center shrink-0 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            درخواست مشاوره رایگان
          </Link>
        </InteractiveCard>
      </MotionDiv>
    </div>
  );
}

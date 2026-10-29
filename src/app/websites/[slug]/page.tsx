import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { getLiveWebsites, getLiveWebsiteBySlug } from '@/lib/db';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
} from '@/components/ui/motion';

interface WebsitePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const websites = await getLiveWebsites();
  return websites.map((ws) => ({
    slug: ws.slug,
  }));
}

export async function generateMetadata({ params }: WebsitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const ws = await getLiveWebsiteBySlug(slug);
  if (!ws) {
    return generatePageMetadata({
      title: 'وبسایت نمونه | اروم سیما',
      path: `/websites/${slug}/`,
    });
  }

  return generatePageMetadata({
    title: `${ws.title} | وبسایت نمونه اروم سیما`,
    description: ws.excerpt || ws.subtitle || ws.title,
    path: `/websites/${ws.slug}/`,
  });
}

export default async function WebsiteDetailPage({ params }: WebsitePageProps) {
  const { slug } = await params;
  const ws = await getLiveWebsiteBySlug(slug);

  if (!ws) {
    notFound();
  }

  const allWebsites = await getLiveWebsites();
  const otherWebsites = allWebsites.filter((item) => item.id !== ws.id).slice(0, 3);

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-16">
      {/* Breadcrumb */}
      <MotionDiv variant="fade-up" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <Link href="/websites/" className="hover:text-brand-400 transition-colors">وبسایت‌ها</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200 truncate">{ws.title}</span>
      </MotionDiv>

      {/* Hero Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Copy */}
        <MotionDiv variant="fade-up" delay={0.05} className="lg:col-span-6 space-y-5 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {ws.category_name && (
              <MotionBadge className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-300">
                {ws.category_name}
              </MotionBadge>
            )}
            {ws.is_one_page && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                طراحی وان‌پیج
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium">
              صنعت: {ws.industry}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {ws.title}
          </h1>

          {ws.subtitle && (
            <p className="text-base sm:text-lg text-brand-300 font-medium">{ws.subtitle}</p>
          )}

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed text-justify">
            {ws.body || ws.excerpt}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
            <InteractiveCard className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                تعداد صفحات
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{ws.pages_label || 'اختصاصی'}</p>
            </InteractiveCard>
            <InteractiveCard className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                سال پیاده‌سازی
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{ws.year || 1403}</p>
            </InteractiveCard>
            <InteractiveCard className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                مشتری / سفارش‌دهنده
              </span>
              <p className="text-xs sm:text-sm font-bold text-white truncate">{ws.client_name}</p>
            </InteractiveCard>
          </div>

          {/* CTA Buttons */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {ws.live_url && (
              <a
                href={ws.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center justify-center px-6 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
              >
                <span>مشاهده دمو زنده وبسایت</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <Link
              href="/contact-us/"
              className="w-full sm:w-auto text-center justify-center px-6 py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 border border-white/10 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95"
            >
              سفارش وبسایتی مشابه این
            </Link>
          </div>
        </MotionDiv>

        {/* Visual Preview Device Frame */}
        <MotionDiv variant="scale-up" delay={0.1} className="lg:col-span-6">
          <div className="relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/10 shadow-2xl overflow-hidden group">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] bg-dark-card relative">
              <img
                src={ws.cover_image}
                alt={ws.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </MotionDiv>
      </div>

      {/* Key Features & Architecture */}
      {ws.features && ws.features.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white">ویژگی‌های فنی و قابلیت‌های کلیدی</h2>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {ws.features.map((feat, idx) => (
              <StaggerItem key={idx}>
                <InteractiveCard className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-dark-card/60 border border-white/5 space-y-3 hover:border-brand-500/25 transition-colors shadow-lg h-full">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {feat.description}
                  </p>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}

      {/* Tech Stack Banner */}
      {ws.tech_stack_csv && (
        <MotionDiv variant="fade-up" className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-dark-surface border border-white/5 space-y-3 sm:space-y-4 shadow-xl">
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider">
            تکنولوژی‌های مورداستفاده در توسعه (Tech Stack)
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {ws.tech_stack_csv.split(',').map((tech, idx) => (
              <span
                key={idx}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-white/[0.04] text-gray-200 border border-white/10 hover:border-brand-500/30 transition-colors"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </MotionDiv>
      )}

      {/* Other Showcase Websites */}
      {otherWebsites.length > 0 && (
        <MotionDiv variant="fade-up" className="space-y-6 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">سایر وبسایت‌های پیشنهادی</h2>
            <Link href="/websites/" className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1">
              <span>مشاهده همه</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherWebsites.map((item) => (
              <StaggerItem key={item.id}>
                <Link href={`/websites/${item.slug}/`}>
                  <InteractiveCard className="group rounded-2xl overflow-hidden border border-white/10 bg-dark-card/60 p-4 space-y-3 hover:border-brand-500/30 transition-colors shadow-lg">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-dark-surface">
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-gray-400">{item.client_name}</span>
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

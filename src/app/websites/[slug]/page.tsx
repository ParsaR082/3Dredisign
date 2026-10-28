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

interface WebsitePageProps {
  params: Promise<{ slug: string }>;
}

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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-400 transition-colors">خانه</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <Link href="/websites/" className="hover:text-brand-400 transition-colors">وبسایت‌ها</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
        <span className="text-gray-200 truncate">{ws.title}</span>
      </nav>

      {/* Hero Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {ws.category_name && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-300">
                {ws.category_name}
              </span>
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {ws.title}
          </h1>

          {ws.subtitle && (
            <p className="text-lg text-brand-300 font-medium">{ws.subtitle}</p>
          )}

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-justify">
            {ws.body || ws.excerpt}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                تعداد صفحات
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{ws.pages_label || 'اختصاصی'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                سال پیاده‌سازی
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{ws.year || 1403}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                مشتری / سفارش‌دهنده
              </span>
              <p className="text-xs sm:text-sm font-bold text-white truncate">{ws.client_name}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            {ws.live_url && (
              <a
                href={ws.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-teal-500 text-white font-bold text-sm shadow-xl shadow-brand-500/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
              >
                <span>مشاهده دمو زنده وبسایت</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <Link
              href="/contact-us/"
              className="px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 border border-white/10 text-sm font-bold transition-all"
            >
              سفارش وبسایتی مشابه این
            </Link>
          </div>
        </div>

        {/* Visual Preview Device Frame */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl p-2 bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/10 shadow-2xl overflow-hidden group">
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-dark-card relative">
              <img
                src={ws.cover_image}
                alt={ws.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Features & Architecture */}
      {ws.features && ws.features.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h2 className="text-2xl font-black text-white">ویژگی‌های فنی و قابلیت‌های کلیدی</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ws.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-dark-card/60 border border-white/5 space-y-3 hover:border-brand-500/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack Banner */}
      {ws.tech_stack_csv && (
        <div className="rounded-3xl p-8 bg-dark-surface border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            تکنولوژی‌های مورداستفاده در توسعه (Tech Stack)
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {ws.tech_stack_csv.split(',').map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.04] text-gray-200 border border-white/10"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Other Showcase Websites */}
      {otherWebsites.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">سایر وبسایت‌های پیشنهادی</h2>
            <Link href="/websites/" className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1">
              <span>مشاهده همه</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherWebsites.map((item) => (
              <Link
                key={item.id}
                href={`/websites/${item.slug}/`}
                className="group rounded-2xl overflow-hidden border border-white/10 bg-dark-card/60 p-4 space-y-3 hover:border-brand-500/30 transition-all"
              >
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-dark-surface">
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                  {item.title}
                </h3>
                <span className="text-[11px] text-gray-400">{item.client_name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

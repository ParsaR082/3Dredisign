import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles, ExternalLink, Calendar, MapPin, Layers } from 'lucide-react';
import { getProjects, getProjectBySlug } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return generatePageMetadata({
    title: project.title + ' | نمونه کار اروم سیما',
    description: project.subtitle || project.description,
    path: '/portfolio/' + project.slug + '/',
    ogImage: project.thumbnail_image,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/?returnFrom=${project.slug}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-600/25 border border-white/10 hover:border-brand-500/40 text-gray-300 hover:text-white text-xs font-semibold transition-all group shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-brand-400 group-hover:-translate-x-1 transition-transform" />
            <span>بازگشت به محوطه ۳بعدی</span>
          </Link>

          <Link
            href="/portfolio/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-300 transition-colors"
          >
            <span>مشاهده همه نمونه‌کارها</span>
          </Link>
        </div>

        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
            <span>{project.category}</span>
            <span>•</span>
            <span>{project.industry}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
            {project.subtitle || project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-400" />
              <span>تاریخ تحویل: {project.project_date}</span>
            </div>
            {project.location_zone && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>موقعیت: {project.location_zone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Preview Banner / Mockup */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-4 sm:p-8">
        <img
          src={project.mockups?.desktop || project.thumbnail_image}
          alt={project.title}
          className="w-full h-auto max-h-[550px] object-cover rounded-2xl mx-auto shadow-2xl"
        />
      </div>

      {/* KPIs & Results Bar */}
      <div className="glass-panel-elevated rounded-3xl p-8 border border-brand-500/30">
        <h3 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">
          شاخص‌های کلیدی عملکرد و نتایج ملموس (KPIs)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
          {project.kpis.map((kpi, idx) => (
            <div key={idx} className="pt-4 md:pt-0 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-gradient-brand">{kpi.value}</div>
              <div className="text-sm font-bold text-white">{kpi.label}</div>
              {kpi.detail && <div className="text-xs text-gray-400">{kpi.detail}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Case Details: Challenge & Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-white">داستان پروژه و رویکرد اجرایی</h2>
            <div className="text-sm sm:text-base text-gray-300 leading-relaxed space-y-4">
              <p>{project.detailed_description}</p>
            </div>
          </div>

          {project.challenge && (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-amber-300">چالش اصلی و راه‌حل مهندسی</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">
              اطلاعات و پشته فنی پروژه
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="block text-gray-400 mb-1">دسته‌بندی</span>
                <span className="font-semibold text-white">{project.category}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">صنعت و حوزه فعالیت</span>
                <span className="font-semibold text-white">{project.industry}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-2">فناوری‌های به‌کاررفته</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t, idx) => (
                    <span key={idx} className="bg-white/5 px-2.5 py-1 rounded-md text-brand-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                href="/contact-us/"
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>سفارش پروژه‌ای مشابه</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

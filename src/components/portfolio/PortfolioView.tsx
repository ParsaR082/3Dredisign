'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';
import type { Project } from '@/types/content';

interface PortfolioViewProps {
  allProjects: Project[];
}

export default function PortfolioView({ allProjects }: PortfolioViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'همه پروژه‌ها', value: 'all' },
    { label: 'طراحی سایت و پورتال', value: 'web' },
    { label: 'اینستاگرام و ویدیو مارکتینگ', value: 'instagram' },
    { label: 'تیزر و هلی‌شات', value: 'video' },
    { label: 'برندینگ و لوگو', value: 'branding' },
    { label: 'تبلیغات محیطی و بیلبورد', value: 'billboard' },
  ];

  const featuredProjects = allProjects.filter((p) => p.featured);
  const filtered =
    selectedCategory === 'all'
      ? allProjects
      : allProjects.filter((p) => p.category_slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>ویترین دستاوردهای سازمانی و برندینگ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          پرونده پروژه‌های شاخص اروم‌سیما
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          کاوشی عمیق در استراتژی، هویت بصری، مهندسی وب و نرخ بازگشت سرمایه در شاخص‌ترین کسب‌وکارهای شمال‌غرب کشور.
        </p>
      </div>

      {/* ── SECTION 1: FEATURED SPOTLIGHT PROJECTS ── */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>پروژه‌های شاخص سازمانی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">ویترین برگزیده‌ها</h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {featuredProjects.length} پرونده ویژه
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel-dock rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative h-64 sm:h-80 w-full bg-dark-elevated overflow-hidden p-6">
                <img
                  src={project.thumbnail_image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-dark-base/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-brand-300">
                  {project.category}
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-gray-400">{project.industry}</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2">
                    {project.subtitle || project.description}
                  </p>
                </div>

                {/* Real KPIs */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
                  {project.kpis.map((kpi, kIdx) => (
                    <div key={kIdx} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                      <div className="text-sm sm:text-base font-black text-brand-400 font-mono">{kpi.value}</div>
                      <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{kpi.label}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded-md text-gray-300 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={'/portfolio/' + project.slug + '/'}
                    className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 group-hover:-translate-x-1 transition-all"
                  >
                    <span>مشاهده پرونده کامل</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: COMPLETE FILTERABLE ARCHIVE ── */}
      <section className="space-y-8 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <Filter className="w-4 h-4 text-teal-400" />
              <span>فهرست جامع دستاوردها</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">آرشیو کامل پروژه‌ها</h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all border ' +
                  (selectedCategory === c.value
                    ? 'bg-brand-600 text-white border-brand-400 shadow-lg shadow-brand-600/30'
                    : 'glass-panel-spatial text-gray-300 hover:text-white border-white/10 hover:bg-white/10')
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span>نمایش {filtered.length} پروژه از مجموع {allProjects.length} دستاورد</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel-dock space-y-3">
            <p className="text-gray-300 text-sm">در این دسته‌بندی پروژه‌ای یافت نشد.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-brand-400 hover:underline"
            >
              مشاهده همه پروژه‌ها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="glass-panel-spatial rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/40 transition-all group flex flex-col justify-between"
              >
                <div className="relative h-60 w-full bg-dark-elevated overflow-hidden p-5">
                  <img
                    src={project.thumbnail_image}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-dark-base/85 px-3 py-1 rounded-full text-xs font-bold text-brand-300 border border-white/10">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-gray-400">{project.industry}</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors mt-0.5">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs text-gray-400 font-mono">
                      {project.kpis[0] ? project.kpis[0].value + ' ' + project.kpis[0].label : ''}
                    </span>
                    <Link
                      href={'/portfolio/' + project.slug + '/'}
                      className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group-hover:-translate-x-1 transition-all"
                    >
                      <span>بررسی پرونده</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

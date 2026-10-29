'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Filter, MapPin } from 'lucide-react';
import type { Project } from '@/types/content';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
  transitionSpring,
  transitionSmooth,
} from '@/components/ui/motion';
import { TiltCard } from '@/components/ui/TiltCard';

interface PortfolioViewProps {
  allProjects: Project[];
  initialCategory?: string;
  categoryTitle?: string;
}

export default function PortfolioView({ allProjects, initialCategory, categoryTitle }: PortfolioViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');

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
      : allProjects.filter((p) => {
          if (p.category_slug === selectedCategory) return true;
          if (selectedCategory.includes('ecommerce') || selectedCategory.includes('web')) return p.category_slug === 'web';
          if (selectedCategory.includes('branding')) return p.category_slug === 'branding';
          if (selectedCategory.includes('social') || selectedCategory.includes('content')) return p.category_slug === 'instagram';
          if (selectedCategory.includes('video') || selectedCategory.includes('teaser')) return p.category_slug === 'video';
          return true;
        });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-20">
      {/* Header */}
      <MotionDiv variant="fade-up" className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <MotionBadge className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold cursor-default">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>ویترین دستاوردهای سازمانی و برندینگ</span>
        </MotionBadge>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {categoryTitle || 'پرونده پروژه‌های شاخص اروم‌سیما'}
        </h1>
        <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
          کاوشی عمیق در استراتژی، هویت بصری، مهندسی وب و نرخ بازگشت سرمایه در شاخص‌ترین کسب‌وکارهای شمال‌غرب کشور.
        </p>

        {/* Link to interactive projects map */}
        <div className="pt-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              href="/portfolio/projects-map/"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/25 text-brand-300 text-xs font-bold transition-colors group shadow-lg shadow-brand-500/10 text-center"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-400 group-hover:scale-110 transition-transform" />
              <span>مشاهده نقشه تعاملی پروژه‌ها در سطح ارومیه</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </MotionDiv>

      {/* ── SECTION 1: FEATURED SPOTLIGHT PROJECTS ── */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>پروژه‌های شاخص سازمانی</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">ویترین برگزیده‌ها</h2>
          </div>
          <span className="text-xs text-gray-400 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {featuredProjects.length} پرونده ویژه
          </span>
        </div>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {featuredProjects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <TiltCard maxTilt={6} glare className="h-full">
                <div
                  data-cursor="view"
                  className="glass-panel-dock rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/50 transition-colors group flex flex-col justify-between h-full shadow-2xl backdrop-blur-xl"
                >
                  <div className="relative h-52 sm:h-80 w-full bg-dark-elevated overflow-hidden p-3 sm:p-6">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={project.thumbnail_image}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-dark-base/85 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 text-[11px] sm:text-xs font-bold text-brand-300">
                      {project.category}
                    </div>
                  </div>

                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <span className="text-[11px] sm:text-xs font-mono text-gray-400">{project.industry}</span>
                    <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2">
                      {project.subtitle || project.description}
                    </p>
                  </div>

                  {/* Real KPIs */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-white/5">
                    {project.kpis.map((kpi, kIdx) => (
                      <motion.div
                        key={kIdx}
                        whileHover={{ scale: 1.04 }}
                        className="bg-white/5 rounded-xl p-2 sm:p-3 text-center border border-white/5"
                      >
                        <div className="text-xs sm:text-base font-black text-brand-400 font-mono truncate">{kpi.value}</div>
                        <div className="text-[9px] sm:text-[10px] text-gray-400 line-clamp-1 mt-0.5">{kpi.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-md text-gray-300 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={'/portfolio/' + project.slug + '/'}
                      className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 group-hover:-translate-x-1.5 transition-transform"
                    >
                      <span>مشاهده پرونده کامل</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </TiltCard>
          </StaggerItem>
          ))}
        </StaggerContainer>
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

          {/* Category Filter Chips with layoutId animated background */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl glass-panel border border-white/5">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-colors cursor-pointer ${
                    isSelected ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="portfolio-filter-pill"
                      transition={transitionSpring}
                      className="absolute inset-0 bg-brand-600 rounded-xl shadow-lg shadow-brand-600/30 -z-10"
                    />
                  )}
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span>نمایش {filtered.length} پروژه از مجموع {allProjects.length} دستاورد</span>
        </div>

        {/* Grid with layout animation */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl glass-panel-dock space-y-3"
            >
              <p className="text-gray-300 text-sm">در این دسته‌بندی پروژه‌ای یافت نشد.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-brand-400 hover:underline cursor-pointer"
              >
                مشاهده همه پروژه‌ها
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8"
            >
              {filtered.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={transitionSmooth}
                  key={project.id}
                  className="h-full"
                >
                  <TiltCard maxTilt={6} glare className="h-full">
                    <div
                      data-cursor="view"
                      className="glass-panel-spatial rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-brand-500/40 transition-colors group flex flex-col justify-between h-full shadow-xl backdrop-blur-xl"
                    >
                      <div className="relative h-48 sm:h-60 w-full bg-dark-elevated overflow-hidden p-3 sm:p-5">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          src={project.thumbnail_image}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-dark-base/85 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-brand-300 border border-white/10">
                          {project.category}
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div>
                          <span className="text-[11px] font-mono text-gray-400">{project.industry}</span>
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors mt-0.5">
                            {project.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="text-[11px] sm:text-xs text-gray-400 font-mono truncate max-w-[140px] sm:max-w-none">
                            {project.kpis[0] ? project.kpis[0].value + ' ' + project.kpis[0].label : ''}
                          </span>
                          <Link
                            href={'/portfolio/' + project.slug + '/'}
                            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group-hover:-translate-x-1.5 transition-transform"
                          >
                            <span>بررسی پرونده</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

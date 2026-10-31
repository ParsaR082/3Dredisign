'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Filter, MapPin, Layers, Folder } from 'lucide-react';
import type { Project, ProjectCategory } from '@/types/content';
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
  initialCategories?: ProjectCategory[];
  initialCategory?: string;
  categoryTitle?: string;
}

export default function PortfolioView({
  allProjects,
  initialCategories,
  initialCategory,
  categoryTitle,
}: PortfolioViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');

  // Build dynamic categories list from DB with fallback
  const categoryList = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return [
        { label: 'همه پروژه‌ها', value: 'all', cover_image: null, icon: 'layers' },
        ...initialCategories.map((c) => ({
          label: c.name,
          value: c.slug,
          cover_image: c.cover_image,
          icon: c.icon || 'folder',
        })),
      ];
    }
    return [
      { label: 'همه پروژه‌ها', value: 'all', cover_image: null, icon: 'layers' },
      { label: 'طراحی سایت و پورتال', value: 'web', cover_image: null, icon: 'globe' },
      { label: 'اینستاگرام و ویدیو مارکتینگ', value: 'instagram', cover_image: null, icon: 'sparkles' },
      { label: 'تیزر و هلی‌شات', value: 'video', cover_image: null, icon: 'video' },
      { label: 'برندینگ و لوگو', value: 'branding', cover_image: null, icon: 'palette' },
      { label: 'تبلیغات محیطی و بیلبورد', value: 'billboard', cover_image: null, icon: 'megaphone' },
    ];
  }, [initialCategories]);

  const featuredProjects = useMemo(() => allProjects.filter((p) => p.featured), [allProjects]);

  // Robust multi-category filtering: matches primary OR any additional category
  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return allProjects;

    const targetCat = categoryList.find((c) => c.value === selectedCategory);
    const targetLabel = targetCat?.label;

    return allProjects.filter((p) => {
      // 1. Direct slug match on primary category
      if (p.category_slug === selectedCategory) return true;

      // 2. Direct slug match on any additional category
      if (p.additional_category_slugs?.includes(selectedCategory)) return true;

      // 3. Name match on primary or additional categories
      if (targetLabel) {
        if (p.category === targetLabel) return true;
        if (p.additional_categories?.includes(targetLabel)) return true;
      }

      // 4. Aliases and legacy slug fallbacks
      if (
        selectedCategory.includes('web') ||
        selectedCategory.includes('ecommerce') ||
        selectedCategory === 'web-design'
      ) {
        if (p.category_slug === 'web' || p.category_slug === 'web-design') return true;
        if (p.additional_category_slugs?.some((s) => s === 'web' || s === 'web-design')) return true;
      }
      if (
        selectedCategory.includes('branding') ||
        selectedCategory.includes('logo') ||
        selectedCategory === 'logo-branding'
      ) {
        if (p.category_slug === 'branding' || p.category_slug === 'logo-branding') return true;
        if (p.additional_category_slugs?.some((s) => s === 'branding' || s === 'logo-branding')) return true;
      }
      if (
        selectedCategory.includes('social') ||
        selectedCategory.includes('content') ||
        selectedCategory.includes('instagram') ||
        selectedCategory === 'social-media-content'
      ) {
        if (p.category_slug === 'instagram' || p.category_slug === 'social-media-content') return true;
        if (
          p.additional_category_slugs?.some(
            (s) => s === 'instagram' || s === 'social-media-content'
          )
        )
          return true;
      }
      if (
        selectedCategory.includes('video') ||
        selectedCategory.includes('teaser') ||
        selectedCategory === 'video-production'
      ) {
        if (p.category_slug === 'video' || p.category_slug === 'video-production') return true;
        if (
          p.additional_category_slugs?.some(
            (s) => s === 'video' || s === 'video-production'
          )
        )
          return true;
      }

      return false;
    });
  }, [allProjects, selectedCategory, categoryList]);

  // Categories that have cover images for showcase banner
  const categoriesWithCovers = useMemo(() => {
    return (initialCategories || []).filter((c) => c.cover_image && c.cover_image.trim() !== '');
  }, [initialCategories]);

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

      {/* ── OPTIONAL: CATEGORIES COVER SHOWCASE ── */}
      {categoriesWithCovers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>دسته‌بندی‌های نمونه‌کارها</span>
            </h2>
            <span className="text-[11px] text-gray-500 font-mono">
              انتخاب سریع بر اساس زمینه فعالیت
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categoriesWithCovers.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const projectCount = allProjects.filter(
                (p) =>
                  p.category_slug === cat.slug ||
                  p.additional_category_slugs?.includes(cat.slug) ||
                  p.category === cat.name ||
                  p.additional_categories?.includes(cat.name)
              ).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.slug)}
                  className={`group relative overflow-hidden rounded-2xl border transition-all text-right p-3 sm:p-4 cursor-pointer flex flex-col justify-end min-h-[110px] sm:min-h-[130px] ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/50 shadow-lg shadow-brand-500/20'
                      : 'border-white/10 hover:border-white/25 bg-dark-surface'
                  }`}
                >
                  {/* Category Cover Image Background */}
                  {cat.cover_image && (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={cat.cover_image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/70 to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 space-y-1">
                    <span className="block text-xs sm:text-sm font-black text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>{projectCount} پرونده</span>
                      {isSelected && (
                        <span className="text-brand-300 font-bold">انتخاب شده ✓</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

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
                  className="rounded-3xl glass-panel-dock overflow-hidden flex flex-col h-full border border-white/10 hover:border-brand-500/40 transition-all duration-300 group shadow-2xl"
                >
                  {/* Spotlight Image Wrapper */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-dark-base shrink-0">
                    <img
                      src={project.thumbnail_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/30 to-transparent" />

                    {/* Category Tags in top corner */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-wrap gap-1 max-w-[85%] justify-end">
                      <span className="bg-dark-base/85 px-3 py-1 rounded-full text-xs font-bold text-brand-300 border border-white/10 backdrop-blur-md">
                        {project.category}
                      </span>
                      {project.additional_categories?.map((addCat, idx) => (
                        <span
                          key={`spotlight-add-${idx}`}
                          className="bg-brand-950/85 px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-300 border border-indigo-500/30 backdrop-blur-md"
                        >
                          {addCat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Spotlight Content Area */}
                  <div className="p-5 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                        <span>{project.industry}</span>
                        <span>{project.project_date}</span>
                      </div>

                      <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-brand-300 transition-colors min-h-[3.25rem] line-clamp-2">
                        {project.title}
                      </h3>

                      <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                        {project.subtitle || project.description}
                      </p>

                      {/* Spotlight KPIs */}
                      {project.kpis && project.kpis.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {project.kpis.slice(0, 2).map((kpi, kIdx) => (
                            <div
                              key={kIdx}
                              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                            >
                              <div className="text-xs sm:text-sm font-black text-white font-mono dir-ltr text-right">
                                {kpi.value}
                              </div>
                              <div className="text-[10px] text-gray-400 truncate">
                                {kpi.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto min-h-[44px]">
                      <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                        {project.technologies && project.technologies.length > 0 ? (
                          project.technologies.slice(0, 3).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-md text-gray-300 border border-white/5"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-md text-gray-400 border border-white/5">
                            {project.category}
                          </span>
                        )}
                      </div>

                      <Link
                        href={'/portfolio/' + project.slug + '/'}
                        className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 group-hover:-translate-x-1.5 transition-transform shrink-0"
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
              <Filter className="w-4 h-4 text-brand-400" />
              <span>فیلتر و کاوش تخصصی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">آرشیو کامل پروژه‌ها</h2>
          </div>

          {/* Category Filter Chips with layoutId animated background */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl glass-panel border border-white/5">
            {categoryList.map((c) => {
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch"
            >
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={transitionSmooth}
                  className="h-full"
                >
                  <TiltCard maxTilt={5} glare className="h-full">
                    <div
                      data-cursor="view"
                      className="rounded-2xl sm:rounded-3xl glass-panel-dock overflow-hidden flex flex-col h-full border border-white/5 hover:border-brand-500/30 transition-all duration-300 group shadow-lg"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-base shrink-0">
                        <img
                          src={project.thumbnail_image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-transparent to-transparent opacity-80" />

                        {/* Category Badges */}
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-wrap gap-1 max-w-[85%] justify-end">
                          <span className="bg-dark-base/85 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-brand-300 border border-white/10 backdrop-blur-md">
                            {project.category}
                          </span>
                          {project.additional_categories?.map((addCat, i) => (
                            <span
                              key={`arch-add-${i}`}
                              className="bg-brand-950/85 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-indigo-300 border border-indigo-500/20 backdrop-blur-md"
                            >
                              {addCat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
                        <div>
                          <span className="text-[11px] font-mono text-gray-400">{project.industry}</span>
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors mt-0.5 line-clamp-1">
                            {project.title}
                          </h3>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5 min-h-[36px]">
                          <span className="text-[11px] sm:text-xs text-gray-400 font-mono truncate max-w-[140px] sm:max-w-none">
                            {project.kpis && project.kpis[0]
                              ? project.kpis[0].value + ' ' + project.kpis[0].label
                              : project.technologies?.[0] || project.category || 'اروم‌سیما'}
                          </span>
                          <Link
                            href={'/portfolio/' + project.slug + '/'}
                            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group-hover:-translate-x-1.5 transition-transform shrink-0"
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

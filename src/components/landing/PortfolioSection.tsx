'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { Project } from '@/types/content';

interface PortfolioSectionProps {
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDesc: string;
  projects: Project[];
}

export default function PortfolioSection({
  sectionTitle,
  sectionSubtitle,
  sectionDesc,
  projects,
}: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!projects || projects.length === 0) return null;

  // Extract unique categories
  const categoriesMap = new Map<string, string>();
  projects.forEach((p) => {
    if (p.category_slug && p.category) {
      categoriesMap.set(p.category_slug, p.category);
    }
  });

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category_slug === activeFilter || p.additional_category_slugs?.includes(activeFilter));

  return (
    <section className="portfolio" id="portfolio">
      <div className="sec-hd rv text-center max-w-2xl mx-auto mb-12">
        <h2 className="sec-lbl text-brand-400 text-xs font-bold tracking-wider uppercase mb-2">
          {sectionTitle || 'نمونه کارهای ما'}
        </h2>
        <h3 className="sec-title text-3xl md:text-4xl font-black text-white mb-4">
          {sectionSubtitle || 'پروژه‌های موفق ما'}
        </h3>
        <p className="sec-desc text-sm md:text-base text-gray-400 font-light">
          {sectionDesc || 'نگاهی به برخی از پروژه‌های برجسته‌ای که با موفقیت اجرا کرده‌ایم'}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="pf-filter rv flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`pf-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'act bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 border-transparent'
              : 'border border-emerald-500/20 text-gray-300 hover:text-white hover:border-emerald-400/40 bg-[#081210]'
          }`}
        >
          همه
        </button>

        {Array.from(categoriesMap.entries()).map(([slug, name]) => (
          <button
            key={slug}
            type="button"
            onClick={() => setActiveFilter(slug)}
            className={`pf-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === slug
                ? 'act bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 border-transparent'
                : 'border border-emerald-500/20 text-gray-300 hover:text-white hover:border-emerald-400/40 bg-[#081210]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="pf-grid max-w-7xl mx-auto px-4 sm:px-6">
        {filtered.map((project) => (
          <div key={project.id} className="pf-card rv group">
            <div className="pf-img relative overflow-hidden h-[240px]">
              <img
                src={project.thumbnail_image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pf-ov">
                <Link
                  href={`/portfolio/${project.slug}/`}
                  className="pf-ov-ico"
                  aria-label={`مشاهده جزئیات پروژه ${project.title}`}
                >
                  <Search className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="pf-body p-5">
              <div className="pf-cat text-xs font-bold text-emerald-400 mb-1.5">
                {project.category}
              </div>
              <h4 className="pf-name text-base font-bold text-white mb-2 line-clamp-1">
                <Link href={`/portfolio/${project.slug}/`} className="hover:text-emerald-300 transition-colors">
                  {project.title}
                </Link>
              </h4>
              <p className="pf-desc text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="pf-meta flex items-center justify-between pt-3 border-t border-emerald-500/10 text-xs">
                <div className="pf-result text-emerald-400 font-semibold line-clamp-1">
                  {project.subtitle || 'پروژه شاخص'}
                </div>
                <div className="pf-client text-gray-400 line-clamp-1">
                  {project.industry}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  HelpCircle,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';
import type { Service } from '@/types/content';

interface ServiceDetailViewProps {
  service: Service;
}

export default function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{service.breadcrumb_label}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
              {service.short_description}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact-us/"
                className="px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 flex items-center gap-3 transition-all hover:scale-105"
              >
                <span>درخواست مشاوره و برآورد قیمت</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <a
                href="tel:09141406450"
                className="px-6 py-4 rounded-2xl glass-panel hover:bg-white/10 text-white font-bold text-sm border border-white/10 flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-brand-400" />
                <span>تماس فوری کارشناس</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION & WHY US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              رویکرد استراتژیک اروم‌سیما
            </h2>
            <div className="text-sm sm:text-base text-gray-300 leading-relaxed space-y-4">
              <p>{service.description}</p>
            </div>

            {/* Why Us Box */}
            <div className="glass-panel-elevated rounded-3xl p-8 border border-brand-500/20 space-y-5 mt-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
                <span>{service.why_us_title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {service.why_us_intro}
              </p>
              <div className="space-y-3 pt-2">
                {service.why_us_bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white">
                {service.features_section_title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {service.features_intro}
              </p>
              <div className="space-y-4 pt-2">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-lg">{feat.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-200">{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES & PRICING */}
      {service.packages && service.packages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest">
              پلن‌ها و تعرفه‌ها
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              پکیج‌های شفاف و مشخص خدمات
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.packages.map((pkg, idx) => (
              <div
                key={idx}
                className={
                  pkg.is_popular
                    ? 'rounded-3xl p-8 transition-all flex flex-col justify-between glass-panel-brand border-2 border-brand-500/50 shadow-2xl shadow-brand-600/20 scale-105'
                    : 'rounded-3xl p-8 transition-all flex flex-col justify-between glass-panel border border-white/10'
                }
              >
                <div className="space-y-6">
                  {pkg.is_popular && (
                    <span className="bg-brand-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                      پیشنهاد طلایی
                    </span>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-brand-300">{pkg.price}</span>
                      <span className="text-xs text-gray-400">{pkg.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {pkg.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-white/10">
                  <Link
                    href="/contact-us/"
                    className={
                      pkg.is_popular
                        ? 'w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30'
                        : 'w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-white/10 hover:bg-white/20 text-white'
                    }
                  >
                    <span>انتخاب و استعلام آنلاین</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQS SECTION */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>پاسخ به ابهامات متداول</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {service.faq_section_title}
            </h2>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-white hover:text-brand-300"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={
                      'w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ' +
                      (openFaq === idx ? 'rotate-180 text-brand-400' : '')
                    }
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

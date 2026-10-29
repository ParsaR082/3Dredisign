'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import type { Service } from '@/types/content';
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  MotionBadge,
  MotionAccordion,
  transitionSpring,
  transitionSmooth,
} from '@/components/ui/motion';

interface ServiceDetailViewProps {
  service: Service;
}

export default function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-12 sm:space-y-20 md:space-y-32 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 pb-10 sm:pb-16">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionDiv variant="fade-up" className="max-w-3xl space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href={`/?returnFrom=${service.slug}`}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    try {
                      sessionStorage.setItem('last_dive_target', service.slug);
                    } catch (_) {}
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 rounded-full bg-white/5 hover:bg-brand-600/25 border border-white/10 hover:border-brand-500/40 text-gray-300 hover:text-white text-xs font-semibold transition-all group shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-brand-400 group-hover:-translate-x-1 transition-transform" />
                <span>بازگشت به محوطه ۳بعدی</span>
              </Link>

              <MotionBadge className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold cursor-default">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{service.breadcrumb_label}</span>
              </MotionBadge>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {service.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              {service.short_description}
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/contact-us/"
                  className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2.5 transition-colors text-center"
                >
                  <span>درخواست مشاوره و برآورد قیمت</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="tel:09141406450"
                className="w-full sm:w-auto px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl glass-panel hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/10 flex items-center justify-center gap-2 transition-colors text-center"
              >
                <PhoneCall className="w-4 h-4 text-brand-400" />
                <span>تماس فوری کارشناس</span>
              </motion.a>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* DESCRIPTION & WHY US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <MotionDiv variant="fade-up" className="lg:col-span-7 space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              رویکرد استراتژیک اروم‌سیما
            </h2>
            <div className="text-xs sm:text-base text-gray-300 leading-relaxed space-y-3 sm:space-y-4">
              <p>{service.description}</p>
            </div>

            {/* Why Us Box */}
            <InteractiveCard className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-brand-500/25 space-y-4 sm:space-y-5 mt-6 sm:mt-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 relative z-10">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
                <span>{service.why_us_title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed relative z-10">
                {service.why_us_intro}
              </p>
              <StaggerContainer className="space-y-2.5 sm:space-y-3 pt-2 relative z-10">
                {service.why_us_bullets.map((bullet, idx) => (
                  <StaggerItem key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </InteractiveCard>
          </MotionDiv>

          {/* Features Column */}
          <MotionDiv variant="fade-up" delay={0.1} className="lg:col-span-5 space-y-6">
            <InteractiveCard className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 space-y-5 sm:space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white">
                {service.features_section_title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {service.features_intro}
              </p>
              <StaggerContainer className="space-y-4 pt-2">
                {service.features.map((feat, idx) => (
                  <StaggerItem key={idx}>
                    <motion.div
                      whileHover={{ x: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-brand-500/30 transition-colors"
                    >
                      <span className="text-lg">{feat.icon}</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-200">{feat.text}</span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </InteractiveCard>
          </MotionDiv>
        </div>
      </section>

      {/* PACKAGES & PRICING */}
      {service.packages && service.packages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          <MotionDiv variant="fade-up" className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest">
              پلن‌ها و تعرفه‌ها
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              پکیج‌های شفاف و مشخص خدمات
            </h2>
          </MotionDiv>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
            {service.packages.map((pkg, idx) => (
              <StaggerItem key={idx} className="h-full">
                <InteractiveCard
                  hoverY={pkg.is_popular ? -8 : -5}
                  className={
                    pkg.is_popular
                      ? 'rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all flex flex-col justify-between h-full glass-panel-brand border-2 border-brand-500/60 shadow-2xl shadow-brand-600/25 md:-translate-y-2'
                      : 'rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all flex flex-col justify-between h-full glass-panel border border-white/10 hover:border-white/20'
                  }
                >
                  <div className="space-y-5 sm:space-y-6">
                    {pkg.is_popular && (
                      <motion.span
                        animate={{ scale: [0.95, 1.02, 0.95] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="bg-brand-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block shadow-md shadow-brand-500/30"
                      >
                        پیشنهاد طلایی
                      </motion.span>
                    )}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{pkg.name}</h3>
                      <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-brand-300">{pkg.price}</span>
                        <span className="text-xs text-gray-400">{pkg.period}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 sm:space-y-3 pt-4 border-t border-white/10">
                      {pkg.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 sm:pt-8 mt-6 border-t border-white/10">
                    <Link
                      href="/contact-us/"
                      className={
                        pkg.is_popular
                          ? 'w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-95'
                          : 'w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-white/10 hover:bg-white/20 text-white hover:scale-[1.02] active:scale-95'
                      }
                    >
                      <span>انتخاب و استعلام آنلاین</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* FAQS SECTION WITH SMOOTH ACCORDION MOTION */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <MotionDiv variant="fade-up" className="text-center space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>پاسخ به ابهامات متداول</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              {service.faq_section_title}
            </h2>
          </MotionDiv>

          <StaggerContainer className="space-y-3 sm:space-y-4">
            {service.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <StaggerItem key={idx}>
                  <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-colors hover:border-brand-500/30">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-3 text-xs sm:text-base font-bold text-white hover:text-brand-300 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 text-gray-400"
                      >
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.div>
                    </button>
                    <MotionAccordion isOpen={isOpen}>
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.answer}
                      </div>
                    </MotionAccordion>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      )}
    </div>
  );
}

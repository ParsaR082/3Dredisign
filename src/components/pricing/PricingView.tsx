'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { getPricingData } from '@/lib/data-loaders';
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
import { MagneticButton } from '@/components/ui/MagneticButton';

export default function PricingView() {
  const { settings, plans } = getPricingData();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-20">
      {/* Header */}
      <MotionDiv variant="fade-up" className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <MotionBadge className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold cursor-default">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          <span>{settings.hero_badge}</span>
        </MotionBadge>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {settings.hero_title}
        </h1>
        <p className="text-gray-400 text-xs sm:text-base leading-relaxed">
          {settings.hero_description}
        </p>

        {/* Billing Toggle with layoutId animated pill */}
        <div className="pt-4 sm:pt-6 flex items-center justify-center">
          <div className="glass-panel p-1 sm:p-1.5 rounded-2xl flex items-center border border-white/10 relative max-w-full">
            <button
              onClick={() => setBilling('monthly')}
              className={`relative z-10 px-3 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                billing === 'monthly' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {billing === 'monthly' && (
                <motion.div
                  layoutId="billing-active-pill"
                  transition={transitionSpring}
                  className="absolute inset-0 bg-brand-600 rounded-xl shadow-lg shadow-brand-600/30 -z-10"
                />
              )}
              ماهانه / مرحله‌ای
            </button>

            <button
              onClick={() => setBilling('yearly')}
              className={`relative z-10 px-3 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                billing === 'yearly' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {billing === 'yearly' && (
                <motion.div
                  layoutId="billing-active-pill"
                  transition={transitionSpring}
                  className="absolute inset-0 bg-brand-600 rounded-xl shadow-lg shadow-brand-600/30 -z-10"
                />
              )}
              <span>سالانه</span>
              <span className="bg-amber-400 text-dark-base text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md">
                ۲۰٪ تخفیف
              </span>
            </button>
          </div>
        </div>
      </MotionDiv>

      {/* Plans Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {plans.map((plan) => {
          const price = billing === 'yearly' ? plan.yearly_price : plan.monthly_price;
          const formattedPrice = (price / 1000000).toLocaleString('fa-IR');

          return (
            <StaggerItem key={plan.id} className="h-full">
              <TiltCard maxTilt={8} glare className="h-full">
                <div
                  className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all flex flex-col justify-between h-full relative overflow-hidden backdrop-blur-xl ${
                    plan.is_popular
                      ? 'glass-panel-brand border-2 border-brand-500/60 shadow-2xl shadow-brand-600/25 md:-translate-y-2'
                      : 'glass-panel border border-white/10 hover:border-white/25'
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-brand-400 via-teal-300 to-amber-300" />
                  )}

                  <div className="space-y-5 sm:space-y-6">
                    {plan.is_popular && (
                      <motion.span
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [0.95, 1.02, 0.95] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="bg-brand-500 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block shadow-md shadow-brand-500/30"
                      >
                        محبوب‌ترین انتخاب مدیران
                      </motion.span>
                    )}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{plan.description}</p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={formattedPrice}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="text-2xl sm:text-4xl font-black text-brand-300"
                          >
                            {formattedPrice}
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-xs text-gray-400">
                          میلیون تومان {billing === 'yearly' ? '/ سالانه' : '/ ماهانه'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 sm:space-y-3 pt-5 sm:pt-6 border-t border-white/10">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/10">
                    <MagneticButton distance={0.25}>
                      <Link
                        href="/contact-us/"
                        className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all group block ${
                          plan.is_popular
                            ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-95'
                            : 'bg-white/10 hover:bg-white/20 text-white hover:scale-[1.02] active:scale-95'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>انتخاب این پلن و عقد قرارداد</span>
                          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </MagneticButton>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Stats Bar */}
      <MotionDiv
        variant="scale-up"
        className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 text-center shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
          <div className="pt-4 md:pt-0 space-y-1">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-brand-400"
            >
              {settings.stat_1_value}
            </motion.div>
            <div className="text-xs text-gray-300">{settings.stat_1_label}</div>
          </div>
          <div className="pt-4 md:pt-0 space-y-1">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-teal-400"
            >
              {settings.stat_2_value}
            </motion.div>
            <div className="text-xs text-gray-300">{settings.stat_2_label}</div>
          </div>
          <div className="pt-4 md:pt-0 space-y-1">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-amber-400"
            >
              {settings.stat_3_value}
            </motion.div>
            <div className="text-xs text-gray-300">{settings.stat_3_label}</div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}

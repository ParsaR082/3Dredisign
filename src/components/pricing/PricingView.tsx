'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { getPricingData } from '@/lib/data-loaders';

export default function PricingView() {
  const { settings, plans } = getPricingData();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{settings.hero_badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
          {settings.hero_title}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          {settings.hero_description}
        </p>

        {/* Billing Toggle */}
        <div className="pt-6 flex items-center justify-center gap-4">
          <div className="glass-panel p-1.5 rounded-2xl flex items-center border border-white/10">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                billing === 'monthly'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              پرداخت ماهانه / مرحله‌ای
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>پرداخت سالانه</span>
              <span className="bg-amber-400 text-dark-base text-[10px] font-black px-1.5 py-0.5 rounded-md">
                ۲۰٪ تخفیف
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const price = billing === 'yearly' ? plan.yearly_price : plan.monthly_price;
          const formattedPrice = (price / 1000000).toLocaleString('fa-IR');

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 transition-all flex flex-col justify-between ${
                plan.is_popular
                  ? 'glass-panel-brand border-2 border-brand-500/50 shadow-2xl shadow-brand-600/20 scale-105'
                  : 'glass-panel border border-white/10'
              }`}
            >
              <div className="space-y-6">
                {plan.is_popular && (
                  <span className="bg-brand-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    محبوب‌ترین انتخاب مدیران
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-brand-300">{formattedPrice}</span>
                    <span className="text-xs text-gray-400">میلیون تومان {billing === 'yearly' ? '/ سالانه' : '/ ماهانه'}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-white/10">
                <Link
                  href="/contact-us/"
                  className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    plan.is_popular
                      ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 hover:scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span>انتخاب این پلن و عقد قرارداد</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="glass-panel-elevated rounded-3xl p-8 border border-white/10 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
          <div className="pt-4 md:pt-0 space-y-1">
            <div className="text-3xl font-black text-brand-400">{settings.stat_1_value}</div>
            <div className="text-xs text-gray-300">{settings.stat_1_label}</div>
          </div>
          <div className="pt-4 md:pt-0 space-y-1">
            <div className="text-3xl font-black text-teal-400">{settings.stat_2_value}</div>
            <div className="text-xs text-gray-300">{settings.stat_2_label}</div>
          </div>
          <div className="pt-4 md:pt-0 space-y-1">
            <div className="text-3xl font-black text-amber-400">{settings.stat_3_value}</div>
            <div className="text-xs text-gray-300">{settings.stat_3_label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

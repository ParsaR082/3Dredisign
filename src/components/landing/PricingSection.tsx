import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { PricingPlan } from '@/types/content';

interface PricingSectionProps {
  title: string;
  subtitle: string;
  desc: string;
  plans: PricingPlan[];
}

export default function PricingSection({ title, subtitle, desc, plans }: PricingSectionProps) {
  if (!plans || plans.length === 0) return null;

  const toPersian = (num: number | string) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'استعلام قیمت';
    return toPersian(price.toLocaleString('fa-IR'));
  };

  return (
    <section className="pricing py-20 px-4 sm:px-6 bg-[#050C0A]" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="sec-hd rv text-center max-w-2xl 2xl:max-w-4xl mx-auto mb-16">
          <span className="sec-lbl inline-block text-emerald-400 text-xs 2xl:text-sm font-bold tracking-wider uppercase mb-2">
            {title || 'آماده رشد هستید؟'}
          </span>
          <h2 className="sec-title text-3xl md:text-4xl 2xl:text-5xl font-black text-white mb-4">
            {subtitle || 'تعرفه‌های شفاف و منصفانه'}
          </h2>
          <p className="sec-desc text-sm md:text-base 2xl:text-lg text-gray-400 font-light">
            {desc || 'پکیج‌های متنوع برای هر نوع کسب‌وکاری، از استارتاپ تا شرکت‌های بزرگ'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pr-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 2xl:gap-10 items-stretch max-w-6xl 2xl:max-w-[1400px] 3xl:max-w-[1550px] mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pr-card relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ${
                plan.is_popular
                  ? 'pop bg-[#0C1B17] border-2 border-emerald-400 shadow-2xl shadow-emerald-950/60 lg:-translate-y-2'
                  : 'bg-[#091512] border border-emerald-500/20 hover:border-emerald-400/50 hover:-translate-y-1'
              }`}
            >
              {plan.is_popular && (
                <div className="pr-pop-badge absolute top-4 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[11px] font-bold shadow-md shadow-emerald-500/30">
                  محبوب‌ترین
                </div>
              )}

              <div>
                <h3 className="pr-name text-xs font-bold text-emerald-400 tracking-wider uppercase mb-3">
                  {plan.name}
                </h3>

                {/* Highlighted & Bold Billing Period Tag */}
                <div className="mb-4">
                  <span className="pr-period-tag inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/30 via-teal-500/35 to-emerald-600/30 border-2 border-emerald-400 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-950/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-emerald-200 font-bold text-xs">دوره پرداخت:</span>
                    <span className="text-white font-black text-xs sm:text-sm tracking-wide">
                      {plan.billing_period || 'ماهانه'}
                    </span>
                  </span>
                </div>

                {/* Price Display */}
                <div className="pr-price flex items-baseline gap-2 mb-4">
                  {plan.monthly_price > 0 ? (
                    <>
                      <span className="pr-val text-3xl sm:text-4xl font-black text-white">
                        {formatPrice(plan.monthly_price)}
                      </span>
                      <div className="pr-unit text-xs text-gray-400">
                        <div className="pr-curr text-emerald-400 font-bold">تومان</div>
                        <div className="pr-per font-bold text-emerald-200">/ {plan.billing_period || 'ماهانه'}</div>
                      </div>
                    </>
                  ) : (
                    <span className="pr-val text-2xl font-black text-emerald-300">
                      {plan.custom_price_text || 'تماس و استعلام اختصاصی'}
                    </span>
                  )}
                </div>

                <p className="pr-desc text-xs text-gray-300 leading-relaxed mb-6 font-light">
                  {plan.description}
                </p>

                <div className="pr-divider h-px bg-emerald-500/15 mb-6" />

                {/* Features List */}
                <ul className="pr-features space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Package Select CTA */}
              <Link
                href="/contact-us/"
                className={`pr-cta w-full py-3.5 rounded-full text-xs font-bold text-center transition-all duration-300 ${
                  plan.is_popular
                    ? 'solid bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 hover:scale-105'
                    : 'outline border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400'
                }`}
              >
                انتخاب پکیج و شروع همکاری
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

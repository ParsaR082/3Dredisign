'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface RoiConfig {
  is_active: boolean;
  title: string;
  subtitle: string;
  disclaimer: string;
  web_seo_min: number;
  web_seo_max: number;
  content_min: number;
  content_max: number;
  ads_min: number;
  ads_max: number;
  sales_min: number;
  sales_max: number;
}

interface RoiCalculatorWidgetProps {
  config: RoiConfig;
}

const businessTypes = [
  { id: 'ecommerce', label: 'فروشگاه اینترنتی و خرده‌فروشی' },
  { id: 'corporate', label: 'شرکتی، هلدینگ و خدمات سازمانی' },
  { id: 'industrial', label: 'صنعتی، کارخانجات و تولیدی' },
  { id: 'medical', label: 'پزشکی، کلینیک و زیبایی' },
  { id: 'restaurant', label: 'کافه، رستوران و گردشگری' },
];

export default function RoiCalculatorWidget({ config }: RoiCalculatorWidgetProps) {
  const [businessType, setBusinessType] = useState('ecommerce');
  const [sliderPct, setSliderPct] = useState(25);
  const [hasSite, setHasSite] = useState(false);
  const [hasInsta, setHasInsta] = useState(false);
  const [calculated, setCalculated] = useState(false);

  if (!config.is_active) return null;

  // Convert numbers to Persian
  const toPersian = (num: number | string) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const getSalesValue = () => {
    const min = config.sales_min || 50000000;
    const max = config.sales_max || 5000000000;
    return Math.round(min + (sliderPct / 100) * (max - min));
  };

  const formatToman = (val: number) => {
    if (val >= 1e9) {
      return `${toPersian(Math.round(val / 1e8) / 10)} میلیارد تومان`;
    }
    if (val >= 1e6) {
      return `${toPersian(Math.round(val / 1e5) / 10)} میلیون تومان`;
    }
    return `${toPersian(val)} تومان`;
  };

  const handleCalculate = () => {
    setCalculated(true);
  };

  // Result cards calculation
  const results = [
    {
      title: !hasSite ? 'طراحی سایت مدرن + سئو تکنیکال' : 'بهینه‌سازی سئو و رتبه یک گوگل',
      min: !hasSite ? config.web_seo_min : Math.max(config.web_seo_min - 5, 8),
      max: !hasSite ? config.web_seo_max : Math.max(config.web_seo_max - 8, 18),
      note: !hasSite ? 'افزایش چشمگیر ترافیک ارگانیک در ۶ ماه' : 'بهبود رتبه کلمات کلیدی و تبدیل سایت فعلی',
    },
    {
      title: !hasInsta ? 'تولید محتوا + رشد اینستاگرام' : 'مدیریت کمپین و تقویت محتوا',
      min: !hasInsta ? config.content_min : Math.max(config.content_min - 5, 12),
      max: !hasInsta ? config.content_max : Math.max(config.content_max - 10, 25),
      note: !hasInsta ? 'افزایش تعامل و جذب فالوور خریدار' : 'رشد نرخ تبدیل مخاطب به مشتری واقعی',
    },
    {
      title: 'تبلیغات دیجیتال و ریتارگتینگ',
      min: config.ads_min,
      max: config.ads_max,
      note: 'بازگشت سرمایه (ROI) مستقیم از کمپین‌های هدفمند',
    },
  ];

  return (
    <section className="roi-section rv py-20 px-4 sm:px-6 bg-[#08120F] border-y border-emerald-500/15" id="roi-calculator">
      <div className="roi-inner max-w-5xl mx-auto">
        {/* Head */}
        <div className="roi-head text-center max-w-2xl mx-auto mb-12">
          <span className="roi-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>محاسبه رایگان پتانسیل رشد</span>
          </span>
          <h2 className="roi-title text-3xl md:text-4xl font-black text-white mb-3">
            {config.title || 'رشد کسب‌وکار شما با دیجیتال مارکتینگ'}
          </h2>
          <p className="roi-subtitle text-sm md:text-base text-gray-400 font-light">
            {config.subtitle || 'در چند مرحله ساده، برآورد تقریبی رشد فروش و ترافیک را ببینید'}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="roi-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Form Panel */}
          <div className="roi-form-panel lg:col-span-6 bg-[#0B1A15] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Step 1: Business Type */}
            <div className="roi-step">
              <label htmlFor="roi-business-type-select" className="roi-label block text-xs font-bold text-gray-300 mb-2">
                ۱. نوع کسب‌وکار و صنعت
              </label>
              <select
                id="roi-business-type-select"
                aria-label="نوع کسب‌وکار و صنعت"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-[#08120F] border border-emerald-500/30 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                {businessTypes.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#0B1A15]">
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Monthly Sales Slider */}
            <div className="roi-step">
              <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-2">
                <label htmlFor="roi-sales-slider-input" className="cursor-pointer">
                  ۲. فروش ماهانه تقریبی
                </label>
                <span className="text-emerald-400 text-sm font-black">
                  {formatToman(getSalesValue())}
                </span>
              </div>
              <input
                id="roi-sales-slider-input"
                aria-label="اسلایدر فروش ماهانه تقریبی"
                type="range"
                min="0"
                max="100"
                value={sliderPct}
                onChange={(e) => setSliderPct(Number(e.target.value))}
                className="w-full h-2 bg-[#08120F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Step 3: Current State Toggles */}
            <div className="roi-step space-y-2">
              <span className="roi-label block text-xs font-bold text-gray-300">
                ۳. وضعیت فعلی برند
              </span>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#08120F] border border-emerald-500/20 cursor-pointer text-xs text-gray-300 hover:border-emerald-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasSite}
                    onChange={(e) => setHasSite(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                  />
                  <span>سایت فعال دارم</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#08120F] border border-emerald-500/20 cursor-pointer text-xs text-gray-300 hover:border-emerald-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasInsta}
                    onChange={(e) => setHasInsta(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                  />
                  <span>اینستاگرام فعال دارم</span>
                </label>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={handleCalculate}
              className="roi-calc-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>محاسبه رشد و پیش‌بینی بازدهی</span>
            </button>
          </div>

          {/* Results Panel */}
          <div className="roi-results-panel lg:col-span-6 bg-[#0B1A15] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 min-h-[360px] flex flex-col justify-between shadow-xl">
            {calculated ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-4">
                  <Check className="w-4 h-4" />
                  <span>برآورد اولیه پتانسیل افزایش درآمد:</span>
                </div>

                {results.map((r, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#08120F] border border-emerald-500/20 hover:border-emerald-400/40 transition-colors"
                  >
                    <div className="text-xs font-semibold text-gray-400 mb-1">{r.title}</div>
                    <div className="text-2xl font-black text-emerald-300">
                      +{toPersian(r.min)}٪ الی +{toPersian(r.max)}٪
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">{r.note}</div>
                  </div>
                ))}

                <Link
                  href="/contact/?prefill=roi#contactForm"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-4"
                >
                  <span>دریافت برنامه عملیاتی و مشاوره رایگان</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <Calculator className="w-12 h-12 text-emerald-500/30 mb-4 animate-bounce" />
                <p className="text-sm font-light">
                  اطلاعات کسب‌وکار خود را در فرم روبرو وارد کنید و دکمه «محاسبه رشد» را بزنید تا پیش‌بینی بازدهی نمایش داده شود.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="roi-disclaimer text-center text-xs text-gray-400 max-w-2xl mx-auto">
          {config.disclaimer || 'برآورد تقریبی بر اساس میانگین پروژه‌های مشابه — برای تحلیل دقیق‌تر مشاوره رایگان بگیرید.'}
        </p>
      </div>
    </section>
  );
}

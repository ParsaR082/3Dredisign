'use client';

import React, { useState } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  stars: number;
  is_video: boolean;
  video_url?: string;
  video_thumbnail?: string;
  avatar_text?: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

const fallbackReviews: TestimonialItem[] = [
  {
    id: 101,
    name: 'مهندس حسینی',
    role: 'مدیرعامل',
    company: 'کارخانجات سپید بام گستر',
    text: 'همکاری با اروم‌سیما نقطه عطفی در فروش و برندینگ کارخانه بود. وبسایت شرکتی با رتبه یک گوگل در کلمات عایق و ایزوگام، تماس‌های فروش ما را تا ۳ برابر افزایش داد.',
    stars: 5,
    is_video: false,
    avatar_text: 'س',
  },
  {
    id: 102,
    name: 'دکتر علیزاده',
    role: 'بنیان‌گذار',
    company: 'مجموعه تخصصی آلتین پاشا',
    text: 'طراحی فوق‌العاده شیک و حرفه‌ای، پشتیبانی بی‌وقفه و استراتژی سئو هدفمند. اروم‌سیما بهترین تیم دیجیتال مارکتینگ ارومیه است.',
    stars: 5,
    is_video: false,
    avatar_text: 'آ',
  },
  {
    id: 103,
    name: 'مهندس رضایی',
    role: 'مدیر مارکتینگ',
    company: 'کافه رستری نئو',
    text: 'تولید محتوا و فیلمبرداری سینمایی صنعتی اروم‌سیما هویت برند ما را کاملاً متمایز کرد. بازخورد فوق‌العاده‌ای در اینستاگرام و جذب مشتریان وفادار گرفتیم.',
    stars: 5,
    is_video: false,
    avatar_text: 'ن',
  },
];

export default function TestimonialsSection({
  title,
  subtitle,
  testimonials = [],
}: TestimonialsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'text'>('all');

  const displayList = testimonials.length > 0 ? testimonials : fallbackReviews;

  const filtered = displayList.filter((item) => {
    if (activeTab === 'video') return item.is_video;
    if (activeTab === 'text') return !item.is_video;
    return true;
  });

  return (
    <section className="testi py-20 px-4 sm:px-6 bg-[#050C0A]" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <div className="sec-hd rv text-center max-w-2xl mx-auto mb-12">
          <span className="sec-lbl inline-block text-emerald-400 text-xs font-bold tracking-wider uppercase mb-2">
            {title || 'نظرات مشتریان ما'}
          </span>
          <h2 className="sec-title text-3xl md:text-4xl font-black text-white">
            {subtitle || 'آنچه مشتریان درباره ما می‌گویند'}
          </h2>
        </div>

        {/* Tab Filter Pills */}
        <div className="ts-tabs flex justify-center gap-3 mb-12" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30'
                : 'border border-emerald-500/20 text-gray-300 hover:text-white bg-[#091512]'
            }`}
          >
            همه
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30'
                : 'border border-emerald-500/20 text-gray-300 hover:text-white bg-[#091512]'
            }`}
          >
            نظرات متنی
          </button>
        </div>

        {/* Testimonials Catalog Grid */}
        <div className="ts-catalog max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="ts-card p-6 rounded-3xl bg-[#091512] border border-emerald-500/20 hover:border-emerald-400/50 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-y-1.5"
            >
              <div>
                {/* Star rating */}
                <div className="flex gap-1 text-amber-400 mb-4" aria-label={`${item.stars} ستاره`}>
                  {Array.from({ length: item.stars || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <MessageSquareQuote className="w-8 h-8 text-emerald-500/15 absolute -top-3 -right-2" />
                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed italic relative z-10">
                    «{item.text}»
                  </p>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-emerald-500/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-900/40 shrink-0">
                  {item.avatar_text || item.name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <div className="text-xs text-gray-400">
                    {item.role} {item.company ? `· ${item.company}` : ''}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

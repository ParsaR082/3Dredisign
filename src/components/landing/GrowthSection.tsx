import React from 'react';
import { TrendingUp, Users, Zap } from 'lucide-react';

interface GrowthSectionProps {
  badge: string;
  title: string;
  desc: string;
  stats: { id: number; icon: string; value: string; label: string }[];
}

export default function GrowthSection({ badge, title, desc, stats }: GrowthSectionProps) {
  if (!stats || stats.length === 0) return null;

  const getIcon = (idx: number) => {
    if (idx === 0) return <Users className="w-6 h-6" />;
    if (idx === 1) return <TrendingUp className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  return (
    <section className="growth py-20 px-4 sm:px-6 bg-[#050C0A]" id="growth">
      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] mx-auto">
        <div className="sec-hd rv text-center max-w-2xl 2xl:max-w-4xl mx-auto mb-14">
          <span className="sec-lbl inline-block text-emerald-400 text-xs 2xl:text-sm font-bold tracking-wider uppercase mb-2">
            {badge || 'رشد و موفقیت'}
          </span>
          <h2 className="sec-title text-3xl md:text-4xl 2xl:text-5xl font-black text-white mb-4">
            {title || 'مسیر رشد مشتریان اروم سیما'}
          </h2>
          <p className="sec-desc text-sm md:text-base 2xl:text-lg text-gray-400 font-light">
            {desc || 'نمودار واقعی رشد کسب و کار مشتریان پس از دریافت خدمات سئو، طراحی سایت و تبلیغات'}
          </p>
        </div>

        <div className="gr-wrap grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Growth Stat Cards */}
          <div className="rv-l lg:col-span-5 space-y-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.id}
                className="gr-stat flex items-center gap-5 p-5 sm:p-6 rounded-2xl bg-[#091512] border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-x-2"
              >
                <div className="gs-ico w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  {getIcon(idx)}
                </div>
                <div>
                  <span className="gs-val text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent block">
                    {stat.value}
                  </span>
                  <div className="gs-lbl text-xs sm:text-sm text-gray-300 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real SVG Growth Curve Chart */}
          <div className="gr-chart-card rv-r lg:col-span-7 bg-[#091512] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <svg
              className="gr-svg w-full h-auto overflow-visible"
              viewBox="0 0 700 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="grGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0E946E', stopOpacity: 0.35 }} />
                  <stop offset="100%" style={{ stopColor: '#0E946E', stopOpacity: 0.0 }} />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              <line x1="40" y1="20" x2="680" y2="20" stroke="rgba(14,148,110,0.12)" strokeWidth="1" />
              <line x1="40" y1="80" x2="680" y2="80" stroke="rgba(14,148,110,0.12)" strokeWidth="1" />
              <line x1="40" y1="140" x2="680" y2="140" stroke="rgba(14,148,110,0.12)" strokeWidth="1" />
              <line x1="40" y1="200" x2="680" y2="200" stroke="rgba(14,148,110,0.12)" strokeWidth="1" />
              <line x1="40" y1="260" x2="680" y2="260" stroke="rgba(14,148,110,0.12)" strokeWidth="1" />

              {/* Value Labels */}
              <text x="30" y="24" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end">۵۰۰</text>
              <text x="30" y="84" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end">۴۰۰</text>
              <text x="30" y="144" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end">۳۰۰</text>
              <text x="30" y="204" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end">۲۰۰</text>
              <text x="30" y="264" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end">۱۰۰</text>

              {/* Month Labels */}
              <text x="90" y="285" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">فروردین</text>
              <text x="190" y="285" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">اردیبهشت</text>
              <text x="290" y="285" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">خرداد</text>
              <text x="390" y="285" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">تیر</text>
              <text x="490" y="285" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">مرداد</text>
              <text x="590" y="285" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">شهریور</text>
              <text x="680" y="285" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">مهر</text>

              {/* Area Under Curve */}
              <path
                d="M 40,240 L 140,210 L 240,175 L 340,140 L 440,95 L 540,55 L 640,30 L 680,20 L 680,260 L 40,260 Z"
                fill="url(#grGrad)"
              />

              {/* Curve Line */}
              <path
                className="gr-line"
                d="M 40,240 L 140,210 L 240,175 L 340,140 L 440,95 L 540,55 L 640,30 L 680,20"
                stroke="#0E946E"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              <circle cx="40" cy="240" r="4.5" fill="#0E946E" stroke="#060D0B" strokeWidth="2" />
              <circle cx="140" cy="210" r="4.5" fill="#0E946E" stroke="#060D0B" strokeWidth="2" />
              <circle cx="240" cy="175" r="4.5" fill="#0E946E" stroke="#060D0B" strokeWidth="2" />
              <circle cx="340" cy="140" r="4.5" fill="#0E946E" stroke="#060D0B" strokeWidth="2" />
              <circle cx="440" cy="95" r="4.5" fill="#0E946E" stroke="#060D0B" strokeWidth="2" />
              <circle cx="540" cy="55" r="4.5" fill="#0E946E" stroke="#060D0B" strokeWidth="2" />
              <circle cx="640" cy="30" r="4.5" fill="#0E946E" stroke="#060D0B" strokeWidth="2" />
              <circle cx="680" cy="20" r="5" fill="#5ef0c4" stroke="#060D0B" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

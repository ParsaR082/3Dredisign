import React from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowLeft, Gem, Sliders, Sun } from 'lucide-react';
import { getAbnerData } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'نمایندگی رسمی تلویزیون شهری و استند لمسی ابنر در ارومیه | اروم سیما',
  description: 'فروش، نصب و گارانتی رسمی انواع تلویزیون شهری Outdoor و Indoor، استندهای هوشمند لمسی ابنر (ABNER) در آذربایجان غربی.',
  path: '/abner/',
});

export default function AbnerPage() {
  const abner = getAbnerData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>نمایندگی انحصاری نمایشگرهای هوشمند ابنر</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
          {abner.title}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          {abner.subtitle}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {abner.features.map((feat: any, idx: number) => (
          <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{feat.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>

      {/* City TV Specifications Table */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-brand-400 text-xs font-bold uppercase tracking-wider">مشخصات فنی تلویزیون‌های شهری</span>
          <h2 className="text-2xl font-extrabold text-white">مدل‌های پرچم‌دار فضای باز (Outdoor) و سالنی (Indoor)</h2>
        </div>

        <div className="glass-panel rounded-3xl overflow-x-auto border border-white/10">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold">
              <tr>
                <th className="p-4 sm:p-5">مدل نمایشگر</th>
                <th className="p-4 sm:p-5">تراکم پیکسل (Pitch)</th>
                <th className="p-4 sm:p-5">شدت روشنایی</th>
                <th className="p-4 sm:p-5">استاندارد نفوذ</th>
                <th className="p-4 sm:p-5">نرخ تازه‌سازی</th>
                <th className="p-4 sm:p-5">کاربرد پیشنهادی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {abner.city_tv_models.map((model: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">{model.model}</td>
                  <td className="p-4 sm:p-5 font-mono text-brand-300">{model.pixel_pitch}</td>
                  <td className="p-4 sm:p-5">{model.brightness}</td>
                  <td className="p-4 sm:p-5 font-mono">{model.ip_rating}</td>
                  <td className="p-4 sm:p-5 font-mono">{model.refresh_rate}</td>
                  <td className="p-4 sm:p-5 text-xs text-gray-400">{model.application}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Touch Stands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {abner.stands.map((stand: any, idx: number) => (
          <div key={idx} className="glass-panel-elevated rounded-3xl p-8 border border-white/10 space-y-4">
            <span className="text-brand-400 text-xs font-bold font-mono">STAND MODEL 0{idx + 1}</span>
            <h3 className="text-xl font-bold text-white">{stand.name}</h3>
            <div className="space-y-2 text-xs text-gray-300">
              <div>سیستم عامل: <span className="text-white font-semibold">{stand.os}</span></div>
              <div>قابلیت لمس: <span className="text-white font-semibold">{stand.touch_points}</span></div>
              <div className="text-gray-400 pt-2 leading-relaxed">{stand.application}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Banner */}
      <div className="glass-panel-brand rounded-3xl p-8 sm:p-12 border border-brand-500/30 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-white">مشاوره تخصصی و استعلام قیمت تلویزیون شهری</h2>
        <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto leading-relaxed">
          برای برآورد دقیق ابعاد، محاسبه هزینه سازه و صدور پیش‌فاکتور رسمی با تیم مهندسی ابنر اروم‌سیما تماس بگیرید.
        </p>
        <div className="pt-2">
          <Link
            href="/contact-us/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-dark-base font-black text-xs hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
          >
            <span>درخواست استعلام قیمت و بازدید محل</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles, Layers, ShieldCheck, Compass } from 'lucide-react';
import { getServices } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'خدمات تخصصی دیجیتال مارکتینگ و طراحی سایت در ارومیه',
  description: 'معرفی خدمات ۵ گانه آژانس اروم سیما: طراحی سایت مدرن، سئو تکنیکال، تولید محتوای اینستاگرام، تیزر صنعتی و رسانه‌های محیطی در ارومیه.',
  path: '/services/',
});

export default function ServicesPage() {
  const services = getServices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Compass className="w-4 h-4 text-amber-300" />
          <span>پرتفوی خدمات جامع اروم‌سیما</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          ۵ بال استراتژیک برای سلطه دیجیتال برند شما
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          ما زنجیره کامل خدمات بازاریابی و مهندسی وب را در قالب ایستگاه‌های به‌هم‌پیوسته با استانداردهای تراز اول بین‌المللی ارائه می‌دهیم.
        </p>
      </div>

      {/* Services Concourse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="glass-panel-dock rounded-3xl p-8 border border-white/10 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-300 bg-brand-600/20 border border-brand-500/30 px-3 py-1 rounded-full">
                  ایستگاه ۰{index + 1}
                </span>
                <span className="text-xs text-gray-400">{service.breadcrumb_label}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                  {service.short_description}
                </p>
              </div>

              <div className="pt-3 space-y-2.5 border-t border-white/5">
                {service.features.slice(0, 3).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5">
              <Link
                href={service.dedicated_url || ('/services/' + service.slug + '/')}
                className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-brand-600/20 text-white hover:text-brand-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10 group-hover:border-brand-500/40"
              >
                <span>مشاهده تعرفه‌ها و پرونده تخصصی</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

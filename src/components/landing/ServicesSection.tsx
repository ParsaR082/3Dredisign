import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Code, Search, Video, BarChart2, Megaphone, Smartphone } from 'lucide-react';
import type { Service } from '@/types/content';

interface ServicesSectionProps {
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDesc: string;
  services: Service[];
}

export default function ServicesSection({
  sectionTitle,
  sectionSubtitle,
  sectionDesc,
  services,
}: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  // Icon mapping helper
  const getIcon = (iconName: string, idx: number) => {
    const key = (iconName || '').toLowerCase();
    if (key.includes('code') || key.includes('web') || idx === 0) return <Code className="w-5 h-5" />;
    if (key.includes('search') || key.includes('seo') || idx === 1) return <Search className="w-5 h-5" />;
    if (key.includes('video') || key.includes('camera') || idx === 2) return <Video className="w-5 h-5" />;
    if (key.includes('chart') || key.includes('growth') || idx === 3) return <BarChart2 className="w-5 h-5" />;
    if (key.includes('phone') || key.includes('mobile') || idx === 4) return <Smartphone className="w-5 h-5" />;
    return <Megaphone className="w-5 h-5" />;
  };

  return (
    <section className="services py-20 px-4 sm:px-6 bg-[#08110F]" id="services">
      <div className="sec-hd rv text-center max-w-2xl 2xl:max-w-4xl mx-auto mb-14">
        <span className="sec-lbl inline-block text-emerald-400 text-xs 2xl:text-sm font-bold tracking-wider uppercase mb-2">
          {sectionTitle || 'خدمات دیجیتال مارکتینگ اروم سیما'}
        </span>
        <h2 className="sec-title text-3xl md:text-4xl 2xl:text-5xl font-black text-white mb-4">
          {sectionSubtitle || 'راهکارهای جامع دیجیتال'}
        </h2>
        <p className="sec-desc text-sm md:text-base 2xl:text-lg text-gray-400 font-light">
          {sectionDesc || 'از طراحی تا اجرا، تمام نیازهای دیجیتال کسب‌وکار شما را پوشش می‌دهیم'}
        </p>
      </div>

      <div className="srv-grid max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 2xl:gap-10">
        {services.map((service, idx) => (
          <article
            key={service.id || service.slug}
            className="srv-card group bg-[#0C1915] border border-emerald-500/20 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:border-emerald-400/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-950/50"
          >
            {/* Service Media Preview */}
            <Link
              href={service.dedicated_url || `/services/${service.slug}/`}
              className="srv-card__media relative block aspect-[16/10] overflow-hidden bg-emerald-950/30"
              tabIndex={-1}
            >
              <div className="srv-card__ph w-full h-full flex flex-col items-center justify-center gap-3 relative">
                <div className="srv-card__ph-grid absolute inset-0 opacity-40 bg-[radial-gradient(#0E946E_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="srv-card__ph-ico relative z-10 w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-transform">
                  {getIcon(service.icon, idx)}
                </div>
                <span className="srv-card__ph-label relative z-10 text-xs font-bold text-emerald-200/80">
                  {service.title}
                </span>
              </div>
              {idx === 0 && (
                <span className="srv-card__badge absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md shadow-emerald-500/30">
                  محبوب
                </span>
              )}
            </Link>

            {/* Service Body */}
            <div className="srv-card__body p-6 flex flex-col flex-1">
              <h3 className="srv-title text-xl font-bold text-white mb-2">
                <Link
                  href={service.dedicated_url || `/services/${service.slug}/`}
                  className="hover:text-emerald-300 transition-colors"
                >
                  {service.title}
                </Link>
              </h3>

              <p className="srv-desc text-xs sm:text-sm text-gray-400 font-light leading-relaxed mb-6 line-clamp-2">
                {service.short_description || service.description}
              </p>

              {/* Feature Checklist */}
              {service.features && service.features.length > 0 && (
                <ul className="srv-list space-y-2.5 mb-6 text-xs text-gray-300">
                  {service.features.slice(0, 3).map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <span className="chk w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className="line-clamp-1">{f.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action Link */}
              <Link
                href={service.dedicated_url || `/services/${service.slug}/`}
                className="srv-link inline-flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 mt-auto pt-4 border-t border-emerald-500/10 transition-colors"
              >
                <span>اطلاعات بیشتر و استعلام قیمت</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

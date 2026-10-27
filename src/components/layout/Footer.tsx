'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Clock, ArrowUpRight, Send, Instagram, Share2 } from 'lucide-react';
import type { SiteSettings, Service } from '@/types/content';

interface FooterProps {
  settings: SiteSettings;
  services: Service[];
}

export default function Footer({ settings, services }: FooterProps) {
  const pathname = usePathname();

  // On the immersive 3D homepage ('/'), navigation is handled through the 3D campus & Sector 4 terminal portal.
  // We hide the static footer on the homepage so it does not block the 3D scene and hero card.
  if (pathname === '/' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-dark-base border-t border-white/10 text-gray-400 pt-16 pb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: About & Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
                <span className="text-white font-black text-xl">۳D</span>
              </div>
              <div>
                <span className="text-xl font-black text-white">{settings.site_name}</span>
                <span className="block text-xs text-gray-400 font-mono tracking-widest">{settings.site_slogan}</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 pr-2">
              {settings.footer_about_text}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-600/20 hover:text-brand-400 text-gray-300 flex items-center justify-center transition-all border border-white/5"
                aria-label="اینستاگرام اروم سیما"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-teal-600/20 hover:text-teal-400 text-gray-300 flex items-center justify-center transition-all border border-white/5"
                aria-label="تلگرام اروم سیما"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href={settings.rubika_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-amber-600/20 hover:text-amber-400 text-gray-300 flex items-center justify-center transition-all border border-white/5 text-xs font-bold"
                aria-label="روبیکا اروم سیما"
              >
                روبیکا
              </a>
            </div>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">خدمات استراتژیک</h4>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={s.dedicated_url || `/services/${s.slug}/`}
                    className="hover:text-brand-400 transition-colors flex items-center gap-1 group"
                  >
                    <span>{s.title}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/portfolio/" className="hover:text-white transition-colors">نمونه‌کارهای شاخص</Link></li>
              <li><Link href="/pricing/" className="hover:text-white transition-colors">تعرفه‌ها و پلن‌های رشد</Link></li>
              <li><Link href="/abner/" className="hover:text-white transition-colors">نمایندگی تلویزیون شهری ابنر</Link></li>
              <li><Link href="/about-us/" className="hover:text-white transition-colors">درباره ما و تیم رهبران ۳D</Link></li>
              <li><Link href="/blog/" className="hover:text-white transition-colors">مجله تخصصی فناوری و سئو</Link></li>
              <li><Link href="/contact-us/" className="hover:text-white transition-colors">تماس و نقشه دفتر</Link></li>
            </ul>
          </div>

          {/* Col 5: NAP & Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">اطلاعات تماس و دفتر</h4>
            <div className="space-y-2.5 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{settings.office_address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`tel:${settings.phone_e164}`} className="hover:text-white font-mono dir-ltr">
                  {settings.phone_display}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{settings.footer_working_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>{settings.footer_copyright_text}</p>
          <div className="flex items-center gap-6">
            <span>توسعه‌یافته با معماری مدرن سه‌بعدی Next.js & Three.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

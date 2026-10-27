'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Send, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import type { SiteSettings, Service } from '@/types/content';

interface ContactUsViewProps {
  settings: SiteSettings;
  services: Service[];
}

export default function ContactUsView({ settings, services }: ContactUsViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: services[0]?.slug || 'web-design',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure contact-us is stored so any back navigation (browser back, gestures) returns cleanly to the 3D sofa station
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('last_dive_target', 'contact-us');
      } catch (_) {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedService = services.find((s) => s.slug === formData.service);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          serviceId: selectedService ? Number(selectedService.id) : undefined,
          message: formData.message
            ? `[خدمت انتخابی: ${selectedService?.title || formData.service}]\n${formData.message}`
            : `[درخواست مشاوره برای خدمت: ${selectedService?.title || formData.service}]`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطایی در ثبت پیام رخ داد.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'خطایی در اتصال به سرور رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* 3D Campus Return Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Link
          href="/?returnFrom=contact-us"
          onClick={() => {
            if (typeof window !== 'undefined') {
              try {
                sessionStorage.setItem('last_dive_target', 'contact-us');
              } catch (_) {}
            }
          }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-brand-600/25 border border-white/10 hover:border-brand-500/40 text-gray-300 hover:text-white text-xs sm:text-sm font-semibold transition-all group shadow-sm backdrop-blur-md"
        >
          <ArrowRight className="w-4 h-4 text-brand-400 group-hover:translate-x-1 transition-transform" />
          <span>بازگشت به پردیس ۳بعدی (ایستگاه مشاوره حضوری)</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-brand text-brand-300 text-xs font-semibold">
          <Clock className="w-4 h-4 text-amber-300" />
          <span>پاسخگویی سریع در ساعات اداری</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          تماس با آژانس دیجیتال مارکتینگ اروم سیما
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          برای مشاوره تخصصی، استعلام هزینه پروژه‌ها یا بازدید حضوری از دفتر مرکزی ارومیه، در کنارتان هستیم.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white">فرم درخواست مشاوره و استعلام آنلاین</h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-brand-600/20 border border-brand-500/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-brand-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">درخواست شما با موفقیت ثبت شد!</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                کارشناسان ارشد اروم‌سیما حداکثر تا ۲ ساعت کاری آینده برای ارائه اطلاعات کامل و هماهنگی جلسه با شما تماس خواهند گرفت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">نام و نام خانوادگی / شرکت</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: مهندس رحیمی"
                  className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">شماره تماس مستقیم (موبایل)</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0914xxxxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors text-right"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">خدمت مورد نظر شما</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white focus:outline-none focus:border-brand-500 transition-colors"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                  <option value="other">سایر خدمات / مشاوره کلی</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">توضیحات یا نیازهای اختصاصی پروژه</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="خلاصه‌ای از اهداف، بودجه تقریبی یا سوالات خود را بنویسید..."
                  className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ارسال درخواست مشاوره</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Office Details & Map Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-elevated rounded-3xl p-8 border border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">
              دفتر مرکزی و اطلاعات تماس
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.office_address}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                <a href={'tel:' + settings.phone_e164} className="hover:text-white font-mono dir-ltr font-bold text-base">
                  {settings.phone_display}
                </a>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-brand-400 shrink-0" />
                <span>{settings.footer_working_hours}</span>
              </div>
            </div>

            {/* Map Preview & Direct Route Links */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="rounded-2xl overflow-hidden border border-white/10 h-44 bg-dark-elevated relative flex items-center justify-center">
                <div className="text-center p-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">مختصات: ۳۷.۵۵۲۷ , ۴۵.۰۷۶۰</div>
                  <div className="text-[11px] text-gray-400">میدان امام حسین، ساختمان ۱۳۴ ارومیه</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://maps.google.com/?q=37.5527,45.0760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-center border border-white/5 flex items-center justify-center gap-1.5"
                >
                  <span>مسیریابی در Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://nshn.ir/?lat=37.5527&lng=45.0760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-center border border-white/5 flex items-center justify-center gap-1.5"
                >
                  <span>مسیریابی در نشان</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

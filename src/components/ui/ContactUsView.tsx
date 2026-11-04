'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, Send, CheckCircle2, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import type { SiteSettings, Service } from '@/types/content';

const ContactOfficeMap = dynamic(() => import('@/components/ui/ContactOfficeMap'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-white/10 h-52 sm:h-64 bg-dark-elevated flex items-center justify-center text-gray-400 text-xs">
      در حال بارگذاری نقشه دفتر...
    </div>
  ),
});
import {
  MotionDiv,
  StaggerContainer,
  StaggerItem,
  InteractiveCard,
  InteractiveButton,
  MotionBadge,
  transitionSpring,
  transitionSmooth,
} from '@/components/ui/motion';

interface ContactUsViewProps {
  settings: SiteSettings;
  services: Service[];
  contactPage?: any;
}

export default function ContactUsView({ settings, services, contactPage }: ContactUsViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: services[0]?.slug || 'web-design',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch('/api/contact/', {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* 3D Campus Return Navigation Bar */}
      <MotionDiv
        variant="fade-up"
        className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 pt-1 sm:pt-2"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 hover:bg-brand-600/25 border border-white/10 hover:border-brand-500/40 text-gray-300 hover:text-white text-xs sm:text-sm font-semibold transition-all group shadow-sm backdrop-blur-md"
        >
          <motion.span
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2"
          >
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400 group-hover:translate-x-1 transition-transform" />
            <span>بازگشت به صفحه اصلی</span>
          </motion.span>
        </Link>

        <MotionBadge className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full glass-panel-brand text-brand-300 text-[11px] sm:text-xs font-semibold cursor-default">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>{contactPage?.hero_badge || 'پاسخگویی سریع در ساعات اداری'}</span>
        </MotionBadge>
      </MotionDiv>

      {/* Header */}
      <MotionDiv variant="fade-up" delay={0.05} className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {contactPage?.hero_title || 'تماس با آژانس دیجیتال مارکتینگ اروم سیما'}
        </h1>
        <p className="text-gray-400 text-xs sm:text-base leading-relaxed">
          {contactPage?.hero_description ||
            'برای مشاوره تخصصی، استعلام هزینه پروژه‌ها یا بازدید حضوری از دفتر مرکزی ارومیه، در کنارتان هستیم.'}
        </p>
      </MotionDiv>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Contact Form */}
        <MotionDiv
          variant="fade-up"
          delay={0.1}
          className="lg:col-span-7 glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-white/10 space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <span>فرم درخواست مشاوره و استعلام آنلاین</span>
          </h2>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="submitted-state"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={transitionSpring}
                className="p-8 sm:p-10 rounded-2xl bg-brand-600/20 border border-brand-500/40 text-center space-y-4 shadow-xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-brand-500/30 border border-brand-400/50 flex items-center justify-center mx-auto text-brand-300"
                >
                  <CheckCircle2 className="w-10 h-10 text-brand-400" />
                </motion.div>
                <h3 className="text-xl font-black text-white">درخواست شما با موفقیت ثبت شد!</h3>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md mx-auto">
                  کارشناسان ارشد اروم‌سیما حداکثر تا ۲ ساعت کاری آینده برای ارائه اطلاعات کامل و هماهنگی جلسه با شما تماس خواهند گرفت.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-brand-400 hover:text-brand-300 underline underline-offset-4 transition-colors"
                  >
                    ثبت پیام یا استعلام جدید
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4 text-xs sm:text-sm"
              >
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">نام و نام خانوادگی / شرکت</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: مهندس رحیمی"
                    className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
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
                    className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">خدمت مورد نظر شما</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
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
                    className="w-full px-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ارسال درخواست مشاوره</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </MotionDiv>

        {/* Office Details & Map Card */}
        <MotionDiv
          variant="fade-up"
          delay={0.15}
          className="lg:col-span-5 space-y-6"
        >
          <InteractiveCard className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 space-y-5 sm:space-y-6 shadow-2xl">
            <h2 className="text-base sm:text-lg font-bold text-white border-b border-white/5 pb-3">
              {contactPage?.info_section_title || 'دفتر مرکزی و اطلاعات تماس'}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.office_address}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                <a
                  href={'tel:' + settings.phone_e164}
                  className="hover:text-brand-300 font-mono dir-ltr font-bold text-sm sm:text-base transition-colors"
                >
                  {settings.phone_display}
                </a>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-brand-400 shrink-0" />
                <span>{settings.footer_working_hours}</span>
              </div>
            </div>

            {/* Interactive Office Map & Direct Route Links */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <ContactOfficeMap
                latitude={settings.office_latitude}
                longitude={settings.office_longitude}
                title="دفتر مرکزی کانون تبلیغات اوروم سیما"
                address={settings.office_address}
              />
            </div>
          </InteractiveCard>
        </MotionDiv>
      </div>
    </div>
  );
}

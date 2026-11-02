'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Save,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Globe,
  Share2,
  ExternalLink,
  Sparkles,
  FileText,
} from 'lucide-react';

interface ContactInfoTabProps {
  initialSettings: any;
  initialContactPage?: any;
  onRefresh: () => void;
}

export default function ContactInfoTab({
  initialSettings,
  initialContactPage,
  onRefresh,
}: ContactInfoTabProps) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [contactPage, setContactPage] = useState(initialContactPage || {});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, contactPage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ذخیره‌سازی اطلاعات');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const lat = settings.office_latitude || 37.5527;
  const lng = settings.office_longitude || 45.076;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>مدیریت اطلاعات ارتباط با ما و تلفن نوبار</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                تغییر شماره تماس نوار ناوبری بالای صفحه (Navbar)، اطلاعات دفتر مرکزی، ساعات کاری، شماره واتساپ و لوکیشن
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Navbar Phone Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-gray-300">تلفن فعال در نوبار:</span>
            <span className="font-mono font-bold text-white dir-ltr text-xs">
              {settings.phone_display || 'تعریف نشده'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>ذخیره تمامی تغییرات ارتباط با ما</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            اطلاعات تماس و تلفن با موفقیت ذخیره شدند و نوبار، فوتر و صفحه ارتباط با ما به‌صورت آنی به‌روزرسانی شدند.
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: Direct Contacts & Office Details */}
        <div className="space-y-8">
          {/* Section 1: Phone Numbers & Navbar Binding */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>شماره‌های تماس و نوار ناوبری داک</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                اتصال مستقیم به Navbar
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Navbar Display Phone */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <label className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>شماره تماس نمایشی در نوار ناوبری داک (Navbar Display Phone)</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="مثال: ۰۹۱۴ ۴۴۹ ۷۷۸۷ یا ۰۴۴ ۳۳۴۴ ۵۵۶۶"
                  value={settings.phone_display || ''}
                  onChange={(e) => setSettings({ ...settings, phone_display: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400 text-left font-mono font-bold"
                />
                <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                  این شماره دقیقاً در پیل شیشه‌ای نوار ناوبری شناور بالای صفحه (macOS Dock) و در بخش تماس سریع دسکتاپ و منوی موبایل نمایش داده می‌شود.
                </p>
              </div>

              {/* E164 International Phone */}
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">
                  شماره تماس استاندارد برای شماره‌گیری (+98)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="مثال: +989144497787"
                  value={settings.phone_e164 || ''}
                  onChange={(e) => setSettings({ ...settings, phone_e164: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-0.5">
                  هنگامی که کاربر روی شماره یا آیکون گوشی تلفن در نوبار یا فوتر کلیک می‌کند، این شماره شماره‌گیری می‌شود (لینک <span className="font-mono dir-ltr">tel:</span>).
                </p>
              </div>

              {/* WhatsApp Support Number */}
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>شماره پشتیبانی واتساپ (WhatsApp)</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="مثال: +989144497787"
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-0.5">
                  این شماره مستقیماً به دکمه چت آنلاین واتساپ در گوشه تصویر متصل است.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Office Address & Working Hours */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>مشخصات دفتر مرکزی و لوکیشن نقشه</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">آدرس دقیق پستی دفتر مرکزی</label>
                <textarea
                  rows={3}
                  placeholder="مثال: ارومیه، خیابان خیام جنوبی، ساختمان سیما"
                  value={settings.office_address || ''}
                  onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">شهر</label>
                  <input
                    type="text"
                    value={settings.office_city || 'ارومیه'}
                    onChange={(e) => setSettings({ ...settings, office_city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">استان / منطقه</label>
                  <input
                    type="text"
                    value={settings.office_region || 'آذربایجان غربی'}
                    onChange={(e) => setSettings({ ...settings, office_region: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>ساعات کاری و پاسخگویی تلفنی</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: شنبه تا چهارشنبه: ۹:۰۰ الی ۱۸:۰۰ | پنجشنبه‌ها: ۹:۰۰ الی ۱۴:۰۰"
                  value={settings.footer_working_hours || ''}
                  onChange={(e) => setSettings({ ...settings, footer_working_hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">عرض جغرافیایی (Latitude)</label>
                  <input
                    type="number"
                    step="any"
                    dir="ltr"
                    value={settings.office_latitude || 37.5527}
                    onChange={(e) => setSettings({ ...settings, office_latitude: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">طول جغرافیایی (Longitude)</label>
                  <input
                    type="number"
                    step="any"
                    dir="ltr"
                    value={settings.office_longitude || 45.076}
                    onChange={(e) => setSettings({ ...settings, office_longitude: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                  />
                </div>
              </div>

              {/* Map Preview Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`https://maps.google.com/?q=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center gap-1.5 text-xs transition-colors"
                >
                  <span>بررسی موقعیت در گوگل‌مپ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://nshn.ir/?lat=${lat}&lng=${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center gap-1.5 text-xs transition-colors"
                >
                  <span>بررسی موقعیت در نشان</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Social Media & Contact Page Content */}
        <div className="space-y-8">
          {/* Section 3: Social Media & Messengers */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Share2 className="w-4 h-4 text-brand-400" />
              <span>شبکه‌های اجتماعی و پیام‌رسان‌ها</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">صفحه اینستاگرام (Instagram URL)</label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://instagram.com/urum_sima"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">کانال یا آیدی تلگرام (Telegram URL)</label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://t.me/Urumsimaa"
                  value={settings.telegram_url || ''}
                  onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">کانال یا صفحه روبیکا (Rubika URL)</label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://rubika.ir/urumsima"
                  value={settings.rubika_url || ''}
                  onChange={(e) => setSettings({ ...settings, rubika_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">صفحه لینکدین (LinkedIn URL)</label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://linkedin.com/company/urumsima"
                  value={settings.linkedin_url || ''}
                  onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact Us Page Content Settings */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <FileText className="w-4 h-4 text-brand-400" />
              <span>محتوای متنی و سئو صفحه ارتباط با ما</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">بج بالای صفحه تماس (Hero Badge)</label>
                <input
                  type="text"
                  placeholder="تماس با ما"
                  value={contactPage.hero_badge || ''}
                  onChange={(e) => setContactPage({ ...contactPage, hero_badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">تیتر اصلی صفحه تماس (Hero Title)</label>
                <input
                  type="text"
                  placeholder="تماس با آژانس دیجیتال مارکتینگ اروم سیما"
                  value={contactPage.hero_title || ''}
                  onChange={(e) => setContactPage({ ...contactPage, hero_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">متن معرفی و توضیحات صفحه تماس</label>
                <textarea
                  rows={3}
                  placeholder="برای مشاوره تخصصی، استعلام هزینه پروژه‌ها یا بازدید حضوری از دفتر مرکزی ارومیه..."
                  value={contactPage.hero_description || ''}
                  onChange={(e) => setContactPage({ ...contactPage, hero_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">عنوان سئو صفحه تماس (Meta Title)</label>
                <input
                  type="text"
                  placeholder="تماس با اروم سیما | مشاوره و آدرس هلدینگ تبلیغاتی در ارومیه"
                  value={contactPage.meta_title || ''}
                  onChange={(e) => setContactPage({ ...contactPage, meta_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">توضیحات سئو صفحه تماس (Meta Description)</label>
                <textarea
                  rows={2}
                  placeholder="ارتباط مستقیم با کارشناسان آژانس تبلیغاتی اروم سیما..."
                  value={contactPage.meta_description || ''}
                  onChange={(e) => setContactPage({ ...contactPage, meta_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

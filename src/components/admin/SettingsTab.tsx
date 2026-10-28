'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Loader2, MapPin, Phone, Globe, Share2, Sparkles } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface SettingsTabProps {
  initialSettings: any;
  initialLanding: any;
  onRefresh: () => void;
}

export default function SettingsTab({ initialSettings, initialLanding, onRefresh }: SettingsTabProps) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [landing, setLanding] = useState(initialLanding || {});
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
        body: JSON.stringify({ settings, landing }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ذخیره‌سازی');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-400" />
            <span>تنظیمات عمومی، اطلاعات تماس و متادیتا</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            ویرایش اطلاعات اصلی شرکت در جدول‌های public_sitesettings و public_landingpage با ذخیره بلادرنگ
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-105 self-start sm:self-auto"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>ذخیره تمامی تنظیمات</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>تنظیمات با موفقیت در دیتابیس ذخیره شدند و فرانت‌اند به‌روزرسانی شد.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Grid: 2 Columns for Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Section 1: Contact Information */}
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
            <Phone className="w-4 h-4 text-brand-400" />
            <span>اطلاعات تماس و دفتر مرکزی</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block">نام رسمی برند / آژانس</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block">شعار برند (Slogan)</label>
              <input
                type="text"
                value={settings.site_slogan || ''}
                onChange={(e) => setSettings({ ...settings, site_slogan: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">شماره تماس نمایشی (داخلی)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.phone_display || ''}
                  onChange={(e) => setSettings({ ...settings, phone_display: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">شماره تماس استاندارد (+98)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.phone_e164 || ''}
                  onChange={(e) => setSettings({ ...settings, phone_e164: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block">شماره پشتیبانی واتساپ</label>
              <input
                type="text"
                dir="ltr"
                value={settings.whatsapp_number || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block">آدرس دقیق دفتر</label>
              <textarea
                rows={3}
                value={settings.office_address || ''}
                onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">عرض جغرافیایی (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  dir="ltr"
                  value={settings.office_latitude || 37.5518}
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
                  value={settings.office_longitude || 45.0782}
                  onChange={(e) => setSettings({ ...settings, office_longitude: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Social & SEO */}
        <div className="space-y-8">
          {/* Social Links */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Share2 className="w-4 h-4 text-brand-400" />
              <span>شبکه‌های اجتماعی و پیام‌رسان‌ها</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">لینک صفحه اینستاگرام</label>
                <input
                  type="url"
                  dir="ltr"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">لینک کانال یا آیدی تلگرام</label>
                <input
                  type="url"
                  dir="ltr"
                  value={settings.telegram_url || ''}
                  onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">لینک صفحه روبیکا</label>
                <input
                  type="url"
                  dir="ltr"
                  value={settings.rubika_url || ''}
                  onChange={(e) => setSettings({ ...settings, rubika_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>
            </div>
          </div>

          {/* SEO Meta */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Globe className="w-4 h-4 text-brand-400" />
              <span>تنظیمات پیش‌فرض سئو (SEO Meta)</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">عنوان پیش‌فرض سئو (Meta Title)</label>
                <input
                  type="text"
                  value={settings.meta_title_default || ''}
                  onChange={(e) => setSettings({ ...settings, meta_title_default: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">توضیحات پیش‌فرض متا (Meta Description)</label>
                <textarea
                  rows={3}
                  value={settings.meta_description_default || ''}
                  onChange={(e) => setSettings({ ...settings, meta_description_default: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <ImageUpload
                  label="تصویر شاخص شبکه‌های اجتماعی (OG Image)"
                  value={settings.default_og_image || ''}
                  onChange={(url) => setSettings({ ...settings, default_og_image: url })}
                  folder="seo"
                  hint="تصویر پیشنهادی ۱۲۰۰x۶۳۰ برای نمایش هنگام اشتراک‌گذاری لینک در شبکه‌های اجتماعی"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

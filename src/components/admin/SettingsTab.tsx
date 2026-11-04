'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Loader2, MapPin, Phone, Globe, Share2, Sparkles, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface SettingsTabProps {
  initialSettings: any;
  initialLanding: any;
  onRefresh: () => void;
}

export default function SettingsTab({ initialSettings, initialLanding, onRefresh }: SettingsTabProps) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [landing, setLanding] = useState(initialLanding || {});
  const [activeSection, setActiveSection] = useState<'all' | 'footer' | 'hero' | 'contact' | 'seo'>('all');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-400" />
            <span>تنظیمات عمومی، متون فوتر، تصویر هیرو و سئو</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            ویرایش کامل محتوای فوتر، اطلاعات تماس، تصویر پس‌زمینه هیرو و تنظیمات سئو با ذخیره پایدار در دیتابیس
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-105 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>ذخیره تمامی تنظیمات</span>
        </button>
      </div>

      {/* Quick Navigation Filter Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'all'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          نمایش همه بخش‌ها
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('footer')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'footer'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>متون فوتر و کپی‌رایت (Footer CMS)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('hero')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'hero'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>تصویر هیرو و متون لندینگ</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('contact')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'contact'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>اطلاعات تماس و دفتر</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('seo')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'seo'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>شبکه‌های اجتماعی و سئو</span>
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

      {/* Grid: Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── SECTION 1: FOOTER CONTENT CMS ── */}
        {(activeSection === 'all' || activeSection === 'footer') && (
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 bg-emerald-950/20 shadow-2xl space-y-5 lg:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>متون و محتوای فوتر (Footer CMS) - ستون اول و انتهای وب‌سایت</span>
              </h3>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                قابل نمایش در تمامی صفحات
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-gray-200 font-semibold block">متن معرفی کوتاه برند در فوتر (ستون اول فوتر)</label>
                <textarea
                  rows={3}
                  value={settings.footer_about_text || ''}
                  onChange={(e) => setSettings({ ...settings, footer_about_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-base border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
                  placeholder="توضیحات کوتاه درباره اروم سیما در ستون اول فوتر..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-200 font-semibold block">ساعات کاری و پاسخگویی دفتر</label>
                <input
                  type="text"
                  value={settings.footer_working_hours || ''}
                  onChange={(e) => setSettings({ ...settings, footer_working_hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-base border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400"
                  placeholder="شنبه تا چهارشنبه: ۸:۳۰ الی ۱۷:۰۰ | پنجشنبه‌ها: ۸:۳۰ الی ۱۳:۳۰"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-200 font-semibold block">متن کپی‌رایت انتهای فوتر</label>
                <input
                  type="text"
                  value={settings.footer_copyright_text || ''}
                  onChange={(e) => setSettings({ ...settings, footer_copyright_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-base border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400"
                  placeholder="© تمامی حقوق مادی و معنوی این وب‌سایت متعلق به کانون تبلیغات اوروم سیما می‌باشد."
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 2: HERO IMAGE & LANDING BANNER ── */}
        {(activeSection === 'all' || activeSection === 'hero') && (
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <ImageIcon className="w-4 h-4 text-brand-400" />
              <span>تصویر هیرو و هویت بصری لندینگ پیج</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <ImageUpload
                  label="تصویر کاور هیرو لندینگ پیج (WebP خودکار)"
                  value={landing.hero_image || ''}
                  onChange={(url) => setLanding({ ...landing, hero_image: url })}
                  folder="landing"
                  hint="تصویر کاور اصلی بخش هیرو صفحه نخست سایت (پیش‌فرض: بنر تیم اروم‌سیما)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">بج / تگ بالای تیتر هیرو</label>
                <input
                  type="text"
                  value={landing.hero_badge || ''}
                  onChange={(e) => setLanding({ ...landing, hero_badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  placeholder="آژانس خلاقیت و دیجیتال مارکتینگ اروم سیما"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">تیتر اصلی هیرو لندینگ</label>
                <input
                  type="text"
                  value={landing.hero_title || ''}
                  onChange={(e) => setLanding({ ...landing, hero_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">توضیحات پاراگراف هیرو</label>
                <textarea
                  rows={3}
                  value={landing.hero_description || ''}
                  onChange={(e) => setLanding({ ...landing, hero_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 3: CONTACT & OFFICE INFO ── */}
        {(activeSection === 'all' || activeSection === 'contact') && (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">شماره تلفن نمایشی</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.phone_display || ''}
                    onChange={(e) => setSettings({ ...settings, phone_display: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                    placeholder="044-32240000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">شماره تماس اضطراری / واتساپ</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.phone_emergency || ''}
                    onChange={(e) => setSettings({ ...settings, phone_emergency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">آدرس رسمی دفتر شرکت</label>
                <textarea
                  rows={2}
                  value={settings.office_address || ''}
                  onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">عرض جغرافیایی (Latitude نقشه)</label>
                  <input
                    type="number"
                    step="any"
                    dir="ltr"
                    value={settings.office_latitude || 37.5527}
                    onChange={(e) => setSettings({ ...settings, office_latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">طول جغرافیایی (Longitude نقشه)</label>
                  <input
                    type="number"
                    step="any"
                    dir="ltr"
                    value={settings.office_longitude || 45.076}
                    onChange={(e) => setSettings({ ...settings, office_longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 4: SOCIAL & SEO ── */}
        {(activeSection === 'all' || activeSection === 'seo') && (
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
        )}
      </div>
    </form>
  );
}

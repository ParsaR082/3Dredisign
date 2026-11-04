'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  HelpCircle,
  TrendingUp,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  X,
  ArrowRight,
  Film,
  Play,
  Eye,
  Heart,
  Video,
  Calculator,
  Save,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface LandingElementsTabProps {
  processSteps: any[];
  whyItems: any[];
  growthStats: any[];
  tickerItems: any[];
  reels?: any[];
  roiConfig?: any;
  onRefresh: () => void;
}

export default function LandingElementsTab({
  processSteps = [],
  whyItems = [],
  growthStats = [],
  tickerItems = [],
  reels = [],
  roiConfig,
  onRefresh,
}: LandingElementsTabProps) {
  const [activeSection, setActiveSection] = useState<'steps' | 'why' | 'growth' | 'ticker' | 'reels' | 'roi'>('steps');
  const [roiForm, setRoiForm] = useState(roiConfig || {
    title: 'تخمین بازگشت سرمایه (ROI Calculator)',
    subtitle: 'محاسبه شفاف سودآوری و جذب لید حاصل از طراحی سایت اختصاصی و بازاریابی هدفمند',
    disclaimer: 'اعداد بر اساس میانگین واقعی عملکرد مشتریان اروم‌سیما در ۳ سال گذشته تخمین زده شده‌اند.',
    is_active: true,
  });
  const [roiSaving, setRoiSaving] = useState(false);
  const [roiSuccess, setRoiSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    step_number: '۰۱',
    order: 1,
    icon: '⚡',
    value: '+۱۲۰٪',
    cover_image: '',
    video_url: '',
    views_count: '1.2K',
    likes_count: '350',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      step_number: `۰${processSteps.length + 1}`,
      order:
        activeSection === 'reels'
          ? reels.length + 1
          : activeSection === 'steps'
          ? processSteps.length + 1
          : activeSection === 'why'
          ? whyItems.length + 1
          : growthStats.length + 1,
      icon: '⚡',
      value: '+۱۲۰٪',
      cover_image: '',
      video_url: '',
      views_count: '1.5K',
      likes_count: '420',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (activeSection === 'reels') {
      setFormData({
        title: item.caption || item.title || '',
        description: '',
        step_number: '۰۱',
        order: item.order || 1,
        icon: '⚡',
        value: '+۱۲۰٪',
        cover_image: item.thumbnail || item.cover_image || '',
        video_url: item.reel_url || item.video_url || '',
        views_count: item.views_count || '1.5K',
        likes_count: item.likes_count || '420',
      });
    } else if (activeSection === 'steps') {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        step_number: item.step_number || '۰۱',
        order: item.order || 1,
        icon: '⚡',
        value: '+۱۲۰٪',
        cover_image: '',
        video_url: '',
        views_count: '1.5K',
        likes_count: '420',
      });
    } else if (activeSection === 'why') {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        step_number: item.number || '۰۱',
        order: item.order || 1,
        icon: '⚡',
        value: '+۱۲۰٪',
        cover_image: '',
        video_url: '',
        views_count: '1.5K',
        likes_count: '420',
      });
    } else if (activeSection === 'growth') {
      setFormData({
        title: item.label || item.title || '',
        description: '',
        step_number: '۰۱',
        order: item.order || 1,
        icon: item.icon || '🚀',
        value: item.value || '+۱۲۰٪',
        cover_image: '',
        video_url: '',
        views_count: '1.5K',
        likes_count: '420',
      });
    } else {
      setFormData({
        title: item.text || item.title || '',
        description: '',
        step_number: '۰۱',
        order: item.order || 1,
        icon: '⚡',
        value: '+۱۲۰٪',
        cover_image: '',
        video_url: '',
        views_count: '1.5K',
        likes_count: '420',
      });
    }
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const typeMap: Record<string, string> = {
        steps: 'step',
        why: 'why',
        growth: 'growth',
        ticker: 'ticker',
        reels: 'reel',
      };

      const method = editingItem ? 'PUT' : 'POST';
      const payload: any = {
        type: typeMap[activeSection],
        id: editingItem ? editingItem.id : undefined,
        ...formData,
      };

      const res = await fetch('/api/admin/landing-elements/', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت آیتم');

      setModalOpen(false);
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این المان اطمینان دارید؟')) return;
    try {
      const typeMap: Record<string, string> = {
        steps: 'step',
        why: 'why',
        growth: 'growth',
        ticker: 'ticker',
        reels: 'reel',
      };
      const res = await fetch(`/api/admin/landing-elements/?id=${id}&type=${typeMap[activeSection]}`, {
        method: 'DELETE',
      });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  const handleSaveRoi = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoiSaving(true);
    try {
      const res = await fetch('/api/admin/landing-elements/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'roi', roiConfig: roiForm }),
      });
      if (res.ok) {
        setRoiSuccess(true);
        setTimeout(() => setRoiSuccess(false), 3000);
        onRefresh();
      }
    } finally {
      setRoiSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-400" />
            <span>مدیریت المان‌ها و بخش‌های لندینگ</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            ویرایش مراحل فرآیند، ویدیوهای ریلز اینستاگرام، مزایای رقابتی، شاخص‌های رشد و ماشین‌حساب ROI
          </p>
        </div>

        {activeSection !== 'roi' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن آیتم جدید</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSection('steps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'steps'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>مراحل فرآیند کار ({processSteps.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('reels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'reels'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>ویدیوهای ریلز اینستاگرام ({reels.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('why')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'why'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>چرا اروم سیما ({whyItems.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('growth')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'growth'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>شاخص‌های رشد ({growthStats.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('roi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'roi'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>ماشین‌حساب ROI</span>
        </button>
      </div>

      {/* ── 1. STEPS ── */}
      {activeSection === 'steps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 flex items-center justify-center font-bold font-mono text-sm">
                  {step.step_number}
                </span>
                <h3 className="font-bold text-white text-sm">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ترتیب #{step.order}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(step)}
                    className="p-1 text-gray-400 hover:text-brand-400 transition-colors cursor-pointer"
                    title="ویرایش مرحله"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(step.id)}
                    className="p-1 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 2. REELS ── */}
      {activeSection === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {reels.map((reel) => {
            const coverSrc = reel.thumbnail || reel.cover_image;
            return (
              <div
                key={reel.id}
                className="glass-panel border border-white/10 rounded-2xl overflow-hidden hover:border-brand-500/40 transition-all flex flex-col group"
              >
                <div className="aspect-[9/16] bg-black/60 relative overflow-hidden flex items-center justify-center">
                  {coverSrc ? (
                    <img
                      src={coverSrc.startsWith('/') ? coverSrc : `/media/${coverSrc}`}
                      alt={reel.caption || reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Video className="w-8 h-8 text-gray-600" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {reel.reel_url && (
                    <a
                      href={reel.reel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-brand-600 text-white transition-all z-10"
                      title="مشاهده در اینستاگرام"
                    >
                      <Play className="w-3 h-3 fill-white" />
                    </a>
                  )}

                  <div className="absolute bottom-2 right-2 left-2 text-right">
                    <p className="text-xs font-bold text-white truncate">{reel.caption || reel.title || 'بدون عنوان'}</p>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between text-xs bg-dark-card border-t border-white/5">
                  <span className="text-[10px] text-gray-500 font-mono">#{reel.order}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(reel)}
                      className="p-1 text-gray-400 hover:text-brand-400 transition-colors cursor-pointer"
                      title="ویرایش کاور و لینک ریلز"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(reel.id)}
                      className="p-1 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 3. WHY US ── */}
      {activeSection === 'why' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                  {item.number}
                </span>
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">#{item.order}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 text-gray-400 hover:text-brand-400 cursor-pointer"
                    title="ویرایش"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-gray-400 hover:text-rose-400 cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 4. GROWTH STATS ── */}
      {activeSection === 'growth' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {growthStats.map((g) => (
            <div
              key={g.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-2xl">{g.icon || '🚀'}</span>
                <h4 className="text-2xl font-black text-white font-mono">{g.value}</h4>
                <p className="text-xs text-gray-400">{g.label}</p>
              </div>

              <div className="pt-3 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">#{g.order}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(g)}
                    className="p-1 text-gray-400 hover:text-brand-400 cursor-pointer"
                    title="ویرایش"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(g.id)}
                    className="p-1 text-gray-400 hover:text-rose-400 cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 5. ROI CALCULATOR ── */}
      {activeSection === 'roi' && (
        <form onSubmit={handleSaveRoi} className="glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-400" />
              <span>تنظیمات ویجت ماشین‌حساب ROI</span>
            </h3>
            <button
              type="submit"
              disabled={roiSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{roiSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات ROI'}</span>
            </button>
          </div>

          {roiSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تنظیمات ماشین‌حساب ROI با موفقیت ذخیره شد.</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold">عنوان ویجت</label>
              <input
                type="text"
                value={roiForm.title || ''}
                onChange={(e) => setRoiForm({ ...roiForm, title: e.target.value })}
                className="w-full bg-dark-base border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold">توضیحات کوتاه زیر عنوان</label>
              <textarea
                rows={2}
                value={roiForm.subtitle || ''}
                onChange={(e) => setRoiForm({ ...roiForm, subtitle: e.target.value })}
                className="w-full bg-dark-base border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold">متن سلب مسئولیت / توضیحات شفاف‌سازی</label>
              <textarea
                rows={2}
                value={roiForm.disclaimer || ''}
                onChange={(e) => setRoiForm({ ...roiForm, disclaimer: e.target.value })}
                className="w-full bg-dark-base border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={roiForm.is_active}
                  onChange={(e) => setRoiForm({ ...roiForm, is_active: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                />
                <span>فعال بودن ماشین‌حساب ROI در صفحه اصلی</span>
              </label>
            </div>
          </div>
        </form>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-brand-400" />
                <span>{editingItem ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}</span>
              </h3>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">
                  {activeSection === 'reels' ? 'کپشن / عنوان ریلز *' : 'عنوان آیتم *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {activeSection === 'steps' && (
                <div>
                  <label className="block text-gray-300 mb-1">شماره مرحله (مثال: ۰۱)</label>
                  <input
                    type="text"
                    value={formData.step_number}
                    onChange={(e) => setFormData({ ...formData, step_number: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                  />
                </div>
              )}

              {activeSection === 'reels' && (
                <div className="space-y-3">
                  <ImageUpload
                    label="کاور ریلز اینستاگرام (WebP خودکار) *"
                    value={formData.cover_image}
                    onChange={(url) => setFormData({ ...formData, cover_image: url })}
                    folder="reels"
                    required
                  />

                  <div>
                    <label className="block text-gray-300 mb-1">لینک مستقیم ویدیو یا ریلز اینستاگرام</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="https://instagram.com/reel/..."
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-1">تعداد بازدید (مثال: 15.4K)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.views_count}
                        onChange={(e) => setFormData({ ...formData, views_count: e.target.value })}
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">تعداد لایک (مثال: 850)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.likes_count}
                        onChange={(e) => setFormData({ ...formData, likes_count: e.target.value })}
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'growth' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">مقدار شاخص</label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="+۲۵۰٪"
                      className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">آیکون اموجی</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none text-center"
                    />
                  </div>
                </div>
              )}

              {activeSection !== 'growth' && activeSection !== 'reels' && (
                <div>
                  <label className="block text-gray-300 mb-1">توضیحات</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-1">ترتیب نمایش (عدد)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت...' : editingItem ? 'ذخیره تغییرات' : 'افزودن آیتم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

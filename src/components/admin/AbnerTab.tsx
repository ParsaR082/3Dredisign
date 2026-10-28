'use client';

import React, { useState } from 'react';
import {
  Tv,
  Smartphone,
  Plus,
  Trash2,
  Tv2,
  Monitor,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';

interface AbnerTabProps {
  products: any[];
  cityTvModels: any[];
  standModels: any[];
  page: any;
  onRefresh: () => void;
}

export default function AbnerTab({
  products = [],
  cityTvModels = [],
  standModels = [],
  page,
  onRefresh,
}: AbnerTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'citytv' | 'stand' | 'product'>('citytv');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    environment: 'Outdoor',
    pixel_pitch: 'P4',
    brightness: '5500 nits',
    refresh_rate: '3840 Hz',
    resolution: '4K UHD',
    body_material: 'آلومینیوم دایکست ضد زنگ',
    body_color: 'مشکی مات الکترواستاتیک',
    order: 1,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      environment: 'Outdoor',
      pixel_pitch: activeSubTab === 'citytv' ? 'P4' : 'P2.5',
      brightness: '5500 nits',
      refresh_rate: '3840 Hz',
      resolution: 'Full HD / 4K',
      body_material: 'آلومینیوم صنعتی مقاوم',
      body_color: 'مشکی صنعتی',
      order: 1,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/abner/';
      const payload = {
        ...formData,
        type: activeSubTab,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت مدل آبنر');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if (!confirm('آیا از حذف این مدل از دیتابیس اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/abner/?id=${id}&type=${type}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Tv className="w-6 h-6 text-brand-400" />
            <span>برند آبنر (ABNER) - تلویزیون‌های شهری و استندهای لمسی</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            مدیریت مشخصات فنی نمایشگرهای محیطی، سالنی و استندهای تبلیغاتی
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن مدل جدید</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('citytv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'citytv'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tv2 className="w-4 h-4" />
          <span>تلویزیون شهری ({cityTvModels.length} مدل)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('stand')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'stand'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>استندهای لمسی و دیجیتال ({standModels.length} مدل)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('product')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'product'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>محصولات عمومی ({products.length} مورد)</span>
        </button>
      </div>

      {/* Sub Tab Content */}
      {activeSubTab === 'citytv' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cityTvModels.map((m) => (
            <div
              key={m.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {m.pixel_pitch}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{m.environment}</span>
                </div>

                <h3 className="font-bold text-white text-base">{m.name}</h3>

                <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/10">
                  <div className="flex justify-between text-gray-400">
                    <span>روشنایی:</span>
                    <span className="text-white font-bold">{m.brightness}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>نرخ نوسازی:</span>
                    <span className="text-cyan-400">{m.refresh_rate}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>استاندارد عایق:</span>
                    <span className="text-emerald-400">{m.ip_rating}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>ابعاد کابینت:</span>
                    <span className="text-white">{m.cabinet_size}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ترتیب: #{m.order}</span>
                <button
                  onClick={() => handleDelete(m.id, 'citytv')}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'stand' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {standModels.map((s) => (
            <div
              key={s.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {s.resolution}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{s.height}</span>
                </div>

                <h3 className="font-bold text-white text-base">{s.name}</h3>

                <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/10">
                  <div className="flex justify-between text-gray-400">
                    <span>جنس بدنه:</span>
                    <span className="text-white">{s.body_material}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>رنگ بدنه:</span>
                    <span className="text-white">{s.body_color}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>طول عمر:</span>
                    <span className="text-brand-400">{s.lifespan}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>پورت‌ها:</span>
                    <span className="text-gray-300 truncate max-w-[150px]">{s.ports}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ترتیب: #{s.order}</span>
                <button
                  onClick={() => handleDelete(s.id, 'stand')}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'product' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{p.icon || '📺'}</span>
                  <span className="text-xs text-brand-400 font-bold">{p.is_featured ? 'ویژه' : ''}</span>
                </div>
                <h3 className="font-bold text-white text-base">{p.name}</h3>
                <p className="text-xs text-gray-400">{p.short_description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ترتیب: #{p.order}</span>
                <button
                  onClick={() => handleDelete(p.id, 'product')}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">
                افزودن مدل جدید به برند آبنر ({activeSubTab === 'citytv' ? 'تلویزیون شهری' : activeSubTab === 'stand' ? 'استند لمسی' : 'محصول'})
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
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
                <label className="block text-gray-300 mb-1">نام و مدل *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: Abner Outdoor Ultra-P4"
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {activeSubTab === 'citytv' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-1">تراکم پیکسل (Pixel Pitch)</label>
                      <input
                        type="text"
                        value={formData.pixel_pitch}
                        onChange={(e) => setFormData({ ...formData, pixel_pitch: e.target.value })}
                        placeholder="P2.5 / P3 / P4 / P5"
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">محیط کاربری</label>
                      <select
                        value={formData.environment}
                        onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                      >
                        <option value="Outdoor">فضای باز (Outdoor)</option>
                        <option value="Indoor">فضای سرپوشیده (Indoor)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-1">شدت روشنایی</label>
                      <input
                        type="text"
                        value={formData.brightness}
                        onChange={(e) => setFormData({ ...formData, brightness: e.target.value })}
                        placeholder="5500 nits"
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">نرخ نوسازی</label>
                      <input
                        type="text"
                        value={formData.refresh_rate}
                        onChange={(e) => setFormData({ ...formData, refresh_rate: e.target.value })}
                        placeholder="3840 Hz"
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSubTab === 'stand' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-1">رزولوشن تصویر</label>
                      <input
                        type="text"
                        value={formData.resolution}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        placeholder="4K UHD"
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">جنس و متریال بدنه</label>
                      <input
                        type="text"
                        value={formData.body_material}
                        onChange={(e) => setFormData({ ...formData, body_material: e.target.value })}
                        className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">رنگ بدنه</label>
                    <input
                      type="text"
                      value={formData.body_color}
                      onChange={(e) => setFormData({ ...formData, body_color: e.target.value })}
                      className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {activeSubTab === 'product' && (
                <div>
                  <label className="block text-gray-300 mb-1">توضیحات کوتاه محصول</label>
                  <textarea
                    rows={2}
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'در حال ثبت...' : 'ثبت مدل در دیتابیس'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

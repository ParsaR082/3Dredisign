'use client';

import React, { useState } from 'react';
import { Star, Plus, Edit, Trash2, X, Loader2, Quote } from 'lucide-react';

interface TestimonialsTabProps {
  testimonials: any[];
  onRefresh: () => void;
}

export default function TestimonialsTab({ testimonials, onRefresh }: TestimonialsTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    text: '',
    stars: 5,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: 'مدیرعامل',
      company: '',
      text: '',
      stars: 5,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company,
      text: item.text,
      stars: item.stars,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/testimonials/';
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در عملیات');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-brand-400" />
            <span>نظرات مشتریان و برندها ({testimonials.length} نظر)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            نظرات ثبت‌شده در جدول public_landingtestimonial که در بخش مشتریان راضی لندینگ نمایش داده می‌شوند.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن نظر جدید</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="glass-panel-elevated rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5 text-brand-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed italic line-clamp-4">
                &ldquo;{item.text}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {item.avatar_text || item.name?.slice(0, 2)}
              </div>
              <div>
                <span className="font-bold text-xs text-white block">{item.name}</span>
                <span className="text-[11px] text-gray-400">
                  {item.role} - <span className="text-brand-300 font-semibold">{item.company}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-dark-base border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingItem ? 'ویرایش نظر مشتری' : 'افزودن نظر جدید'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">نام شخص *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: علی رضایی"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">سمت سازمانی</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="مثال: مدیرعامل"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">نام برند / شرکت</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="مثال: دیجی‌کالا"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">امتیاز ستاره‌ای (از ۵)</label>
                <select
                  value={formData.stars}
                  onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (۵ ستاره عالی)</option>
                  <option value={4}>⭐⭐⭐⭐ (۴ ستاره خیلی خوب)</option>
                  <option value={3}>⭐⭐⭐ (۳ ستاره خوب)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">متن نظر *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="تجربه همکاری با اروم سیما..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingItem ? 'ذخیره تغییرات' : 'ثبت نظر'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

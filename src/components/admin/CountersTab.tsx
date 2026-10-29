'use client';

import React, { useState } from 'react';
import { BarChart3, Edit, Save, X, Loader2, CheckCircle2 } from 'lucide-react';

interface CountersTabProps {
  counters: any[];
  onRefresh: () => void;
}

export default function CountersTab({ counters, onRefresh }: CountersTabProps) {
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    value: 0,
    suffix: '+',
    label: '',
    icon: '🚀',
    order: 1,
  });

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingItem(null);
    setFormData({
      value: 100,
      suffix: '+',
      label: '',
      icon: '🚀',
      order: counters.length + 1,
    });
    setError(null);
  };

  const openEditModal = (item: any) => {
    setIsCreating(false);
    setEditingItem(item);
    setFormData({
      value: item.value,
      suffix: item.suffix || '+',
      label: item.label,
      icon: item.icon || '🚀',
      order: item.order || 1,
    });
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این شمارنده اطمینان دارید؟')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/counters/?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در حذف');
      setSuccess('شمارنده با موفقیت حذف شد.');
      setTimeout(() => setSuccess(null), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'خطا در حذف');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/counters/';
      const method = isCreating ? 'POST' : 'PUT';
      const body = isCreating ? formData : { ...formData, id: editingItem?.id };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ذخیره‌سازی شمارنده');

      setEditingItem(null);
      setIsCreating(false);
      setSuccess(isCreating ? 'شمارنده جدید با موفقیت افزوده شد.' : 'شمارنده با موفقیت به‌روزرسانی شد.');
      setTimeout(() => setSuccess(null), 3000);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در ذخیره‌سازی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-400" />
            <span>شمارنده‌های آماری لندینگ و پردیس ۳D</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            شمارنده‌های ثبت‌شده در جدول public_landingcounter که آمار رضایت، تعداد پروژه‌ها و سوابق را نشان می‌دهند.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-brand-600/20"
        >
          <span>+</span>
          <span>افزودن شمارنده جدید</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {counters.map((c) => (
          <div
            key={c.id}
            className="glass-panel-elevated rounded-3xl p-6 border border-white/10 space-y-4 hover:border-brand-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.icon || '🚀'}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                    title="ویرایش"
                  >
                    <Edit className="w-3.5 h-3.5 text-brand-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
                    title="حذف"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
                  <span>{c.value}</span>
                  <span className="text-brand-400 text-xl">{c.suffix}</span>
                </div>
                <div className="text-xs font-bold text-gray-200 mt-1">{c.label}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-[10px] text-gray-500 font-mono">
              ترتیب نمایش: #{c.order}
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {(editingItem || isCreating) && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => { setEditingItem(null); setIsCreating(false); }}
        >
          <div
            className="w-full max-w-md bg-dark-base border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isCreating ? 'افزودن شمارنده آماری جدید' : 'ویرایش شمارنده آماری'}
              </h3>
              <button
                onClick={() => { setEditingItem(null); setIsCreating(false); }}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">مقدار عددی</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-brand-500 text-left dir-ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">پسوند (علامت)</label>
                  <input
                    type="text"
                    required
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="مثال: + یا ٪"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs text-center focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">عنوان و برچسب شمارنده</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">آیکون (ایموجی)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs text-center focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs text-center focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setEditingItem(null); setIsCreating(false); }}
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
                  <span>{isCreating ? 'ثبت شمارنده جدید' : 'ذخیره تغییرات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Star,
  Flame,
  Edit,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface ServicesTabProps {
  services: any[];
  onRefresh: () => void;
}

export default function ServicesTab({ services, onRefresh }: ServicesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: '⚡',
    short_description: '',
    description: '',
    price_start: 0,
    duration: '۳ تا ۴ هفته',
    difficulty: 'تخصصی',
    is_popular: false,
    is_featured: false,
    image: '',
  });

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      icon: '⚡',
      short_description: '',
      description: '',
      price_start: 0,
      duration: '۳ تا ۴ هفته',
      difficulty: 'تخصصی',
      is_popular: false,
      is_featured: false,
      image: '',
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      icon: service.icon || '⚡',
      short_description: service.short_description || '',
      description: service.description || '',
      price_start: service.price_start || 0,
      duration: service.duration || '۳ تا ۴ هفته',
      difficulty: service.difficulty || 'تخصصی',
      is_popular: service.is_popular,
      is_featured: service.is_featured,
      image: service.image || '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/services/';
      const method = editingService ? 'PUT' : 'POST';
      const payload = editingService ? { ...formData, id: editingService.id } : formData;

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
      setError(err.message || 'خطا در ذخیره خدمت');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این خدمت از دیتابیس اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/services/?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  const filtered = services.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return s.title?.toLowerCase().includes(term) || s.slug?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-brand-400" />
            <span>مدیریت خدمات آژانس ({services.length} خدمت فعال)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            خدمات ثبت‌شده در جدول service_service که در منوی ناوبری، اتاق‌های سه‌بعدی و صفحات اختصاصی نمایش داده می‌شوند.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن خدمت جدید</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجوی عنوان خدمت یا اسلاگ..."
          className="w-full pr-11 pl-4 py-3 rounded-2xl bg-dark-surface border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Services Table */}
      <div className="glass-panel-elevated rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-white/5 text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-bold">آیکون</th>
                <th className="py-3.5 px-4 font-bold">عنوان خدمت</th>
                <th className="py-3.5 px-4 font-bold">اسلاگ (URL)</th>
                <th className="py-3.5 px-4 font-bold">سطح و مدت</th>
                <th className="py-3.5 px-4 font-bold text-center">ویژگی‌ها</th>
                <th className="py-3.5 px-4 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 text-lg">{s.icon || '⚡'}</td>
                  <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                    {s.title}
                    {s.short_description && (
                      <span className="block text-[11px] font-normal text-gray-400 truncate">{s.short_description}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono dir-ltr text-brand-300 text-[11px]">{s.slug}</td>
                  <td className="py-3.5 px-4 text-gray-400">
                    <span className="block">{s.difficulty || 'تخصصی'}</span>
                    <span className="text-[10px] text-gray-500">{s.duration}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {s.is_featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-300" />
                          <span>ویژه</span>
                        </span>
                      )}
                      {s.is_popular && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>محبوب</span>
                        </span>
                      )}
                      {!s.is_featured && !s.is_popular && <span className="text-gray-500">-</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="w-3.5 h-3.5 text-brand-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-dark-base border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingService ? 'ویرایش اطلاعات خدمت' : 'افزودن خدمت جدید'}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-gray-300 font-semibold block">عنوان خدمت *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">آیکون (ایموجی یا نماد)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs text-center text-base focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">اسلاگ یکتا (انگلیسی) *</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">مدت زمان معمول</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="مثال: ۲ تا ۳ هفته"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block">درجه سختی / سطح</label>
                  <input
                    type="text"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    placeholder="مثال: پیشرفته و اختصاصی"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label="تصویر کاور و بنر خدمت"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="services"
                  hint="تصویر باکیفیت خدمت برای هدر صفحه اختصاصی و کارت خدمات"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">توضیحات کوتاه</label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">توضیحات جامع خدمت</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                  />
                  <span>نمایش در خدمات ویژه</span>
                </label>

                <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                  />
                  <span>نشانگر پرطرفدار</span>
                </label>
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
                  <span>{editingService ? 'ذخیره تغییرات' : 'ثبت خدمت'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

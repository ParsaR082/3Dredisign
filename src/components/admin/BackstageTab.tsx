'use client';

import React, { useState } from 'react';
import {
  Film,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Clock,
  X,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface BackstageTabProps {
  items: any[];
  categories: any[];
  settings?: any;
  onRefresh: () => void;
}

export default function BackstageTab({
  items = [],
  categories = [],
  settings,
  onRefresh,
}: BackstageTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    cover_image: '',
    location: 'ارومیه',
    duration_label: '۱ روز',
    status: 'completed',
    is_featured: false,
    order: 1,
    category_id: categories[0]?.id || 1,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      excerpt: '',
      cover_image: '',
      location: 'ارومیه',
      duration_label: '۱ روز',
      status: 'completed',
      is_featured: false,
      order: items.length + 1,
      category_id: categories[0]?.id || 1,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      subtitle: item.subtitle || '',
      excerpt: item.excerpt || '',
      cover_image: item.cover_image || '',
      location: item.location || 'ارومیه',
      duration_label: item.duration_label || '۱ روز',
      status: item.status || 'completed',
      is_featured: !!item.is_featured,
      order: item.order ?? 1,
      category_id: item.category_id || categories[0]?.id || 1,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/backstage/';
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem ? { id: editingItem.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطایی رخ داد.');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این رویداد پشت‌صحنه اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/backstage/?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
      else {
        const d = await res.json();
        alert(d.error || 'خطا در حذف');
      }
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-surface/50 border border-white/5 backdrop-blur-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-400" />
            <span>پشت‌صحنه و رخدادهای استودیو</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            مدیریت گالری، رویدادها، ضبط استودیو و پشت صحنه‌های اروم سیما ({items.length} مورد)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن رویداد جدید</span>
        </button>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const category = categories.find((c) => c.id === item.category_id);
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/30 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-medium">
                      {category?.name || 'عمومی'}
                    </span>
                    <h3 className="font-bold text-white text-sm leading-snug">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-xs text-brand-300 font-medium">{item.subtitle}</p>
                    )}
                  </div>
                  {item.is_featured && (
                    <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400" title="ویژه">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </span>
                  )}
                </div>

                {item.excerpt && (
                  <p className="text-xs text-gray-400 line-clamp-2">{item.excerpt}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-2 border-t border-white/5">
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      {item.location}
                    </span>
                  )}
                  {item.duration_label && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {item.duration_label}
                    </span>
                  )}
                  <span className="font-mono text-gray-500">#{item.order}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                  title="ویرایش"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="py-16 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/5">
          هیچ رویدادی در بخش پشت‌صحنه ثبت نشده است.
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-dark-base border border-white/10 rounded-2xl p-6 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-brand-400" />
                <span>{editingItem ? 'ویرایش رویداد' : 'افزودن رویداد پشت‌صحنه'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">عنوان رویداد *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug:
                          formData.slug ||
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w\u0600-\u06FF-]+/g, ''),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                    placeholder="مثال: تولید تیزر برند کاله"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">اسلاگ (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold">زیرعنوان</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  placeholder="مثال: پشت صحنه جلوه‌های ویژه و رندرینگ ۳D"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">دسته‌بندی</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-base border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">موقعیت مکانی</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold">توضیح کوتاه</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">آدرس تصویر کاور</label>
                  <input
                    type="text"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-500 focus:outline-none"
                    placeholder="/assets/backstage/..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-brand-500 focus:ring-0"
                  />
                  <span className="text-xs text-gray-300 font-semibold">نمایش در بخش ویژه</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30 disabled:opacity-50"
                >
                  {loading ? 'در حال ذخیره...' : editingItem ? 'بروزرسانی رویداد' : 'ایجاد رویداد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

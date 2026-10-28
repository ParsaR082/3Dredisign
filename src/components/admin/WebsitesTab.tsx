'use client';

import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Star,
  X,
  Code,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface WebsitesTabProps {
  websites: any[];
  categories: any[];
  onRefresh: () => void;
}

export default function WebsitesTab({ websites = [], categories = [], onRefresh }: WebsitesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    cover_image: '',
    live_url: '',
    client_name: '',
    industry: 'طراحی سایت و پرتال',
    year: 1403,
    accent_color: '#10B981',
    tech_stack_csv: 'Next.js, React, TailwindCSS',
    status: 'completed',
    is_featured: false,
    order: 1,
  });

  const handleOpenAdd = () => {
    setEditingWebsite(null);
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      excerpt: '',
      cover_image: '',
      live_url: 'https://',
      client_name: '',
      industry: 'فروشگاهی و شرکتی',
      year: 1403,
      accent_color: '#10B981',
      tech_stack_csv: 'Next.js, Three.js, PostgreSQL',
      status: 'completed',
      is_featured: false,
      order: websites.length + 1,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (w: any) => {
    setEditingWebsite(w);
    setFormData({
      title: w.title,
      slug: w.slug,
      subtitle: w.subtitle || '',
      excerpt: w.excerpt || '',
      cover_image: w.cover_image || '',
      live_url: w.live_url || '',
      client_name: w.client_name || '',
      industry: w.industry || 'طراحی وب',
      year: w.year || 1403,
      accent_color: w.accent_color || '#10B981',
      tech_stack_csv: w.tech_stack_csv || '',
      status: w.status || 'completed',
      is_featured: Boolean(w.is_featured),
      order: w.order || 1,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/websites/';
      const method = editingWebsite ? 'PUT' : 'POST';
      const payload = editingWebsite ? { ...formData, id: editingWebsite.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت وبسایت');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این وبسایت از آرشیو اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/websites/?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  const filtered = websites.filter((w) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return w.title?.toLowerCase().includes(term) || w.client_name?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-brand-400" />
            <span>پورتال وبسایت‌ها و وب‌اپلیکیشن‌ها ({websites.length} مورد)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            آرشیو پروژه‌های وب طراحی شده توسط آژانس اروم سیما
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در وبسایت‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 sm:w-64 bg-dark-card border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>وبسایت جدید</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((w) => (
          <div
            key={w.id}
            className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                  سال {w.year || 1403}
                </span>
                <div className="flex items-center gap-1.5">
                  {w.is_featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ویژه
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {w.industry}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">
                  {w.title}
                </h3>
                {w.client_name && (
                  <p className="text-xs text-brand-400/80 mt-0.5">کارفرما: {w.client_name}</p>
                )}
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{w.excerpt || w.subtitle}</p>
              </div>

              {/* Tech Stack */}
              {w.tech_stack_csv && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 pt-1">
                  <Code className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{w.tech_stack_csv}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              {w.live_url ? (
                <a
                  href={w.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>مشاهده زنده</span>
                </a>
              ) : (
                <span className="text-xs text-gray-500 italic">بدون لینک</span>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(w)}
                  className="p-1.5 text-gray-400 hover:text-brand-300 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="ویرایش"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingWebsite ? 'ویرایش وبسایت' : 'افزودن وبسایت جدید'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">عنوان وبسایت *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">اسلاگ URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">نام کارفرما / برند</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">لینک وبسایت زنده (Live URL)</label>
                  <input
                    type="text"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://client.com"
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">صنعت / حوزه فعالیت</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">سال اجرا</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">تکنولوژی‌های استفاده‌شده (CSV)</label>
                <input
                  type="text"
                  value={formData.tech_stack_csv}
                  onChange={(e) => setFormData({ ...formData, tech_stack_csv: e.target.value })}
                  placeholder="Next.js, Three.js, Tailwind, PostgreSQL"
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <ImageUpload
                  label="تصویر اسکرین‌شات و کاور وبسایت"
                  value={formData.cover_image}
                  onChange={(url) => setFormData({ ...formData, cover_image: url })}
                  folder="websites"
                  hint="پیش‌نمایش موکاپ یا تصویر شاخص صفحه اصلی وبسایت"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">توضیحات کوتاه</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-gray-300">نمایش در لیست ویژه</span>
                </label>
              </div>

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
                  {loading ? 'در حال ثبت...' : editingWebsite ? 'ذخیره تغییرات' : 'افزودن وبسایت'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Star,
  Flame,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  X,
  Check,
  Loader2,
  Globe,
  FileText,
  Monitor,
  TrendingUp,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface ProjectsTabProps {
  projects: any[];
  onRefresh: () => void;
}

type ModalTab = 'base' | 'content' | 'media' | 'metrics' | 'seo_geo';

export default function ProjectsTab({ projects, onRefresh }: ProjectsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('base');
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [industries, setIndustries] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/projects/')
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategories(d.categories);
        if (d.industries) setIndustries(d.industries);
      })
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    detailed_description: '',
    challenge: '',
    featured: false,
    popular: false,
    is_active: true,
    project_date: new Date().toISOString().split('T')[0],
    category_id: '' as string | number,
    industry_id: '' as string | number,
    website_url: '',
    pdf_url: '',
    thumbnail_image: '',
    desktop_mockup: '',
    tablet_mockup: '',
    mobile_mockup: '',
    kpi_data: '',
    timeline_steps: '',
    roi_cost: '',
    roi_revenue: '',
    roi_percentage: '',
    location_zone: 'مرکز شهر',
    latitude: '',
    longitude: '',
    show_on_map: false,
    meta_title: '',
    meta_description: '',
    order: '1',
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setActiveModalTab('base');
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      detailed_description: '',
      challenge: '',
      featured: false,
      popular: false,
      is_active: true,
      project_date: new Date().toISOString().split('T')[0],
      category_id: categories[0]?.id || '',
      industry_id: industries[0]?.id || '',
      website_url: '',
      pdf_url: '',
      thumbnail_image: '',
      desktop_mockup: '',
      tablet_mockup: '',
      mobile_mockup: '',
      kpi_data: '',
      timeline_steps: '',
      roi_cost: '',
      roi_revenue: '',
      roi_percentage: '',
      location_zone: 'مرکز شهر',
      latitude: '',
      longitude: '',
      show_on_map: false,
      meta_title: '',
      meta_description: '',
      order: '1',
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setActiveModalTab('base');
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      subtitle: project.subtitle || '',
      description: project.description || '',
      detailed_description: project.detailed_description || '',
      challenge: project.challenge || '',
      featured: Boolean(project.featured),
      popular: Boolean(project.popular),
      is_active: project.is_active !== undefined ? Boolean(project.is_active) : true,
      project_date: project.project_date || new Date().toISOString().split('T')[0],
      category_id: project.category_id || (categories[0]?.id || ''),
      industry_id: project.industry_id || (industries[0]?.id || ''),
      website_url: project.website_url || '',
      pdf_url: project.pdf_url || '',
      thumbnail_image: project.thumbnail_image || '',
      desktop_mockup: project.desktop_mockup || '',
      tablet_mockup: project.tablet_mockup || '',
      mobile_mockup: project.mobile_mockup || '',
      kpi_data: project.kpi_data ? (typeof project.kpi_data === 'string' ? project.kpi_data : JSON.stringify(project.kpi_data, null, 2)) : '',
      timeline_steps: project.timeline_steps ? (typeof project.timeline_steps === 'string' ? project.timeline_steps : JSON.stringify(project.timeline_steps, null, 2)) : '',
      roi_cost: project.roi_cost != null ? String(project.roi_cost) : '',
      roi_revenue: project.roi_revenue != null ? String(project.roi_revenue) : '',
      roi_percentage: project.roi_percentage != null ? String(project.roi_percentage) : '',
      location_zone: project.location_zone || 'مرکز شهر',
      latitude: project.latitude != null ? String(project.latitude) : '',
      longitude: project.longitude != null ? String(project.longitude) : '',
      show_on_map: Boolean(project.show_on_map),
      meta_title: project.meta_title || '',
      meta_description: project.meta_description || '',
      order: String(project.order || 1),
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/projects/';
      const method = editingProject ? 'PUT' : 'POST';
      const payload = editingProject ? { ...formData, id: editingProject.id } : formData;

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
    if (!confirm('آیا از حذف این پروژه از دیتابیس اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/projects/?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  const filtered = projects.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.title?.toLowerCase().includes(term) || p.slug?.toLowerCase().includes(term);
  });

  const top4TvIds = React.useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.order || 0) - (b.order || 0);
    });
    return sorted.slice(0, 4).map((p) => p.id);
  }, [projects]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-brand-400" />
            <span>مدیریت نمونه‌کارها و پروژه‌ها</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            پروژه‌ها به همراه موکاپ‌ها، پیش‌نمایش زنده، گالری و اطلاعات فنی کامل
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در پروژه‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-dark-surface border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="shrink-0 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-brand-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن پروژه جدید</span>
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-semibold">
                <th className="py-3.5 px-4">کاور</th>
                <th className="py-3.5 px-4">عنوان و شعار</th>
                <th className="py-3.5 px-4">اسلاگ یکتا</th>
                <th className="py-3.5 px-4 text-center">مانیتور ۳بعدی</th>
                <th className="py-3.5 px-4 text-center">وب‌سایت زنده</th>
                <th className="py-3.5 px-4 text-center">وضعیت</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((proj) => {
                const tvStationIndex = top4TvIds.indexOf(proj.id);
                return (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 w-16">
                      {proj.thumbnail_image ? (
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-dark-surface border border-white/10">
                          <img
                            src={proj.thumbnail_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500 text-[10px]">بدون تصویر</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                      <a
                        href={`/portfolio/${proj.slug}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-brand-300 transition-colors"
                      >
                        {proj.title}
                      </a>
                      {proj.subtitle && (
                        <span className="block text-[11px] font-normal text-gray-400 truncate">
                          {proj.subtitle}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono dir-ltr text-brand-300 text-[11px]">
                      {proj.slug}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {tvStationIndex !== -1 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>مانیتور {tvStationIndex + 1}</span>
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {proj.website_url ? (
                        <a
                          href={proj.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[11px] font-mono"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>فعال</span>
                        </a>
                      ) : (
                        <span className="text-gray-500 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {proj.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-300" />
                            <span>ویژه</span>
                          </span>
                        )}
                        {proj.popular && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            <span>محبوب</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="ویرایش"
                        >
                          <Edit className="w-3.5 h-3.5 text-brand-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── COMPREHENSIVE ADD/EDIT MODAL ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-dark-base border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProject ? `ویرایش پروژه: ${editingProject.title}` : 'افزودن نمونه‌کار جدید'}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  تمام فیلدهای پرشده در صفحه جزئیات نمایش داده می‌شوند و بخش‌های خالی به طور خودکار مخفی می‌مانند.
                </p>
              </div>
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

            {/* Modal Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveModalTab('base')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeModalTab === 'base'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ۱. مشخصات اصلی
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('content')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeModalTab === 'content'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ۲. شرح و چالش
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('media')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeModalTab === 'media'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ۳. لینک‌ها و موکاپ‌ها
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('metrics')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeModalTab === 'metrics'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ۴. شاخص‌ها و مالی (ROI)
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('seo_geo')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeModalTab === 'seo_geo'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ۵. موقعیت و سئو
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* ── TAB 1: BASE INFO ── */}
              {activeModalTab === 'base' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">عنوان کامل پروژه *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">اسلاگ یکتا (URL Slug) *</label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-semibold block">زیرعنوان / شعار پروژه</label>
                    <input
                      type="text"
                      placeholder="مثال: برند تخصصی واردات خودروهای سواری و سنگین"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">دسته‌بندی اصلی</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">صنعت و حوزه فعالیت</label>
                      <select
                        value={formData.industry_id}
                        onChange={(e) => setFormData({ ...formData, industry_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                      >
                        {industries.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">تاریخ انجام پروژه</label>
                      <input
                        type="date"
                        value={formData.project_date}
                        onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-white/5">
                    <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                      />
                      <span>پروژه ویژه (Featured)</span>
                    </label>

                    <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.popular}
                        onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                      />
                      <span>پروژه پرطرفدار (Popular)</span>
                    </label>

                    <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                      />
                      <span>فعال و قابل نمایش</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── TAB 2: CONTENT & CHALLENGE ── */}
              {activeModalTab === 'content' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-semibold block">توضیح کوتاه (برای کارت‌ها و پیش‌نمایش گرید)</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-semibold block">شرح کامل و داستان پروژه (Full Story)</label>
                    <textarea
                      rows={6}
                      value={formData.detailed_description}
                      onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                      placeholder="متن مشروح، اهداف پروژه، راهکارهای پیاده‌سازی شده و نتایج کیفی..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-semibold block">چالش اصلی و راه‌حل مهندسی (اختیاری)</label>
                    <textarea
                      rows={3}
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      placeholder="مثال: الزام به زمان لود زیر ۱ ثانیه با وجود ویدیوهای باکیفیت و خطوط سنگین..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* ── TAB 3: MEDIA & MOCKUPS ── */}
              {activeModalTab === 'media' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span>آدرس وب‌سایت زنده پروژه (Live Website URL)</span>
                      </label>
                      <input
                        type="url"
                        dir="ltr"
                        placeholder="https://altinpasha.ir/"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                      />
                      <span className="text-[10px] text-gray-500">
                        در صورت وارد شدن، پیش‌نمایش تعاملی (Iframe) در صفحه جزئیات فعال می‌شود.
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-teal-400" />
                        <span>آدرس فایل کاتالوگ PDF (اختیاری)</span>
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="/media/catalogs/altin.pdf"
                        value={formData.pdf_url}
                        onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                      />
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <ImageUpload
                    label="تصویر کاور و بندانگشتی اصلی (Thumbnail & 3D TV Image)"
                    value={formData.thumbnail_image}
                    onChange={(url) => setFormData({ ...formData, thumbnail_image: url })}
                    folder="portfolio"
                  />

                  {/* 3 Mockup Inputs */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <h4 className="font-bold text-white text-xs">موکاپ‌های سه‌گانه اختصاصی (دسکتاپ، تبلت، موبایل)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-gray-400 text-[11px] block">موکاپ دسکتاپ</label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="portfolio/mockups/desktop/..."
                          value={formData.desktop_mockup}
                          onChange={(e) => setFormData({ ...formData, desktop_mockup: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-white text-[11px] font-mono text-left"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-gray-400 text-[11px] block">موکاپ تبلت</label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="portfolio/mockups/tablet/..."
                          value={formData.tablet_mockup}
                          onChange={(e) => setFormData({ ...formData, tablet_mockup: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-white text-[11px] font-mono text-left"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-gray-400 text-[11px] block">موکاپ موبایل</label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="portfolio/mockups/mobile/..."
                          value={formData.mobile_mockup}
                          onChange={(e) => setFormData({ ...formData, mobile_mockup: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-white text-[11px] font-mono text-left"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 4: METRICS & ROI ── */}
              {activeModalTab === 'metrics' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-semibold block">شاخص‌های کلیدی عملکرد KPI (فرمت JSON)</label>
                    <textarea
                      rows={3}
                      dir="ltr"
                      placeholder={`[{"label": "رشد ارگانیک", "value": "+240%", "detail": "در ۶ ماه نخست"}]`}
                      value={formData.kpi_data}
                      onChange={(e) => setFormData({ ...formData, kpi_data: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs font-mono text-left focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-semibold block">مراحل و گام‌های پروژه Timeline (فرمت JSON)</label>
                    <textarea
                      rows={3}
                      dir="ltr"
                      placeholder={`[{"date": "1403/07", "title": "تحقیقات و وایرفریم", "description": "بررسی نیازهای مخاطب"}]`}
                      value={formData.timeline_steps}
                      onChange={(e) => setFormData({ ...formData, timeline_steps: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs font-mono text-left focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <h4 className="font-bold text-white text-xs">تحلیل بازگشت سرمایه (ROI Analysis)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-gray-400 text-[11px] block">درصد ROI (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="مثال: 47.5"
                          value={formData.roi_percentage}
                          onChange={(e) => setFormData({ ...formData, roi_percentage: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-gray-400 text-[11px] block">هزینه سرمایه‌گذاری (تومان)</label>
                        <input
                          type="number"
                          placeholder="مثال: 50000000"
                          value={formData.roi_cost}
                          onChange={(e) => setFormData({ ...formData, roi_cost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-gray-400 text-[11px] block">درآمد حاصله (تومان)</label>
                        <input
                          type="number"
                          placeholder="مثال: 85000000"
                          value={formData.roi_revenue}
                          onChange={(e) => setFormData({ ...formData, roi_revenue: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 5: SEO & GEO ── */}
              {activeModalTab === 'seo_geo' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">منطقه جغرافیایی (ارومیه)</label>
                      <input
                        type="text"
                        placeholder="مثال: مرکز شهر، شهرک صنعتی فاز ۲"
                        value={formData.location_zone}
                        onChange={(e) => setFormData({ ...formData, location_zone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">عرض جغرافیایی (Latitude)</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="37.5518"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">طول جغرافیایی (Longitude)</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="45.0782"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">عنوان اختصاصی سئو (Meta Title)</label>
                      <input
                        type="text"
                        placeholder="طراحی وب‌سایت التین پاشا در ارومیه | اروم‌سیما"
                        value={formData.meta_title}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold block">توضیحات متای سئو (Meta Description)</label>
                      <textarea
                        rows={2}
                        placeholder="توضیحات کوتاه جذاب جهت ایندکس در موتورهای جستجو گوگل..."
                        value={formData.meta_description}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[11px] text-gray-500">
                  فیلدهای خالی به طور خودکار در ظاهر سایت نمایش داده نمی‌شوند.
                </span>

                <div className="flex items-center gap-3">
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
                    <span>{editingProject ? 'ذخیره تغییرات' : 'ثبت پروژه'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

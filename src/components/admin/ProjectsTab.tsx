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
  Layers,
  Image as ImageIcon,
  Tag,
  Eye,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface ProjectsTabProps {
  projects: any[];
  onRefresh: () => void;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  cover_image?: string | null;
  description?: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

type ModalTab = 'base' | 'content' | 'media' | 'metrics' | 'seo_geo';

export default function ProjectsTab({ projects, onRefresh }: ProjectsTabProps) {
  const [activeSection, setActiveSection] = useState<'projects' | 'categories'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('base');
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [industries, setIndustries] = useState<{ id: number; name: string }[]>([]);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  const [catFormData, setCatFormData] = useState({
    name: '',
    slug: '',
    cover_image: '',
    description: '',
    icon: 'folder',
    order: '1',
    is_active: true,
    is_featured: false,
  });

  const fetchCategoriesAndIndustries = () => {
    fetch('/api/admin/projects/')
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategories(d.categories);
        if (d.industries) setIndustries(d.industries);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCategoriesAndIndustries();
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
    additional_category_ids: [] as number[],
  });

  // Category Modal Handlers
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCatFormData({
      name: '',
      slug: '',
      cover_image: '',
      description: '',
      icon: 'folder',
      order: String(categories.length + 1),
      is_active: true,
      is_featured: false,
    });
    setCatError(null);
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setCatFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      cover_image: cat.cover_image || '',
      description: cat.description || '',
      icon: cat.icon || 'folder',
      order: String(cat.order || 1),
      is_active: cat.is_active !== undefined ? Boolean(cat.is_active) : true,
      is_featured: Boolean(cat.is_featured),
    });
    setCatError(null);
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatLoading(true);
    setCatError(null);

    try {
      const url = '/api/admin/projects/';
      const method = editingCategory ? 'PUT' : 'POST';
      const payload = {
        type: 'category',
        ...(editingCategory ? { id: editingCategory.id } : {}),
        ...catFormData,
        order: Number(catFormData.order) || 1,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ذخیره دسته‌بندی');

      setCategoryModalOpen(false);
      fetchCategoriesAndIndustries();
      onRefresh();
    } catch (err: any) {
      setCatError(err.message || 'خطا در ثبت دسته‌بندی');
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: AdminCategory) => {
    if (
      !confirm(
        `آیا از حذف دسته‌بندی "${cat.name}" اطمینان دارید؟\nدر صورت وجود پروژه در این دسته‌بندی، پروژه‌ها به یک دسته‌بندی دیگر منتقل خواهند شد.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/projects/?id=${cat.id}&type=category`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در حذف دسته‌بندی');
      fetchCategoriesAndIndustries();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'خطا در حذف دسته‌بندی');
    }
  };

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
      additional_category_ids: [],
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
      additional_category_ids: Array.isArray(project.additional_category_ids) ? project.additional_category_ids : [],
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

  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  const filteredCategories = categories.filter((c) => {
    if (!categorySearchTerm) return true;
    const term = categorySearchTerm.toLowerCase();
    return c.name?.toLowerCase().includes(term) || c.slug?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switcher between Projects and Categories */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl glass-panel border border-white/10">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSection('projects')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSection === 'projects'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>پروژه‌ها و نمونه‌کارها ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('categories')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSection === 'categories'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مدیریت دسته‌بندی‌ها ({categories.length})</span>
          </button>
        </div>

        {/* Action Buttons based on active section */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {activeSection === 'projects' ? (
            <>
              <div className="relative flex-1 sm:w-60">
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
                onClick={openCreateCategoryModal}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-brand-300 text-xs font-bold flex items-center gap-1.5 transition-all border border-brand-500/20"
                title="افزودن سریع دسته‌بندی"
              >
                <Layers className="w-4 h-4 text-brand-400" />
                <span className="hidden md:inline">دسته‌بندی جدید</span>
              </button>

              <button
                onClick={openCreateModal}
                className="shrink-0 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-brand-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن پروژه جدید</span>
              </button>
            </>
          ) : (
            <>
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در دسته‌بندی‌ها..."
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-xl bg-dark-surface border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                onClick={openCreateCategoryModal}
                className="shrink-0 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-brand-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن دسته‌بندی جدید</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── SECTION 1: PROJECTS TABLE ── */}
      {activeSection === 'projects' && (
        <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-semibold">
                  <th className="py-3.5 px-4">کاور</th>
                  <th className="py-3.5 px-4">عنوان و شعار</th>
                  <th className="py-3.5 px-4">دسته‌بندی‌ها</th>
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
                  const primaryCat = categories.find((c) => c.id === proj.category_id);
                  const addCats = (proj.additional_category_ids || [])
                    .map((id: number) => categories.find((c) => c.id === id))
                    .filter(Boolean);

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

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[10px] font-semibold">
                            {primaryCat?.name || 'اصلی'}
                          </span>
                          {addCats.map((ac: any) => (
                            <span
                              key={ac.id}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[9px] font-medium"
                              title={`دسته‌بندی مکمل: ${ac.name}`}
                            >
                              +{ac.name}
                            </span>
                          ))}
                        </div>
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
      )}

      {/* ── SECTION 2: CATEGORIES MANAGEMENT TABLE ── */}
      {activeSection === 'categories' && (
        <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-semibold">
                  <th className="py-3.5 px-4">تصویر کاور</th>
                  <th className="py-3.5 px-4">نام دسته‌بندی</th>
                  <th className="py-3.5 px-4">اسلاگ یکتا</th>
                  <th className="py-3.5 px-4 text-center">آیکون</th>
                  <th className="py-3.5 px-4 text-center">ترتیب</th>
                  <th className="py-3.5 px-4 text-center">پروژه‌های متصل</th>
                  <th className="py-3.5 px-4 text-center">وضعیت</th>
                  <th className="py-3.5 px-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      دسته‌بندی‌ای یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => {
                    const primaryCount = projects.filter((p) => p.category_id === cat.id).length;
                    const additionalCount = projects.filter(
                      (p) => p.category_id !== cat.id && p.additional_category_ids?.includes(cat.id)
                    ).length;
                    const totalCount = primaryCount + additionalCount;

                    return (
                      <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 w-20">
                          {cat.cover_image ? (
                            <div className="w-14 h-9 rounded-lg overflow-hidden bg-dark-surface border border-white/10 relative group">
                              <img
                                src={cat.cover_image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-[10px]">
                              بدون کاور
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-white max-w-xs">
                          <div className="flex items-center gap-2">
                            <span>{cat.name}</span>
                          </div>
                          {cat.description && (
                            <span className="block text-[11px] font-normal text-gray-400 line-clamp-1 mt-0.5">
                              {cat.description}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono dir-ltr text-brand-300 text-[11px]">
                          {cat.slug}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-gray-400">
                          {cat.icon || 'folder'}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-gray-300">
                          {cat.order || 1}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] font-mono"
                            title={`${primaryCount} پروژه اصلی + ${additionalCount} پروژه مکمل`}
                          >
                            <span className="font-bold text-brand-300">{totalCount}</span>
                            <span className="text-[10px] text-gray-400">پروژه</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {cat.is_featured && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-300" />
                                <span>ویژه</span>
                              </span>
                            )}
                            {cat.is_active !== false ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                فعال
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                                غیرفعال
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                              title="ویرایش دسته‌بندی"
                            >
                              <Edit className="w-3.5 h-3.5 text-brand-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                              title="حذف دسته‌بندی"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

                  {/* Multi-Category (Additional Categories) Selector */}
                  <div className="space-y-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-200 font-semibold text-xs flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-brand-400" />
                        <span>دسته‌بندی‌های مکمل / چندگانه (اختیاری)</span>
                      </label>
                      <span className="text-[11px] text-brand-300 font-mono">
                        {formData.additional_category_ids.length > 0
                          ? `${formData.additional_category_ids.length} دسته‌بندی مکمل انتخاب شده`
                          : 'بدون دسته‌بندی مکمل'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      اگر این پروژه در چندین زمینه انجام شده (مثلاً هم سایت و هم برندسازی و هویت بصری)، دسته‌بندی‌های دیگر را از لیست زیر انتخاب کنید:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {categories
                        .filter((c) => String(c.id) !== String(formData.category_id))
                        .map((c) => {
                          const isChecked = formData.additional_category_ids.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                const next = isChecked
                                  ? formData.additional_category_ids.filter((id) => id !== c.id)
                                  : [...formData.additional_category_ids, c.id];
                                setFormData({ ...formData, additional_category_ids: next });
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                                isChecked
                                  ? 'bg-brand-600/30 border-brand-500 text-brand-200 shadow-sm'
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                                  isChecked ? 'bg-brand-500 text-white font-bold' : 'border border-gray-500'
                                }`}
                              >
                                {isChecked ? '✓' : ''}
                              </span>
                              <span>{c.name}</span>
                            </button>
                          );
                        })}
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
                      <label className="text-gray-300 font-semibold flex items-center gap-1.5">
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
                      <label className="text-gray-300 font-semibold flex items-center gap-1.5">
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

      {/* ── CATEGORY ADD/EDIT MODAL ── */}
      {categoryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setCategoryModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-dark-base border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-400" />
                  <span>
                    {editingCategory
                      ? `ویرایش دسته‌بندی: ${editingCategory.name}`
                      : 'افزودن دسته‌بندی جدید نمونه‌کارها'}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  دسته‌بندی‌ها به شما امکان می‌دهند پروژه‌ها را به صورت تک یا چندگانه گروه‌بندی کنید.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {catError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                {catError}
              </div>
            )}

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block text-xs">
                    نام دسته‌بندی *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: طراحی وبسایت و فروشگاه آنلاین"
                    value={catFormData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      if (!editingCategory) {
                        const autoSlug = name.trim().toLowerCase().replace(/\s+/g, '-');
                        setCatFormData({ ...catFormData, name, slug: autoSlug });
                      } else {
                        setCatFormData({ ...catFormData, name });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block text-xs">
                    اسلاگ یکتا (URL Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="مثال: web-design"
                    value={catFormData.slug}
                    onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 text-left font-mono"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="pt-2">
                <ImageUpload
                  label="تصویر کاور اختصاصی دسته‌بندی (Cover Image)"
                  value={catFormData.cover_image}
                  onChange={(url) => setCatFormData({ ...catFormData, cover_image: url })}
                  folder="categories"
                  hint="این عکس در بخش بالای ویترین نمونه‌کارها به عنوان بنر کارت دسته‌بندی استفاده می‌شود."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block text-xs">
                  شرح و معرفی کوتاه دسته‌بندی
                </label>
                <textarea
                  rows={2}
                  placeholder="توضیح کوتاه درباره ماهیت پروژه‌های این دسته..."
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block text-xs">
                    آیکون دسته‌بندی
                  </label>
                  <select
                    value={catFormData.icon}
                    onChange={(e) => setCatFormData({ ...catFormData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="folder">folder (پوشه عمومی)</option>
                    <option value="globe">globe (وب و اینترنت)</option>
                    <option value="palette">palette (طراحی و هنر)</option>
                    <option value="sparkles">sparkles (خلاقیت و مارکتینگ)</option>
                    <option value="video">video (تیزر و فیلمبرداری)</option>
                    <option value="layers">layers (چندلایه و ساختار)</option>
                    <option value="megaphone">megaphone (تبلیغات محیطی)</option>
                    <option value="search">search (سئو و بهینه‌سازی)</option>
                    <option value="trending-up">trending-up (رشد کسب‌وکار)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-semibold block text-xs">
                    ترتیب نمایش (اولویت عددی)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={catFormData.order}
                    onChange={(e) => setCatFormData({ ...catFormData, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-surface border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-white/5">
                <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={catFormData.is_featured}
                    onChange={(e) => setCatFormData({ ...catFormData, is_featured: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                  />
                  <span>دسته‌بندی ویژه (Featured)</span>
                </label>

                <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={catFormData.is_active}
                    onChange={(e) => setCatFormData({ ...catFormData, is_active: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 bg-dark-surface"
                  />
                  <span>فعال و قابل مشاهده در سایت</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={catLoading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/30"
                >
                  {catLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingCategory ? 'ذخیره تغییرات دسته‌بندی' : 'ثبت دسته‌بندی'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

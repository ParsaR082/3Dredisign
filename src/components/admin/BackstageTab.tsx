'use client';

import React, { useState, useRef } from 'react';
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
  Video,
  Upload,
  Play,
  ExternalLink,
  FolderPlus,
  AlertCircle,
  Eye,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

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
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewVideoItem, setPreviewVideoItem] = useState<any | null>(null);

  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    body: '',
    cover_image: '',
    cover_video: '',
    embed_url: '',
    location: 'ارومیه',
    duration_label: '۰۰:۴۵ | 4K 60fps',
    status: 'published',
    is_featured: false,
    order: 1,
    category_id: categories[0]?.id || 1,
  });

  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    slug: '',
    description: '',
    order: (categories.length || 0) + 1,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      excerpt: '',
      body: '',
      cover_image: '',
      cover_video: '',
      embed_url: '',
      location: 'ارومیه',
      duration_label: '۰۰:۴۵ | 4K 60fps',
      status: 'published',
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
      body: item.body || '',
      cover_image: item.cover_image || '',
      cover_video: item.cover_video || '',
      embed_url: item.embed_url || '',
      location: item.location || 'ارومیه',
      duration_label: item.duration_label || '۰۰:۴۵ | 4K 60fps',
      status: item.status || 'published',
      is_featured: Boolean(item.is_featured),
      order: item.order ?? 1,
      category_id: item.category_id || categories[0]?.id || 1,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('لطفاً یک فایل ویدیویی معتبر (MP4, WebM, MOV) انتخاب کنید.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('حجم ویدیو بیشتر از حد مجاز است (حداکثر ۱۰۰ مگابایت).');
      return;
    }

    setVideoUploading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'backstage');

      const res = await fetch('/api/admin/upload/', {
        method: 'POST',
        body: data,
      });

      let json: any = {};
      try {
        json = await res.json();
      } catch {
        if (res.status === 413) {
          throw new Error('حجم فایل بیشتر از سقف مجاز وب‌سرور (Nginx) است (خطای 413). لطفاً حجم ویدیو را به زیر ۵۰ مگابایت کاهش دهید.');
        }
        throw new Error(`خطای سرور (${res.status}). امکان ذخیره ویدیو وجود ندارد.`);
      }
      if (!res.ok) throw new Error(json.error || 'خطا در آپلود ویدیو');

      setFormData((prev) => ({
        ...prev,
        cover_video: json.url,
      }));
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال فایل ویدیو');
    } finally {
      setVideoUploading(false);
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
    }
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
    if (!confirm('آیا از حذف این رویداد پشت‌صحنه اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) return;
    try {
      const res = await fetch(`/api/admin/backstage/?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
      else {
        const d = await res.json();
        alert(d.error || 'خطا در حذف');
      }
    } catch (_) {}
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryData.name.trim()) return;

    try {
      const res = await fetch('/api/admin/backstage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'category',
          name: newCategoryData.name.trim(),
          slug: newCategoryData.slug.trim() || newCategoryData.name.trim().toLowerCase().replace(/\s+/g, '-'),
          excerpt: newCategoryData.description.trim(),
          order: Number(newCategoryData.order) || 1,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'خطا در ایجاد دسته‌بندی');
      }

      setCategoryModalOpen(false);
      setNewCategoryData({ name: '', slug: '', description: '', order: (categories.length || 0) + 2 });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت دسته‌بندی');
    }
  };

  const handleDeleteCategory = async (catId: number, catName: string) => {
    if (!confirm(`آیا از حذف دسته‌بندی «${catName}» اطمینان دارید؟`)) return;
    try {
      const res = await fetch(`/api/admin/backstage/?id=${catId}&type=category`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      } else {
        const d = await res.json();
        alert(d.error || 'خطا در حذف دسته‌بندی');
      }
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-surface/50 border border-white/5 backdrop-blur-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-400" />
            <span>مدیریت ویدیوها و پشت‌صحنه فیلمبرداری</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            ویدیوهای عمودی (۹:۱۶)، ریلزهای پشت دوربین، مشخصات شات و تجهیزات پروژه‌ها ({items.length} آیتم فعال در دیتابیس)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 transition-all"
          >
            <FolderPlus className="w-4 h-4 text-brand-400" />
            <span>مدیریت دسته‌ها ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن ویدیوی جدید</span>
          </button>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item) => {
          const category = categories.find((c) => c.id === item.category_id);
          const hasVideo = Boolean(item.cover_video);
          const hasEmbed = Boolean(item.embed_url);

          return (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-dark-card/70 border border-white/10 hover:border-brand-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Vertical Card Poster Header (9:16 Aspect ratio preview) */}
              <div className="relative aspect-[9/12] w-full overflow-hidden bg-black">
                {item.cover_image ? (
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-dark-base text-gray-500 p-4 text-center">
                    <Film className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-[11px]">بدون تصویر کاور</span>
                  </div>
                )}

                {/* Director's Viewfinder Badges */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                  {hasVideo ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-brand-950 text-[10px] font-black shadow-md backdrop-blur-sm">
                      <Video className="w-3 h-3" />
                      <span>ویدیو اختصاصی سایت</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-700/80 text-gray-200 text-[10px] font-medium backdrop-blur-sm">
                      فقط کاور
                    </span>
                  )}

                  {item.is_featured && (
                    <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30" title="ویژه">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-gray-300 font-mono backdrop-blur-sm">
                    #{item.order}
                  </span>
                </div>

                {/* Quick Play Trigger (if has video or image) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => {
                      setPreviewVideoItem(item);
                      setPreviewModalOpen(true);
                    }}
                    className="w-12 h-12 rounded-full bg-brand-500 text-brand-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                    title="پیش‌نمایش ویدیو و مانیتور"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>

                {/* Bottom HUD overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-brand-400 truncate">
                    {category?.name || 'بدون دسته‌بندی'}
                  </span>
                  <h3 className="font-bold text-white text-xs leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  {item.subtitle && (
                    <p className="text-[11px] text-gray-300 line-clamp-1">{item.subtitle}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 pt-1">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" />
                        <span className="truncate max-w-[110px]">{item.location}</span>
                      </span>
                    )}
                    {item.duration_label && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-brand-400" />
                        <span>{item.duration_label}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      setPreviewVideoItem(item);
                      setPreviewModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>پیش‌نمایش</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                      title="ویرایش ویدیوی پشت‌صحنه"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all"
                      title="حذف ویدیو"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="py-20 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/5 space-y-3">
          <Film className="w-10 h-10 mx-auto text-gray-500" />
          <p className="text-sm font-semibold text-gray-300">هیچ ویدیوی پشت‌صحنه‌ای در دیتابیس ثبت نشده است.</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30"
          >
            افزودن اولین ویدیو
          </button>
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-dark-base border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingItem ? 'ویرایش ویدیوی پشت‌صحنه' : 'افزودن ویدیوی جدید پشت‌صحنه'}
                  </h3>
                  <p className="text-[11px] text-gray-400">تنظیمات مانیتور کارگردانی، ویدیو عمودی ۹:۱۶ و مشخصات شات</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">عنوان ویدیو / پروژه *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData({
                        ...formData,
                        title: newTitle,
                        slug:
                          formData.slug ||
                          newTitle
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w\u0600-\u06FF-]+/g, ''),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                    placeholder="مثال: پشت صحنه تیزر صنعتی سپید بام گستر"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">اسلاگ (URL) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-500 focus:outline-none"
                    placeholder="bts-sepid-bam-gostar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">دسته‌بندی پشت‌صحنه</label>
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
                  <label className="text-xs text-gray-300 font-semibold">موقعیت مکانی تصویربرداری</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                    placeholder="ارومیه، شهرک صنعتی فاز ۲"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">زیرعنوان / تجهیزات</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                    placeholder="تصویربرداری FPV و تجهیزات نورپردازی سینمایی"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">مشخصات شات / زمان‌بندی HUD</label>
                  <input
                    type="text"
                    value={formData.duration_label}
                    onChange={(e) => setFormData({ ...formData, duration_label: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-500 focus:outline-none"
                    placeholder="۰۰:۴۵ | 4K 60fps"
                  />
                </div>
              </div>

              {/* Video File / URL Section */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-white font-bold flex items-center gap-2">
                    <Video className="w-4 h-4 text-brand-400" />
                    <span>فایل ویدیوی عمودی (MP4 / WebM / MOV)</span>
                  </label>
                  <span className="text-[10px] text-gray-400">حداکثر ۱۰۰ مگابایت</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={videoUploading}
                    onClick={() => videoFileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{videoUploading ? 'در حال بارگذاری ویدیو...' : 'انتخاب و آپلود فایل ویدیو'}</span>
                  </button>

                  <div className="w-full flex-1">
                    <input
                      type="text"
                      value={formData.cover_video}
                      onChange={(e) => setFormData({ ...formData, cover_video: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-dark-base border border-white/10 text-white text-xs font-mono focus:border-brand-500 focus:outline-none"
                      placeholder="یا آدرس مستقیم فایل MP4: /media/uploads/backstage/video.mp4"
                    />
                  </div>
                </div>

                {formData.cover_video && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
                      <span className="font-mono text-[11px] truncate max-w-[350px]">
                        {formData.cover_video}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_video: '' })}
                        className="text-rose-400 hover:text-rose-300 text-[11px] font-bold"
                      >
                        حذف ویدیو
                      </button>
                    </div>
                    <div className="relative aspect-[9/16] max-h-48 rounded-xl overflow-hidden bg-black border border-white/10 mx-auto flex items-center justify-center">
                      <video
                        src={formData.cover_video}
                        controls
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Image Upload (Poster) */}
              <div>
                <ImageUpload
                  label="تصویر کاور عمودی (پوستر ویزور دوربین ۹:۱۶)"
                  value={formData.cover_image}
                  onChange={(url) => setFormData({ ...formData, cover_image: url })}
                  folder="backstage"
                  hint="تصویر کاور عمودی با ابعاد ایده‌آل 1080x1920 یا فرمت ۹:۱۶ برای نمایش در مانیتور کارگردانی"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold">یادداشت کوتاه کارگردانی (Excerpt)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  placeholder="خلاصه روایت و اتفاقات رخ داده در پشت دوربین..."
                />
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold">شرح کامل سناریو و چالش‌های فنی (Body)</label>
                <textarea
                  rows={3}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  placeholder="توضیحات تکمیلی پیرامون نورپردازی، لنزها، هدایت عوامل و تجهیزات به کار رفته..."
                />
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold">وضعیت انتشار</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-base border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="published">منتشر شده (Published)</option>
                    <option value="draft">پیش‌نویس (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Is Featured */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-brand-500 focus:ring-0"
                  />
                  <span className="text-xs text-gray-300 font-semibold">علامت‌گذاری به عنوان ویدیوی ویژه (Featured)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading || videoUploading}
                  className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/30 disabled:opacity-50"
                >
                  {loading ? 'در حال ذخیره...' : editingItem ? 'بروزرسانی تغییرات' : 'ذخیره و انتشار ویدیو'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Management Modal */}
      {categoryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setCategoryModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-dark-base border border-white/10 rounded-3xl p-6 space-y-5 my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-brand-400" />
                <span>دسته‌بندی‌های پشت‌صحنه</span>
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of existing categories */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{c.name}</span>
                    <span className="text-[10px] text-gray-400 mr-2 font-mono">({c.slug})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(c.id, c.name)}
                    className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="حذف دسته‌بندی"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Form to add new category */}
            <form onSubmit={handleCreateCategory} className="pt-3 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-brand-400">افزودن دسته‌بندی جدید</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="نام دسته (مثال: پارس سرامیک)"
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="اسلاگ URL"
                  value={newCategoryData.slug}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, slug: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  ثبت دسته
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Lightbox Modal */}
      {previewModalOpen && previewVideoItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-[#0a0a0d] border border-white/20 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-black text-white">مانیتور کارگردانی - پیش‌نمایش</span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video or Poster in 9:16 frame */}
            <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black border border-white/10">
              {previewVideoItem.cover_video ? (
                <video
                  src={previewVideoItem.cover_video}
                  poster={previewVideoItem.cover_image}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : previewVideoItem.cover_image ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewVideoItem.cover_image}
                    alt={previewVideoItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
                    <span className="text-xs font-semibold">فایل ویدیوی مستقیم روی سرور بارگذاری نشده است.</span>
                    <p className="text-[11px] text-gray-400">
                      می‌توانید با دکمه ویرایش، فایل ویدیویی MP4 یا WebM این شات را مستقیماً آپلود کنید.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-1 text-right pt-1">
              <h4 className="font-bold text-white text-sm">{previewVideoItem.title}</h4>
              <p className="text-xs text-gray-400">{previewVideoItem.subtitle || previewVideoItem.excerpt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

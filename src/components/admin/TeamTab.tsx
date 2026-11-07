'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Award,
  Calendar,
  Briefcase,
  Star,
  X,
  Sparkles,
  BarChart3,
  Info,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface TeamTabProps {
  members: any[];
  coreValues: any[];
  timeline: any[];
  onRefresh: () => void;
}

export default function TeamTab({
  members = [],
  coreValues = [],
  timeline = [],
  onRefresh,
}: TeamTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    tagline: '',
    skills_csv: '',
    total_projects: 10,
    years_experience: 3,
    accent_color: '#10B981',
    planet_type: 'cyber',
    poster_image: '',
    order: 1,
    is_active: true,
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      tagline: '',
      skills_csv: 'UI/UX, 3D Architecture, Web',
      total_projects: 15,
      years_experience: 4,
      accent_color: '#10B981',
      planet_type: 'cyber',
      poster_image: '',
      order: members.length + 1,
      is_active: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      tagline: m.tagline || '',
      skills_csv: m.skills_csv || '',
      total_projects: m.total_projects || 10,
      years_experience: m.years_experience || 3,
      accent_color: m.accent_color || '#10B981',
      planet_type: m.planet_type || 'cyber',
      poster_image: m.poster_image || '',
      order: m.order || 1,
      is_active: Boolean(m.is_active),
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/team/';
      const method = editingMember ? 'PUT' : 'POST';
      const payload = editingMember ? { ...formData, id: editingMember.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت عضو تیم');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این عضو تیم اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/team/?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'خطا در حذف عضو تیم');
      }
    } catch (err: any) {
      alert(err.message || 'خطا در ارتباط با سرور');
    }
  };

  return (
    <div className="space-y-8">
      {/* Notice about Public Landing Counters */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
        <BarChart3 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 space-y-1">
          <p className="font-bold text-white">
            مدیریت آمار و ارقام وب‌سایت:
          </p>
          <p className="leading-relaxed">
            آمار و ارقام وبسایت (شامل لندینگ پیج و نوار آمار صفحه «درباره ما») مستقیماً از تب اختصاصی <strong>«شمارنده‌ها»</strong> (جدول <code className="text-emerald-400 font-mono">public_landingcounter</code>) خوانده و به‌روزرسانی می‌شوند.
          </p>
        </div>
      </div>

      {/* Notice regarding Team Members on About Us */}
      <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 space-y-1">
          <p className="font-bold text-white">
            نکته ساختاری صفحه «درباره ما»:
          </p>
          <p className="leading-relaxed">
            مطابق هویت سازمانی، در صفحه درباره ما ساختار ۴ دپارتمان تخصصی (مهندسی وب ۳D، سئو داده‌محور، استودیو تیزر و ریلز، و تبلیغات محیطی آبنر) و متدولوژی ۴ مرحله‌ای نمایش داده می‌شود. اطلاعات پرسنل زیر صرفاً جهت آرشیو و نگهداری سیستمی است.
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-400" />
              <span>پروفایل‌های فنی و تخصصی ثبت‌شده ({members.length} نفر)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              آرشیو اطلاعات تخصص‌ها و مشخصات فنی همکاران اروم‌سیما
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن عضو جدید</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m) => (
            <div
              key={m.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg border border-white/20"
                      style={{ backgroundColor: m.accent_color || '#10B981' }}
                    >
                      {m.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-xs text-gray-400">{m.role}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.is_active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {m.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>

                {m.tagline && (
                  <p className="text-xs text-gray-300 italic bg-white/5 border border-white/5 p-2 rounded-xl">
                    &ldquo;{m.tagline}&rdquo;
                  </p>
                )}

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1">
                  {m.skills_csv?.split(',').map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300 border border-white/5"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center font-mono text-xs">
                  <div className="bg-dark-card/50 p-2 rounded-xl">
                    <span className="text-gray-400 text-[10px] block">پروژه‌ها</span>
                    <span className="font-bold text-white">{m.total_projects} پروژه</span>
                  </div>
                  <div className="bg-dark-card/50 p-2 rounded-xl">
                    <span className="text-gray-400 text-[10px] block">سابقه کار</span>
                    <span className="font-bold text-brand-400">{m.years_experience} سال</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ترتیب نمایش: #{m.order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 text-gray-400 hover:text-brand-300 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
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
      </div>

      {/* Core Values & Timeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-white/10">
        {/* Core Values */}
        <div className="glass-panel border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-brand-400" />
            <span>ارزش‌های سازمانی اروم‌سیما ({coreValues.length} مورد)</span>
          </h3>
          <div className="space-y-3">
            {coreValues.map((v) => (
              <div key={v.id} className="p-3 bg-dark-card/60 rounded-xl border border-white/5 flex items-start gap-3">
                <span className="text-lg">💎</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{v.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-panel border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>نقاط عطف تایم‌لاین ({timeline.length} رویداد)</span>
          </h3>
          <div className="space-y-3">
            {timeline.map((t) => (
              <div key={t.id} className="p-3 bg-dark-card/60 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-400 font-mono">{t.year}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{t.title}</h4>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">ترتیب: #{t.order}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-400" />
                <span>{editingMember ? 'ویرایش همکار' : 'افزودن همکار جدید'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1.5">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1.5">نقش و سمت تخصصی *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1.5">شعار / نقل‌قول همکار</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1.5">مهارت‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  value={formData.skills_csv}
                  onChange={(e) => setFormData({ ...formData, skills_csv: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1.5">سابقه (سال)</label>
                  <input
                    type="number"
                    value={formData.years_experience}
                    onChange={(e) => setFormData({ ...formData, years_experience: Number(e.target.value) })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1.5">تعداد پروژه</label>
                  <input
                    type="number"
                    value={formData.total_projects}
                    onChange={(e) => setFormData({ ...formData, total_projects: Number(e.target.value) })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1.5">رنگ تم</label>
                  <input
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-full h-9 bg-dark-base border border-white/10 rounded-xl p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1.5">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label="تصویر پرتره همکار"
                  value={formData.poster_image}
                  onChange={(url) => setFormData({ ...formData, poster_image: url })}
                  folder="team"
                  hint="تصویر پرتره با کیفیت بالا برای بخش معرفی تیم و آواتار"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-gray-300">عضو فعال تیم</span>
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
                  {loading ? 'در حال ثبت...' : editingMember ? 'ذخیره تغییرات' : 'افزودن عضو'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
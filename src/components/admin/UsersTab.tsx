'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Lock,
  User,
  Mail,
  Calendar,
  X,
  Key,
} from 'lucide-react';

interface UsersTabProps {
  users: any[];
  onRefresh: () => void;
}

export default function UsersTab({ users = [], onRefresh }: UsersTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    is_superuser: true,
  });

  const handleOpenAdd = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      first_name: '',
      last_name: '',
      is_superuser: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ایجاد کاربر');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این کاربر ادمین اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/users/?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'خطا در حذف کاربر');
        return;
      }
      onRefresh();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-400" />
            <span>مدیریت کاربران و دسترسی‌های امنیتی ادمین ({users.length} مدیر)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            کاربران مجاز برای ورود به پنل، هش‌شده با استاندارد PBKDF2 جنگو
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>افزودن مدیر جدید</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-panel border border-white/10 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-bold">
                <th className="pb-3 pr-2">شناسه</th>
                <th className="pb-3">نام کاربری</th>
                <th className="pb-3">نام و نشان</th>
                <th className="pb-3">ایمیل</th>
                <th className="pb-3">سطح دسترسی</th>
                <th className="pb-3">تاریخ ایجاد</th>
                <th className="pb-3 text-left pl-2">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-2 text-gray-500">#{u.id}</td>
                  <td className="py-3 text-white font-bold flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-400" />
                    <span>{u.username}</span>
                  </td>
                  <td className="py-3 text-gray-300 font-sans">
                    {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : '—'}
                  </td>
                  <td className="py-3 text-gray-400">{u.email || '—'}</td>
                  <td className="py-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.is_superuser
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {u.is_superuser ? 'سوپر ادمین کل' : 'کارشناس'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-[11px]">{u.date_joined?.slice(0, 10) || 'ثبت شده'}</td>
                  <td className="py-3 text-left pl-2">
                    {u.id !== 1 && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                        title="حذف مدیر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">افزودن مدیر جدید به سیستم</h3>
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
                <label className="block text-gray-300 mb-1">نام کاربری (Username) *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">کلمه عبور امن (Password) *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">نام</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">آدرس ایمیل</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_superuser}
                    onChange={(e) => setFormData({ ...formData, is_superuser: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-gray-300">دسترسی سوپریوزر کامل (Super Admin)</span>
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
                  {loading ? 'در حال ثبت...' : 'ایجاد کاربر مدیر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

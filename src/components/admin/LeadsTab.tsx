'use client';

import React, { useState } from 'react';
import {
  Inbox,
  Calendar,
  Wand2,
  Mail,
  CheckCircle2,
  Clock,
  Phone,
  Trash2,
  User,
  Search,
  Filter,
} from 'lucide-react';

interface LeadsTabProps {
  bookings: any[];
  wizardSubmissions: any[];
  subscribers: any[];
  onRefresh: () => void;
}

export default function LeadsTab({
  bookings = [],
  wizardSubmissions = [],
  subscribers = [],
  onRefresh,
}: LeadsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'wizard' | 'subscribers'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateStatus = async (type: string, id: number, updates: any) => {
    try {
      const res = await fetch('/api/admin/leads/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, ...updates }),
      });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('آیا از حذف این رکورد اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/leads/?id=${id}&type=${type}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-400" />
            <span>مدیریت سرنخ‌ها، جلسات مشاوره و ویزارد پروژه</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            درخواست‌های مشاوره اختصاصی، فرم‌های محاسبه و برآورد هوشمند و اعضای خبرنامه
          </p>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex items-center gap-2 bg-dark-card border border-white/10 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'bookings'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>رزرو مشاوره ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('wizard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'wizard'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>ویزارد پروژه ({wizardSubmissions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('subscribers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'subscribers'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>خبرنامه ({subscribers.length})</span>
          </button>
        </div>
      </div>

      {/* ── 1. BOOKINGS LIST ── */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 glass-panel border border-white/10 rounded-2xl">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-300">هنوز جلسه مشاوره‌ای رزرو نشده است.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-400" />
                        <h4 className="font-bold text-white text-sm">{b.full_name}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {b.status === 'confirmed' ? 'تایید شده' : 'در انتظار تماس'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-dark-base/60 p-2.5 rounded-xl border border-white/5">
                      <div className="text-gray-300">
                        <span className="text-gray-500 block text-[10px]">تاریخ جلسه:</span>
                        <span>{b.booking_date}</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-500 block text-[10px]">ساعت:</span>
                        <span>{b.start_time}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <a
                        href={`tel:${b.phone}`}
                        className="text-brand-300 hover:text-white flex items-center gap-1.5 font-mono"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{b.phone}</span>
                      </a>
                      {b.notes && (
                        <p className="text-gray-400 text-[11px] bg-white/5 p-2 rounded-lg mt-1">
                          یادداشت: {b.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                    <button
                      onClick={() =>
                        handleUpdateStatus('booking', b.id, {
                          status: b.status === 'confirmed' ? 'pending' : 'confirmed',
                        })
                      }
                      className="text-xs text-brand-400 hover:text-brand-300 cursor-pointer"
                    >
                      {b.status === 'confirmed' ? 'تغییر به در انتظار' : 'تایید جلسه ✓'}
                    </button>
                    <button
                      onClick={() => handleDelete('booking', b.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 2. WIZARD SUBMISSIONS ── */}
      {activeSubTab === 'wizard' && (
        <div className="space-y-4">
          {wizardSubmissions.length === 0 ? (
            <div className="text-center py-12 glass-panel border border-white/10 rounded-2xl">
              <Wand2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-300">هنوز سفارش ویزاردی ثبت نشده است.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wizardSubmissions.map((w) => (
                <div
                  key={w.id}
                  className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-bold text-white text-sm">{w.full_name}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        امتیاز سرنخ: {w.lead_score || 80}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-dark-base/60 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-gray-500 block text-[10px]">هدف پروژه:</span>
                        <span className="text-white font-medium">{w.goal}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">صنعت:</span>
                        <span className="text-brand-300 font-medium">{w.industry}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">بودجه تخمینی:</span>
                        <span className="text-emerald-400 font-mono font-bold">{w.budget}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">زمان‌بندی:</span>
                        <span className="text-gray-300">{w.timeline}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${w.phone}`}
                      className="text-brand-300 hover:text-white flex items-center gap-1.5 font-mono text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{w.phone}</span>
                    </a>

                    {w.message && (
                      <p className="text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                        {w.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                    <button
                      onClick={() =>
                        handleUpdateStatus('wizard', w.id, { is_seen: !w.is_seen })
                      }
                      className="text-xs text-brand-400 hover:text-brand-300 cursor-pointer"
                    >
                      {w.is_seen ? 'علامت به عنوان بررسی‌نشده' : 'بررسی شد ✓'}
                    </button>
                    <button
                      onClick={() => handleDelete('wizard', w.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 3. NEWSLETTER SUBSCRIBERS ── */}
      {activeSubTab === 'subscribers' && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3 pr-2">شناسه</th>
                  <th className="pb-3">ایمیل مشترک</th>
                  <th className="pb-3">تاریخ عضویت</th>
                  <th className="pb-3">وضعیت</th>
                  <th className="pb-3 text-left pl-2">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-2 text-gray-500">#{s.id}</td>
                    <td className="py-3 text-white font-bold">{s.email}</td>
                    <td className="py-3 text-gray-400">{s.created_at || 'ثبت شده'}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                          s.is_active
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {s.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="py-3 text-left pl-2">
                      <button
                        onClick={() => handleDelete('subscriber', s.id)}
                        className="p-1 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

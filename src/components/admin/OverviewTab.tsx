'use client';

import React from 'react';
import {
  Inbox,
  FolderGit2,
  Cpu,
  Star,
  BarChart3,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  Database,
  Eye,
} from 'lucide-react';

interface OverviewTabProps {
  stats: any;
  recentContacts: any[];
  onSelectTab: (tab: string) => void;
  onMarkSeen: (id: number, current: boolean) => void;
}

export default function OverviewTab({ stats, recentContacts, onSelectTab, onMarkSeen }: OverviewTabProps) {
  const kpiCards = [
    {
      title: 'پیام‌های تماس و مشاوره',
      value: stats?.totalContacts ?? 0,
      subValue: `${stats?.unreadContacts ?? 0} پیام جدید بررسی‌نشده`,
      icon: Inbox,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: (stats?.unreadContacts ?? 0) > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-300',
      badgeText: (stats?.unreadContacts ?? 0) > 0 ? `${stats.unreadContacts} جدید` : 'بررسی‌شده',
      actionTab: 'contacts',
    },
    {
      title: 'پروژه‌ها و نمونه‌کارها',
      value: stats?.totalProjects ?? 0,
      subValue: 'پروژه‌های ثبت‌شده در پردیس ۳D',
      icon: FolderGit2,
      color: 'from-brand-600 to-cyan-600',
      badgeColor: 'bg-brand-500/20 text-brand-300',
      badgeText: 'فعال در آرشیو',
      actionTab: 'projects',
    },
    {
      title: 'خدمات تخصصی آژانس',
      value: stats?.totalServices ?? 0,
      subValue: 'شامل سئو، وب، تیزر، بیلبورد',
      icon: Cpu,
      color: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      badgeText: 'ارائه‌شده',
      actionTab: 'services',
    },
    {
      title: 'نظرات مشتریان و برندها',
      value: stats?.totalTestimonials ?? 0,
      subValue: 'نظرات تأییدشده در لندینگ',
      icon: Star,
      color: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-500/20 text-purple-300',
      badgeText: 'منتشرشده',
      actionTab: 'testimonials',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / System Health */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900/30 via-dark-surface to-dark-base border border-brand-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">پایگاه داده متصل و همگام است</h2>
            <p className="text-xs text-gray-400">
              دیتابیس بدون هیچ‌گونه حذف اطلاعات با مدل‌های اصلی پروژه همگام‌سازی شده است.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>PostgreSQL / SQLite Active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(kpi.actionTab)}
              className="glass-panel-elevated rounded-3xl p-6 border border-white/10 hover:border-brand-500/40 cursor-pointer transition-all duration-300 hover:scale-[1.02] space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center shadow-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${kpi.badgeColor}`}>
                  {kpi.badgeText}
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-white font-mono">{kpi.value}</div>
                <div className="text-xs font-bold text-gray-300 mt-1">{kpi.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{kpi.subValue}</div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-brand-400 font-semibold group-hover:text-brand-300 transition-colors">
                <span>مدیریت این بخش</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Contact Messages */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">آخرین پیام‌های مشاوره دریافتی</h3>
          </div>
          <button
            onClick={() => onSelectTab('contacts')}
            className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>مشاهده همه پیام‌ها</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentContacts && recentContacts.length > 0 ? (
          <div className="divide-y divide-white/5 overflow-hidden">
            {recentContacts.map((msg) => (
              <div
                key={msg.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-3 rounded-2xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                      msg.is_seen ? 'bg-gray-600' : 'bg-rose-500 ring-4 ring-rose-500/20 animate-pulse'
                    }`}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{msg.full_name}</span>
                      <span className="text-[11px] text-gray-400 font-mono dir-ltr">{msg.phone}</span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-1 max-w-xl">{msg.message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {new Date(msg.created_at).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onMarkSeen(msg.id, msg.is_seen)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      msg.is_seen
                        ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{msg.is_seen ? 'دیده‌شده' : 'علامت به عنوان خوانده‌شده'}</span>
                  </button>
                  <a
                    href={`tel:${msg.phone}`}
                    className="p-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 transition-colors"
                    title="تماس مستقیم"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 text-xs space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400/60 mx-auto" />
            <p>در حال حاضر هیچ پیام جدیدی ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}

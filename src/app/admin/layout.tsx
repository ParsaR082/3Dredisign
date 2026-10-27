'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FolderGit2,
  Cpu,
  Settings,
  Star,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
  RefreshCw,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count periodically for notification badge
  useEffect(() => {
    if (isLoginPage) return;

    const fetchBadge = async () => {
      try {
        const res = await fetch('/api/admin/stats/');
        if (res.status === 401) {
          router.push('/admin/login/');
          return;
        }
        const data = await res.json();
        if (data?.stats?.unreadContacts !== undefined) {
          setUnreadCount(data.stats.unreadContacts);
        }
      } catch (_) {}
    };

    fetchBadge();
    const interval = setInterval(fetchBadge, 30000);
    return () => clearInterval(interval);
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout/', { method: 'POST' });
      router.push('/admin/login/');
      router.refresh();
    } catch (_) {}
  };

  if (isLoginPage) {
    return <div className="-mt-20 min-h-screen">{children}</div>;
  }

  const navItems = [
    { label: 'داشبورد', href: '/admin', icon: LayoutDashboard },
    { label: 'پیام‌های تماس و مشاوره', href: '/admin?tab=contacts', icon: Inbox, badge: unreadCount },
    { label: 'پروژه‌ها و نمونه‌کارها', href: '/admin?tab=projects', icon: FolderGit2 },
    { label: 'خدمات تخصصی', href: '/admin?tab=services', icon: Cpu },
    { label: 'تنظیمات سایت و سئو', href: '/admin?tab=settings', icon: Settings },
    { label: 'نظرات مشتریان', href: '/admin?tab=testimonials', icon: Star },
    { label: 'شمارنده‌های آمار', href: '/admin?tab=counters', icon: BarChart3 },
  ];

  return (
    <div className="-mt-20 min-h-screen bg-[#070B11] text-gray-100 flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-dark-surface/90 border-b border-white/10 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
            aria-label="منو"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-sm text-white block">پنل مدیریت اروم سیما</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Database Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all border border-white/5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            <span>مشاهده پردیس ۳D</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all border border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop */}
        <aside className="w-64 bg-dark-base border-l border-white/10 p-4 hidden md:flex flex-col justify-between shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              بخش‌های مدیریت
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand-400 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-gray-400 space-y-1">
            <div className="text-white font-bold">اروم سیما - مدیریت محتوا</div>
            <div className="text-gray-500">نگارش ۲.۰ (۳D Engine + Prisma)</div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-dark-base border-l border-white/10 p-5 space-y-4 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-bold text-sm text-white">منوی مدیریت</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-brand-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

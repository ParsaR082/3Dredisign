'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  CalendarCheck,
  FolderGit2,
  BookOpen,
  Cpu,
  Globe,
  Users,
  DollarSign,
  Tv,
  Film,
  Layers,
  Star,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCog,
} from 'lucide-react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
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

  const navGroups = [
    {
      title: 'ورودی‌ها و تعاملات',
      items: [
        { id: 'overview', label: 'داشبورد کلی', href: '/admin', icon: LayoutDashboard },
        { id: 'contacts', label: 'پیام‌های تماس', href: '/admin?tab=contacts', icon: Inbox, badge: unreadCount },
        { id: 'leads', label: 'رزرو مشاوره و پروپوزال', href: '/admin?tab=leads', icon: CalendarCheck },
      ],
    },
    {
      title: 'محتوا و نمونه‌کارها',
      items: [
        { id: 'projects', label: 'پروژه‌ها و نمونه‌کارها', href: '/admin?tab=projects', icon: FolderGit2 },
        { id: 'blog', label: 'مقالات وبلاگ', href: '/admin?tab=blog', icon: BookOpen },
        { id: 'services', label: 'خدمات تخصصی', href: '/admin?tab=services', icon: Cpu },
        { id: 'websites', label: 'پرتال وبسایت‌ها', href: '/admin?tab=websites', icon: Globe },
      ],
    },
    {
      title: 'استودیو و آژانس',
      items: [
        { id: 'team', label: 'اعضای تیم و ارزش‌ها', href: '/admin?tab=team', icon: Users },
        { id: 'pricing', label: 'تعرفه‌ها و پلن‌ها', href: '/admin?tab=pricing', icon: DollarSign },
        { id: 'abner', label: 'تلویزیون و استند آبنر', href: '/admin?tab=abner', icon: Tv },
        { id: 'backstage', label: 'پشت‌صحنه استودیو', href: '/admin?tab=backstage', icon: Film },
      ],
    },
    {
      title: 'لندینگ و بازاریابی',
      items: [
        { id: 'landing-elements', label: 'المان‌های لندینگ', href: '/admin?tab=landing-elements', icon: Layers },
        { id: 'testimonials', label: 'نظرات مشتریان', href: '/admin?tab=testimonials', icon: Star },
        { id: 'counters', label: 'شمارنده‌های آمار', href: '/admin?tab=counters', icon: BarChart3 },
      ],
    },
    {
      title: 'تنظیمات و امنیت',
      items: [
        { id: 'settings', label: 'تنظیمات سایت و سئو', href: '/admin?tab=settings', icon: Settings },
        { id: 'users', label: 'مدیران و دسترسی‌ها', href: '/admin?tab=users', icon: UserCog },
      ],
    },
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

          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-xs sm:text-sm text-white block truncate">پنل مدیریت اروم سیما</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 flex items-center gap-1 font-mono truncate">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden xs:inline">Live Database Active</span> (81 Models)
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
        <aside className="w-64 bg-dark-base border-l border-white/10 p-3 hidden md:flex flex-col justify-between shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-4 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group border ${
                        isActive
                          ? 'bg-brand-600 text-white border-brand-500/30 shadow-md shadow-brand-600/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5 border-transparent hover:border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-400'
                          }`}
                        />
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
            ))}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-400 space-y-1 mt-2">
            <div className="text-white font-bold">اروم سیما - سوپر پنل</div>
            <div className="text-gray-500 text-[10px]">همگام با دیتابیس جنگو (۱۱ ماژول)</div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 max-w-[85vw] bg-dark-base border-r md:border-l border-white/10 p-5 space-y-4 h-full overflow-y-auto overscroll-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-bold text-sm text-white">منوی مدیریت اروم سیما</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {navGroups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {group.title}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-brand-600 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-400'}`} />
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
                ))}
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#070B11]" />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </React.Suspense>
  );
}


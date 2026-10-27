'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FolderGit2,
  Cpu,
  Settings,
  Star,
  BarChart3,
  RefreshCw,
  Loader2,
} from 'lucide-react';

import OverviewTab from '@/components/admin/OverviewTab';
import ContactsTab from '@/components/admin/ContactsTab';
import ProjectsTab from '@/components/admin/ProjectsTab';
import ServicesTab from '@/components/admin/ServicesTab';
import SettingsTab from '@/components/admin/SettingsTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import CountersTab from '@/components/admin/CountersTab';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [landing, setLanding] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [counters, setCounters] = useState<any[]>([]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Stats & Recent Contacts
      const statsRes = await fetch('/api/admin/stats/');
      if (statsRes.status === 401) {
        router.push('/admin/login/');
        return;
      }
      const statsData = await statsRes.json();
      setStats(statsData.stats);

      // 2. Fetch specific tab data or parallel fetch
      const [contactsRes, projectsRes, servicesRes, settingsRes, testimonialsRes, countersRes] =
        await Promise.all([
          fetch('/api/admin/contacts/'),
          fetch('/api/admin/projects/'),
          fetch('/api/admin/services/'),
          fetch('/api/admin/settings/'),
          fetch('/api/admin/testimonials/'),
          fetch('/api/admin/counters/'),
        ]);

      if (contactsRes.ok) {
        const c = await contactsRes.json();
        setContacts(c.contacts || []);
      }
      if (projectsRes.ok) {
        const p = await projectsRes.json();
        setProjects(p.projects || []);
      }
      if (servicesRes.ok) {
        const s = await servicesRes.json();
        setServices(s.services || []);
      }
      if (settingsRes.ok) {
        const st = await settingsRes.json();
        setSettings(st.settings);
        setLanding(st.landing);
      }
      if (testimonialsRes.ok) {
        const t = await testimonialsRes.json();
        setTestimonials(t.testimonials || []);
      }
      if (countersRes.ok) {
        const cnt = await countersRes.json();
        setCounters(cnt.counters || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSelectTab = (tab: string) => {
    if (tab === 'overview') {
      router.push('/admin/');
    } else {
      router.push(`/admin/?tab=${tab}`);
    }
  };

  const handleMarkSeen = async (id: number, current: boolean) => {
    try {
      const res = await fetch('/api/admin/contacts/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_seen: !current }),
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_seen: !current } : c))
        );
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats/');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }
      }
    } catch (_) {}
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/contacts/?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (_) {}
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          {[
            { id: 'overview', label: 'داشبورد کلی', icon: LayoutDashboard },
            { id: 'contacts', label: 'پیام‌های تماس', icon: Inbox, count: stats?.unreadContacts },
            { id: 'projects', label: 'پروژه‌ها', icon: FolderGit2, count: projects.length },
            { id: 'services', label: 'خدمات', icon: Cpu, count: services.length },
            { id: 'settings', label: 'تنظیمات و سئو', icon: Settings },
            { id: 'testimonials', label: 'نظرات مشتریان', icon: Star, count: testimonials.length },
            { id: 'counters', label: 'شمارنده‌ها', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-brand-500/20 text-brand-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={fetchAllData}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all shrink-0"
          title="تازه‌سازی اطلاعات"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && !stats ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
          <p className="text-xs text-gray-400">در حال اتصال و واکشی داده‌های زنده از پایگاه‌داده...</p>
        </div>
      ) : (
        <div>
          {currentTab === 'overview' && (
            <OverviewTab
              stats={stats}
              recentContacts={contacts.slice(0, 5)}
              onSelectTab={handleSelectTab}
              onMarkSeen={handleMarkSeen}
            />
          )}

          {currentTab === 'contacts' && (
            <ContactsTab
              contacts={contacts}
              onRefresh={fetchAllData}
              onMarkSeen={handleMarkSeen}
              onDelete={handleDeleteContact}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsTab projects={projects} onRefresh={fetchAllData} />
          )}

          {currentTab === 'services' && (
            <ServicesTab services={services} onRefresh={fetchAllData} />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              initialSettings={settings}
              initialLanding={landing}
              onRefresh={fetchAllData}
            />
          )}

          {currentTab === 'testimonials' && (
            <TestimonialsTab testimonials={testimonials} onRefresh={fetchAllData} />
          )}

          {currentTab === 'counters' && (
            <CountersTab counters={counters} onRefresh={fetchAllData} />
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
          <p className="text-xs text-gray-400">در حال بارگذاری پنل مدیریت اروم سیما...</p>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

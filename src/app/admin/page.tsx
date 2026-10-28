'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  UserCog,
  RefreshCw,
  Loader2,
} from 'lucide-react';

import OverviewTab from '@/components/admin/OverviewTab';
import ContactsTab from '@/components/admin/ContactsTab';
import LeadsTab from '@/components/admin/LeadsTab';
import ProjectsTab from '@/components/admin/ProjectsTab';
import BlogTab from '@/components/admin/BlogTab';
import ServicesTab from '@/components/admin/ServicesTab';
import WebsitesTab from '@/components/admin/WebsitesTab';
import TeamTab from '@/components/admin/TeamTab';
import PricingTab from '@/components/admin/PricingTab';
import AbnerTab from '@/components/admin/AbnerTab';
import BackstageTab from '@/components/admin/BackstageTab';
import LandingElementsTab from '@/components/admin/LandingElementsTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import CountersTab from '@/components/admin/CountersTab';
import SettingsTab from '@/components/admin/SettingsTab';
import UsersTab from '@/components/admin/UsersTab';

const ALL_TABS = [
  { id: 'overview', label: 'داشبورد کلی', icon: LayoutDashboard },
  { id: 'contacts', label: 'پیام‌های تماس', icon: Inbox },
  { id: 'leads', label: 'رزرو مشاوره و پروپوزال', icon: CalendarCheck },
  { id: 'projects', label: 'پروژه‌ها', icon: FolderGit2 },
  { id: 'blog', label: 'وبلاگ و مقالات', icon: BookOpen },
  { id: 'services', label: 'خدمات تخصصی', icon: Cpu },
  { id: 'websites', label: 'پرتال وبسایت‌ها', icon: Globe },
  { id: 'team', label: 'تیم و ارزش‌ها', icon: Users },
  { id: 'pricing', label: 'تعرفه‌ها و پلن‌ها', icon: DollarSign },
  { id: 'abner', label: 'نمایشگرهای آبنر', icon: Tv },
  { id: 'backstage', label: 'پشت‌صحنه', icon: Film },
  { id: 'landing-elements', label: 'المان‌های لندینگ', icon: Layers },
  { id: 'testimonials', label: 'نظرات مشتریان', icon: Star },
  { id: 'counters', label: 'شمارنده‌ها', icon: BarChart3 },
  { id: 'settings', label: 'تنظیمات و سئو', icon: Settings },
  { id: 'users', label: 'کاربران و مدیران', icon: UserCog },
];

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  // Core Data
  const [stats, setStats] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [landing, setLanding] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [counters, setCounters] = useState<any[]>([]);

  // On-demand Data
  const [leadsData, setLeadsData] = useState<{ bookings: any[]; wizardSubmissions: any[]; subscribers: any[] }>({
    bookings: [],
    wizardSubmissions: [],
    subscribers: [],
  });
  const [blogData, setBlogData] = useState<{ posts: any[]; categories: any[]; authors: any[] }>({
    posts: [],
    categories: [],
    authors: [],
  });
  const [websitesData, setWebsitesData] = useState<{ websites: any[]; categories: any[] }>({
    websites: [],
    categories: [],
  });
  const [teamData, setTeamData] = useState<{ members: any[]; coreValues: any[]; timeline: any[] }>({
    members: [],
    coreValues: [],
    timeline: [],
  });
  const [pricingData, setPricingData] = useState<{ plans: any[] }>({ plans: [] });
  const [abnerData, setAbnerData] = useState<{ products: any[]; cityTvModels: any[]; standModels: any[]; page: any }>({
    products: [],
    cityTvModels: [],
    standModels: [],
    page: null,
  });
  const [backstageData, setBackstageData] = useState<{ items: any[]; categories: any[]; settings: any }>({
    items: [],
    categories: [],
    settings: null,
  });
  const [landingElementsData, setLandingElementsData] = useState<{
    processSteps: any[];
    whyItems: any[];
    growthStats: any[];
    tickerItems: any[];
  }>({
    processSteps: [],
    whyItems: [],
    growthStats: [],
    tickerItems: [],
  });
  const [usersData, setUsersData] = useState<{ users: any[] }>({ users: [] });

  // 1. Initial Core Fetch (Stats + Overview essentials)
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats/');
      if (statsRes.status === 401) {
        router.push('/admin/login/');
        return;
      }
      const statsJson = await statsRes.json();
      setStats(statsJson.stats);

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
      console.error('Error fetching admin core data:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // 2. Fetch specific tab data on demand
  const fetchTabData = useCallback(async (tab: string) => {
    setTabLoading(true);
    try {
      switch (tab) {
        case 'leads': {
          const res = await fetch('/api/admin/leads/');
          if (res.ok) {
            const data = await res.json();
            setLeadsData({
              bookings: data.bookings || [],
              wizardSubmissions: data.wizardSubmissions || [],
              subscribers: data.subscribers || [],
            });
          }
          break;
        }
        case 'blog': {
          const res = await fetch('/api/admin/blog/');
          if (res.ok) {
            const data = await res.json();
            setBlogData({
              posts: data.posts || [],
              categories: data.categories || [],
              authors: data.authors || [],
            });
          }
          break;
        }
        case 'websites': {
          const res = await fetch('/api/admin/websites/');
          if (res.ok) {
            const data = await res.json();
            setWebsitesData({
              websites: data.websites || [],
              categories: data.categories || [],
            });
          }
          break;
        }
        case 'team': {
          const res = await fetch('/api/admin/team/');
          if (res.ok) {
            const data = await res.json();
            setTeamData({
              members: data.members || [],
              coreValues: data.coreValues || [],
              timeline: data.timeline || [],
            });
          }
          break;
        }
        case 'pricing': {
          const res = await fetch('/api/admin/pricing/');
          if (res.ok) {
            const data = await res.json();
            setPricingData({ plans: data.plans || [] });
          }
          break;
        }
        case 'abner': {
          const res = await fetch('/api/admin/abner/');
          if (res.ok) {
            const data = await res.json();
            setAbnerData({
              products: data.products || [],
              cityTvModels: data.cityTvModels || [],
              standModels: data.standModels || [],
              page: data.page || null,
            });
          }
          break;
        }
        case 'backstage': {
          const res = await fetch('/api/admin/backstage/');
          if (res.ok) {
            const data = await res.json();
            setBackstageData({
              items: data.items || [],
              categories: data.categories || [],
              settings: data.settings || null,
            });
          }
          break;
        }
        case 'landing-elements': {
          const res = await fetch('/api/admin/landing-elements/');
          if (res.ok) {
            const data = await res.json();
            setLandingElementsData({
              processSteps: data.processSteps || [],
              whyItems: data.whyItems || [],
              growthStats: data.growthStats || [],
              tickerItems: data.tickerItems || [],
            });
          }
          break;
        }
        case 'users': {
          const res = await fetch('/api/admin/users/');
          if (res.ok) {
            const data = await res.json();
            setUsersData({ users: data.users || [] });
          }
          break;
        }
        case 'contacts': {
          const res = await fetch('/api/admin/contacts/');
          if (res.ok) {
            const c = await res.json();
            setContacts(c.contacts || []);
          }
          break;
        }
        case 'projects': {
          const res = await fetch('/api/admin/projects/');
          if (res.ok) {
            const p = await res.json();
            setProjects(p.projects || []);
          }
          break;
        }
        case 'services': {
          const res = await fetch('/api/admin/services/');
          if (res.ok) {
            const s = await res.json();
            setServices(s.services || []);
          }
          break;
        }
        case 'settings': {
          const res = await fetch('/api/admin/settings/');
          if (res.ok) {
            const st = await res.json();
            setSettings(st.settings);
            setLanding(st.landing);
          }
          break;
        }
        case 'testimonials': {
          const res = await fetch('/api/admin/testimonials/');
          if (res.ok) {
            const t = await res.json();
            setTestimonials(t.testimonials || []);
          }
          break;
        }
        case 'counters': {
          const res = await fetch('/api/admin/counters/');
          if (res.ok) {
            const cnt = await res.json();
            setCounters(cnt.counters || []);
          }
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(`Error fetching tab ${tab}:`, err);
    } finally {
      setTabLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentTab !== 'overview') {
      fetchTabData(currentTab);
    }
  }, [currentTab, fetchTabData]);

  const handleSelectTab = (tab: string) => {
    if (tab === 'overview') {
      router.push('/admin');
    } else {
      router.push(`/admin?tab=${tab}`);
    }
  };

  const handleRefreshCurrentTab = () => {
    if (currentTab === 'overview') {
      fetchInitialData();
    } else {
      fetchTabData(currentTab);
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

  const getTabCount = (tabId: string) => {
    switch (tabId) {
      case 'contacts':
        return stats?.unreadContacts;
      case 'projects':
        return projects.length;
      case 'services':
        return services.length;
      case 'blog':
        return blogData.posts.length || undefined;
      case 'websites':
        return websitesData.websites.length || undefined;
      case 'team':
        return teamData.members.length || undefined;
      case 'pricing':
        return pricingData.plans.length || undefined;
      case 'testimonials':
        return testimonials.length;
      case 'users':
        return usersData.users.length || undefined;
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          {ALL_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            const count = getTabCount(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                  active
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-brand-500/20 text-brand-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRefreshCurrentTab}
          disabled={loading || tabLoading}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all shrink-0 border border-white/5"
          title="تازه‌سازی اطلاعات این بخش"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading || tabLoading ? 'animate-spin text-brand-400' : ''}`}
          />
        </button>
      </div>

      {/* Main Tab Rendering */}
      {loading && !stats ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
          <p className="text-xs text-gray-400">در حال اتصال و واکشی داده‌های زنده از پایگاه‌داده...</p>
        </div>
      ) : (
        <div className="relative">
          {tabLoading && (
            <div className="absolute inset-0 bg-dark-base/60 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl py-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-white/10 text-xs text-brand-300 shadow-xl">
                <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                <span>در حال دریافت داده‌های {ALL_TABS.find((t) => t.id === currentTab)?.label}...</span>
              </div>
            </div>
          )}

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
              onRefresh={() => fetchTabData('contacts')}
              onMarkSeen={handleMarkSeen}
              onDelete={handleDeleteContact}
            />
          )}

          {currentTab === 'leads' && (
            <LeadsTab
              bookings={leadsData.bookings}
              wizardSubmissions={leadsData.wizardSubmissions}
              subscribers={leadsData.subscribers}
              onRefresh={() => fetchTabData('leads')}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsTab projects={projects} onRefresh={() => fetchTabData('projects')} />
          )}

          {currentTab === 'blog' && (
            <BlogTab
              posts={blogData.posts}
              categories={blogData.categories}
              authors={blogData.authors}
              onRefresh={() => fetchTabData('blog')}
            />
          )}

          {currentTab === 'services' && (
            <ServicesTab services={services} onRefresh={() => fetchTabData('services')} />
          )}

          {currentTab === 'websites' && (
            <WebsitesTab
              websites={websitesData.websites}
              categories={websitesData.categories}
              onRefresh={() => fetchTabData('websites')}
            />
          )}

          {currentTab === 'team' && (
            <TeamTab
              members={teamData.members}
              coreValues={teamData.coreValues}
              timeline={teamData.timeline}
              onRefresh={() => fetchTabData('team')}
            />
          )}

          {currentTab === 'pricing' && (
            <PricingTab plans={pricingData.plans} onRefresh={() => fetchTabData('pricing')} />
          )}

          {currentTab === 'abner' && (
            <AbnerTab
              products={abnerData.products}
              cityTvModels={abnerData.cityTvModels}
              standModels={abnerData.standModels}
              page={abnerData.page}
              onRefresh={() => fetchTabData('abner')}
            />
          )}

          {currentTab === 'backstage' && (
            <BackstageTab
              items={backstageData.items}
              categories={backstageData.categories}
              settings={backstageData.settings}
              onRefresh={() => fetchTabData('backstage')}
            />
          )}

          {currentTab === 'landing-elements' && (
            <LandingElementsTab
              processSteps={landingElementsData.processSteps}
              whyItems={landingElementsData.whyItems}
              growthStats={landingElementsData.growthStats}
              tickerItems={landingElementsData.tickerItems}
              onRefresh={() => fetchTabData('landing-elements')}
            />
          )}

          {currentTab === 'testimonials' && (
            <TestimonialsTab
              testimonials={testimonials}
              onRefresh={() => fetchTabData('testimonials')}
            />
          )}

          {currentTab === 'counters' && (
            <CountersTab counters={counters} onRefresh={() => fetchTabData('counters')} />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              initialSettings={settings}
              initialLanding={landing}
              onRefresh={() => fetchTabData('settings')}
            />
          )}

          {currentTab === 'users' && (
            <UsersTab users={usersData.users} onRefresh={() => fetchTabData('users')} />
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
          <p className="text-xs text-gray-400">در حال بارگذاری سوپر پنل مدیریت اروم سیما...</p>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  HelpCircle,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';

interface LandingElementsTabProps {
  processSteps: any[];
  whyItems: any[];
  growthStats: any[];
  tickerItems: any[];
  onRefresh: () => void;
}

export default function LandingElementsTab({
  processSteps = [],
  whyItems = [],
  growthStats = [],
  tickerItems = [],
  onRefresh,
}: LandingElementsTabProps) {
  const [activeSection, setActiveSection] = useState<'steps' | 'why' | 'growth' | 'ticker'>('steps');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    step_number: '۰۱',
    order: 1,
    icon: '⚡',
    value: '+۱۲۰٪',
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      step_number: `۰${processSteps.length + 1}`,
      order: processSteps.length + 1,
      icon: '⚡',
      value: '+۱۲۰٪',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const typeMap: Record<string, string> = {
        steps: 'step',
        why: 'why',
        growth: 'growth',
        ticker: 'ticker',
      };

      const res = await fetch('/api/admin/landing-elements/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: typeMap[activeSection],
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت آیتم');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این المان اطمینان دارید؟')) return;
    try {
      const typeMap: Record<string, string> = {
        steps: 'step',
        why: 'why',
        growth: 'growth',
        ticker: 'ticker',
      };
      const res = await fetch(`/api/admin/landing-elements/?id=${id}&type=${typeMap[activeSection]}`, {
        method: 'DELETE',
      });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-400" />
            <span>مدیریت المان‌های تعاملی صفحه اول (Landing Elements)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            مراحل همکاری، کارت‌های چرا اروم‌سیما، شاخص‌های رشد و تیکر متحرک
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن آیتم جدید</span>
        </button>
      </div>

      {/* Section Nav */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSection('steps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'steps'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>مراحل همکاری ({processSteps.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('why')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'why'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>چرا اروم سیما ({whyItems.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('growth')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeSection === 'growth'
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>شاخص‌های رشد ({growthStats.length})</span>
        </button>
      </div>

      {/* ── 1. STEPS ── */}
      {activeSection === 'steps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 flex items-center justify-center font-bold font-mono text-sm">
                  {step.step_number}
                </span>
                <h3 className="font-bold text-white text-sm">{step.title}</h3>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ترتیب: #{step.order}</span>
                <button
                  onClick={() => handleDelete(step.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 2. WHY ITEMS ── */}
      {activeSection === 'why' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {whyItems.map((why) => (
            <div
              key={why.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-2xl font-black text-brand-400 font-mono">{why.number}</span>
                <h3 className="font-bold text-white text-sm">{why.title}</h3>
                <p className="text-xs text-gray-400">{why.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ترتیب: #{why.order}</span>
                <button
                  onClick={() => handleDelete(why.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. GROWTH STATS ── */}
      {activeSection === 'growth' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {growthStats.map((g) => (
            <div
              key={g.id}
              className="glass-panel border border-white/10 rounded-2xl p-5 text-center flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-2xl">{g.icon || '🚀'}</span>
                <h4 className="text-2xl font-black text-white font-mono">{g.value}</h4>
                <p className="text-xs text-gray-400">{g.label}</p>
              </div>

              <div className="pt-3 border-t border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">#{g.order}</span>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="p-1 text-gray-400 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">افزودن آیتم جدید</h3>
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
                <label className="block text-gray-300 mb-1">عنوان آیتم *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {activeSection === 'steps' && (
                <div>
                  <label className="block text-gray-300 mb-1">شماره مرحله (مثال: ۰۱)</label>
                  <input
                    type="text"
                    value={formData.step_number}
                    onChange={(e) => setFormData({ ...formData, step_number: e.target.value })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                  />
                </div>
              )}

              {activeSection === 'growth' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">مقدار شاخص</label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="+۲۵۰٪"
                      className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">آیکون اموجی</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-1">توضیحات</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
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
                  {loading ? 'در حال ثبت...' : 'ثبت در دیتابیس'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

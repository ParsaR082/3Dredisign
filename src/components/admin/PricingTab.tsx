'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Star,
  X,
  Zap,
} from 'lucide-react';

interface PricingTabProps {
  plans: any[];
  onRefresh: () => void;
}

export default function PricingTab({ plans = [], onRefresh }: PricingTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthly_price: 25,
    yearly_price: 250,
    billing_period: 'پروژه‌ای',
    custom_price_text: '',
    is_popular: false,
    order: 1,
    features_csv: '',
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      monthly_price: 35,
      yearly_price: 350,
      billing_period: 'پروژه‌ای',
      custom_price_text: '',
      is_popular: false,
      order: plans.length + 1,
      features_csv: 'طراحی ۳D اختصاصی, سئو تکنیکال رتبه ۱, بهینه‌سازی سرعت, پشتیبانی ۶ ماهه',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    const existingFeatures = Array.isArray(plan.features)
      ? plan.features.map((f: any) => f.title).join(', ')
      : '';
    setFormData({
      name: plan.name,
      description: plan.description || '',
      monthly_price: plan.monthly_price || 0,
      yearly_price: plan.yearly_price || 0,
      billing_period: plan.billing_period || 'پروژه‌ای',
      custom_price_text: plan.custom_price_text || '',
      is_popular: Boolean(plan.is_popular),
      order: plan.order || 1,
      features_csv: existingFeatures,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = '/api/admin/pricing/';
      const method = editingPlan ? 'PUT' : 'POST';
      const features = formData.features_csv
        ? formData.features_csv.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const payload = {
        ...(editingPlan ? { id: editingPlan.id } : {}),
        ...formData,
        features,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت پلن');

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این پلن قیمت‌گذاری اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/pricing/?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-400" />
            <span>مدیریت تعرفه‌ها و پلن‌های قیمت‌گذاری ({plans.length} پلن)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            پکیج‌های اقتصادی، سازمانی و اختصاصی اروم سیما
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>پلن جدید</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`glass-panel border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
              p.is_popular
                ? 'border-brand-500/50 shadow-xl shadow-brand-500/10 bg-gradient-to-b from-brand-950/20 to-dark-card/90'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {p.is_popular && (
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white shadow-md shadow-brand-500/50 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>محبوب‌ترین پیشنهاد</span>
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">{p.name}</h3>
                <span className="text-[10px] font-mono text-gray-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                  #{p.order}
                </span>
              </div>

              <p className="text-xs text-gray-400">{p.description}</p>

              {/* Price Display */}
              <div className="p-3 bg-dark-base/80 rounded-xl border border-white/5 font-mono">
                {p.custom_price_text ? (
                  <span className="text-sm font-bold text-brand-400">{p.custom_price_text}</span>
                ) : (
                  <div>
                    <span className="text-2xl font-black text-white">
                      {p.monthly_price ? Number(p.monthly_price).toLocaleString() : 'توافقی'}
                    </span>
                    <span className="text-xs text-gray-400 mr-1.5">میلیون تومان / {p.billing_period}</span>
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-gray-400 block">ویژگی‌های این پکیج:</span>
                {Array.isArray(p.features) && p.features.length > 0 ? (
                  <ul className="space-y-1.5">
                    {p.features.map((feat: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        <span>{typeof feat === 'string' ? feat : feat.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-gray-500 italic">بدون ویژگی ثبت‌شده</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(p)}
                className="px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>ویرایش</span>
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingPlan ? 'ویرایش پلن تعرفه' : 'افزودن پلن تعرفه جدید'}
              </h3>
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
                <label className="block text-gray-300 mb-1">نام پلن تعرفه *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: پرتال شرکتی ۳D"
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">توضیحات کوتاه</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="مناسب استارتاپ‌ها و شرکت‌های صنعتی رو به رشد"
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">قیمت (میلیون تومان)</label>
                  <input
                    type="number"
                    value={formData.monthly_price}
                    onChange={(e) => setFormData({ ...formData, monthly_price: Number(e.target.value) })}
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">دوره پرداخت / برچسب</label>
                  <input
                    type="text"
                    value={formData.billing_period}
                    onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                    placeholder="پروژه‌ای / ماهانه"
                    className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">متن قیمت دلخواه (جایگزین عدد در صورت نیاز)</label>
                <input
                  type="text"
                  value={formData.custom_price_text}
                  onChange={(e) => setFormData({ ...formData, custom_price_text: e.target.value })}
                  placeholder="مثلاً: شروع از ۴۵ میلیون تومان"
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">ویژگی‌های پلن (جدا شده با کاما)</label>
                <textarea
                  rows={3}
                  value={formData.features_csv}
                  onChange={(e) => setFormData({ ...formData, features_csv: e.target.value })}
                  placeholder="طراحی وب ۳D, سئو تکنیکال, انیمیشن‌های تعاملی, هاست اختصاصی"
                  className="w-full bg-dark-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-gray-300">پلن محبوب و پیشنهادی ویژه</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">ترتیب:</span>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-16 bg-dark-base border border-white/10 rounded-xl px-2 py-1 text-white text-center focus:outline-none"
                  />
                </div>
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
                  {loading ? 'در حال ثبت...' : editingPlan ? 'ذخیره تغییرات' : 'افزودن پلن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

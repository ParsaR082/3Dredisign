'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ورود ناموفق بود.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B11] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-2.5 sm:space-y-3">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25 border border-white/20">
              <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">ورود به پنل مدیریت اروم سیما</h1>
              <p className="text-gray-400 text-xs mt-1">مدیریت محتوا، خدمات، پروژه‌ها و پیام‌های تماس</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block text-xs">نام کاربری</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors text-right"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block text-xs">رمز عبور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-dark-base border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors text-left dir-ltr"
                />
              </div>
              <p className="text-[11px] text-gray-500 pt-1">
                رمز عبور پیش‌فرض: <code className="text-brand-300 font-mono">admin123</code> یا رمز ادمین دیتابیس
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>ورود به داشبورد</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="pt-4 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>بازگشت به پردیس ۳بعدی وب‌سایت</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

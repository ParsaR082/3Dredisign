'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl">
          <div className="text-5xl font-black text-amber-400 font-mono">۵۰۰</div>
          <h1 className="text-xl font-bold">خطای موقت در پردازش سرور</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            سیستم با یک وقفه موقت در بارگذاری برنامه مواجه شد. لطفاً مجدداً تلاش کنید یا به صفحه اصلی بازگردید.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              تلاش مجدد
            </button>
            <a
              href="/"
              className="px-6 py-2.5 rounded-xl border border-white/20 hover:bg-white/5 text-gray-300 hover:text-white font-bold text-xs transition-colors"
            >
              صفحه اصلی
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

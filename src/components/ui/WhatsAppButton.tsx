'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number: string;
}

export default function WhatsAppButton({ number }: WhatsAppButtonProps) {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('سلام و وقت بخیر؛ مایل به دریافت مشاوره در خصوص پروژه‌های دیجیتال مارکتینگ و طراحی سایت اروم‌سیما هستم.')}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 group focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
      aria-label="ارتباط مستقیم در واتساپ"
    >
      <span className="absolute -top-10 left-0 bg-dark-base border border-white/10 text-white text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        پاسخگویی سریع واتساپ
      </span>
      <span className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-30 absolute inset-0" />
      <MessageCircle className="w-7 h-7 relative z-10" />
    </a>
  );
}

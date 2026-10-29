'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { transitionSpring } from '@/components/ui/motion';

interface WhatsAppButtonProps {
  number: string;
}

export default function WhatsAppButton({ number }: WhatsAppButtonProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cleanNumber = number.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('سلام و وقت بخیر؛ مایل به دریافت مشاوره در خصوص پروژه‌های دیجیتال مارکتینگ و طراحی سایت اروم‌سیما هستم.')}`;

  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.12, rotate: 5 }}
      whileTap={{ scale: 0.92 }}
      transition={transitionSpring}
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/40 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-emerald-400/30 cursor-pointer"
      aria-label="ارتباط مستقیم در واتساپ"
    >
      <span className="absolute -top-10 left-0 bg-dark-base border border-white/10 text-white text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        پاسخگویی سریع واتساپ
      </span>
      <span className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-30 absolute inset-0" />
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
    </motion.a>
  );
}

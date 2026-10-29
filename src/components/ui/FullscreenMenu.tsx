'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { X, ArrowLeft, Globe, Phone, Sparkles } from 'lucide-react';

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string; badge?: string }>;
}

export function FullscreenMenu({
  isOpen,
  onClose,
  links,
}: FullscreenMenuProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const menuVariants: Variants = {
    closed: {
      clipPath: 'circle(0% at 95% 5%)',
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      },
    },
    open: {
      clipPath: 'circle(150% at 95% 5%)',
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      },
    },
  };

  const containerVariants: Variants = {
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: {
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    closed: { y: 40, opacity: 0 },
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-dark-base/95 p-8 md:p-16 backdrop-blur-2xl text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-sm font-semibold tracking-wider text-gray-400">
                منوی راهبری اروم سیما
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="بستن منو"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:scale-110 hover:border-brand-500 hover:bg-brand-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Nav Items */}
          <motion.div
            variants={containerVariants}
            className="my-auto flex flex-col gap-5 md:gap-7 max-w-4xl mx-auto w-full text-right"
          >
            {links.map((link, idx) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center justify-between text-2xl md:text-5xl font-black text-gray-300 transition-colors hover:text-white"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs md:text-sm font-mono text-brand-400/60 group-hover:text-brand-400">
                      0{idx + 1}
                    </span>
                    <span className="transition-transform group-hover:-translate-x-3 duration-300">
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <ArrowLeft className="h-6 w-6 md:h-8 md:w-8 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-brand-400" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Info */}
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-sm text-gray-400 gap-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-brand-400" /> ارومیه، ایران
              </span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-brand-400" /> ۰۴۴-۳۳۴۴۵۵۶۶
              </span>
            </div>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} اروم سیما — تجربه تعاملی نسل بعدی
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

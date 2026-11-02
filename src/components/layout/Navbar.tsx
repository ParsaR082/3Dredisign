'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, ArrowLeft } from 'lucide-react';
import type { SiteSettings, Service } from '@/types/content';
import { transitionSpring } from '@/components/ui/motion';
import { MagneticButton } from '@/components/ui/MagneticButton';

function getSafeInternalUrl(url: string | undefined | null, fallback: string): string {
  if (!url) return fallback;
  const cleaned = url.replace(/^https?:\/\/[^\/]+/, '');
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

interface NavbarProps {
  settings: SiteSettings;
  services: Service[];
}

export default function Navbar({ settings, services }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'صفحه اصلی', href: '/' },
    { label: 'پردیس ۳D', href: '/campus-3d' },
    {
      label: 'خدمات تخصصی',
      href: '/services/',
      hasDropdown: true,
    },
    { label: 'نمونه‌کارها', href: '/portfolio/' },
    { label: 'وبسایت‌ها', href: '/websites/' },
    { label: 'پشت‌صحنه', href: '/backstage/' },
    { label: 'تعرفه‌ها', href: '/pricing/' },
    { label: 'نمایندگی ابنر', href: '/abner/' },
    { label: 'درباره ما', href: '/about-us/' },
    { label: 'وبلاگ', href: '/blog/' },
    { label: 'تماس با ما', href: '/contact-us/' },
  ];

  return (
    <header className="fixed top-2.5 sm:top-3.5 inset-x-0 mx-auto z-50 w-[96%] lg:w-fit lg:max-w-[98vw] pointer-events-none transition-all duration-300">
      {/* macOS Floating Dock Body */}
      <div
        className={`pointer-events-auto rounded-full transition-all duration-300 border border-white/15 relative overflow-visible ${
          scrolled
            ? 'bg-[#030712]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.5)] py-1.5 px-3 sm:px-4'
            : 'bg-[#030712]/65 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-[#030712]/80 py-1.5 px-3 sm:px-4'
        }`}
      >
        {/* Apple-style Top Edge Sheen Reflection */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between lg:justify-start gap-1 sm:gap-2 lg:gap-1.5">
          {/* Brand Logo & Slogan */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 whitespace-nowrap pl-1 pr-1.5">
            <motion.img
              whileHover={{ rotate: 12, scale: 1.12 }}
              transition={transitionSpring}
              src="/favicon.svg"
              alt="اروم سیما"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0"
              width={32}
              height={32}
            />
            <div className="flex flex-col shrink-0">
              <span className="text-xs sm:text-sm font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors leading-tight whitespace-nowrap">
                {settings.site_name}
              </span>
              <span className="hidden xl:block text-[8px] text-emerald-400/90 font-semibold tracking-[1.5px] uppercase whitespace-nowrap">
                DIGITAL ARCHITECTURE
              </span>
            </div>
          </Link>

          {/* macOS Dock Divider 1 */}
          <div className="hidden lg:block w-[1px] h-5 bg-white/10 mx-1 shrink-0" />

          {/* Desktop Navigation Links (macOS Dock items) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative shrink-0"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.07, y: -2 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                    >
                      <Link
                        href={link.href}
                        className={`relative px-2 xl:px-2.5 py-1.5 rounded-full text-[11px] xl:text-xs font-medium transition-all flex items-center gap-1 shrink-0 whitespace-nowrap ${
                          isActive
                            ? 'text-emerald-300 bg-emerald-500/15 font-bold border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="whitespace-nowrap">{link.label}</span>
                        <motion.div
                          animate={{ rotate: servicesDropdown ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0"
                        >
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        </motion.div>

                        {/* macOS Active Dot Indicator */}
                        {isActive && (
                          <motion.span
                            layoutId="active-dock-dot"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>

                    {/* Services Dropdown Popover */}
                    <AnimatePresence>
                      {servicesDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full right-0 mt-2.5 w-72 rounded-2xl bg-[#030712]/95 backdrop-blur-3xl p-2.5 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] z-50"
                        >
                          <div className="text-[10px] font-bold text-gray-400 px-2.5 py-1.5 border-b border-white/5 mb-1.5 flex items-center justify-between">
                            <span>خدمات تخصصی دیجیتال</span>
                            <span className="text-[9px] text-emerald-400 font-mono">CORE SERVICES</span>
                          </div>
                          <div className="space-y-0.5">
                            {services.map((s) => (
                              <Link
                                key={s.id}
                                href={getSafeInternalUrl(s.dedicated_url, `/services/${s.slug}/`)}
                                className="block p-2 rounded-xl hover:bg-white/10 transition-colors group"
                              >
                                <div className="text-xs font-semibold text-white group-hover:text-emerald-300 flex items-center justify-between">
                                  <span className="whitespace-nowrap">{s.title}</span>
                                  <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all text-emerald-400 shrink-0" />
                                </div>
                                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                                  {s.short_description}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.07, y: -2 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  className="shrink-0"
                >
                  <Link
                    href={link.href}
                    className={`relative px-2 xl:px-2.5 py-1.5 rounded-full text-[11px] xl:text-xs font-medium transition-all block shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'text-emerald-300 bg-emerald-500/15 font-bold border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="whitespace-nowrap">{link.label}</span>

                    {/* macOS Active Dot Indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="active-dock-dot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* macOS Dock Divider 2 */}
          <div className="hidden lg:block w-[1px] h-5 bg-white/10 mx-1 shrink-0" />

          {/* Action CTAs & Phone */}
          <div className="hidden sm:flex items-center gap-1.5 xl:gap-2 shrink-0">
            {/* Phone Pill */}
            <motion.a
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              href={`tel:${settings.phone_e164}`}
              className="px-2.5 xl:px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-gray-200 hover:text-white hover:border-emerald-400/40 hover:bg-emerald-500/10 text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap shadow-sm group"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors shrink-0">
                <Phone className="w-2.5 h-2.5" />
              </div>
              <span className="font-mono dir-ltr text-[11px] xl:text-xs whitespace-nowrap font-semibold">
                {settings.phone_display}
              </span>
            </motion.a>

            {/* CTA Button */}
            <MagneticButton distance={0.35}>
              <motion.div
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="shrink-0"
              >
                <Link
                  href="/contact-us/"
                  className="px-3 xl:px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:brightness-110 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap"
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="whitespace-nowrap">شروع پروژه</span>
                    <ArrowLeft className="w-3 h-3 shrink-0" />
                  </span>
                </Link>
              </motion.div>
            </MagneticButton>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors cursor-pointer"
              aria-label="منوی سایت"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={transitionSpring}
            className="pointer-events-auto lg:hidden mt-2 rounded-2xl bg-[#030712]/95 backdrop-blur-2xl border border-white/10 p-4 shadow-2xl space-y-3 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-emerald-300 bg-emerald-500/15 font-semibold'
                          : 'text-gray-200 hover:text-emerald-300 hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>

                    {/* Sub-services on mobile if this is services */}
                    {link.hasDropdown && (
                      <div className="mr-3 mt-1 mb-2 pr-3 border-r border-white/10 space-y-1">
                        {services.map((s) => (
                          <Link
                            key={s.id}
                            href={getSafeInternalUrl(s.dedicated_url, `/services/${s.slug}/`)}
                            onClick={() => setIsOpen(false)}
                            className="block py-1.5 px-2 rounded-lg text-xs text-gray-400 hover:text-emerald-300 hover:bg-white/5 transition-colors"
                          >
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href={`tel:${settings.phone_e164}`}
                className="w-full py-2.5 rounded-xl border border-white/15 text-center text-white text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono dir-ltr whitespace-nowrap">{settings.phone_display}</span>
              </a>

              <Link
                href="/contact-us/"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-center text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
              >
                <span>استعلام آنلاین و شروع پروژه</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

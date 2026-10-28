'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Sparkles, ArrowLeft } from 'lucide-react';
import type { SiteSettings, Service } from '@/types/content';

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
    <header className="fixed top-2.5 sm:top-4 inset-x-0 mx-auto z-50 w-[95%] max-w-6xl pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto rounded-2xl sm:rounded-full transition-all duration-300 border border-white/10 ${
          scrolled
            ? 'bg-[#030712]/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-1.5 sm:py-2 px-3 sm:px-5'
            : 'bg-[#030712]/55 backdrop-blur-xl shadow-[0_6px_28px_rgba(0,0,0,0.35)] py-2 sm:py-2.5 px-3 sm:px-5 hover:bg-[#030712]/75'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo & Slogan (Authentic UrumSima identity) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/favicon.svg"
              alt="اروم سیما"
              className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform"
              width={32}
              height={32}
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-brand-300 transition-colors leading-tight">
                {settings.site_name}
              </span>
              <span className="text-[8px] text-brand-400 font-medium tracking-[1.5px] uppercase">
                DIGITAL ARCHITECTURE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <Link
                      href={link.href}
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                        isActive
                          ? 'text-brand-300 bg-brand-500/15 font-semibold'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-gray-400" />
                    </Link>

                    {/* Services Dropdown Menu */}
                    {servicesDropdown && (
                      <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-[#030712]/95 backdrop-blur-2xl p-2.5 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] font-bold text-gray-400 px-2.5 py-1.5 border-b border-white/5 mb-1.5">
                          دسته‌بندی خدمات استراتژیک
                        </div>
                        <div className="space-y-0.5">
                          {services.map((s) => (
                            <Link
                              key={s.id}
                              href={s.dedicated_url || `/services/${s.slug}/`}
                              className="block p-2 rounded-xl hover:bg-brand-500/15 transition-colors group"
                            >
                              <div className="text-xs font-semibold text-white group-hover:text-brand-300 flex items-center justify-between">
                                <span>{s.title}</span>
                                <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all text-brand-400" />
                              </div>
                              <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                                {s.short_description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'text-brand-300 bg-brand-500/15 font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Phone */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={`tel:${settings.phone_e164}`}
              className="px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-brand-500/40 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-3 h-3 text-brand-400" />
              <span className="font-mono dir-ltr text-[11px]">{settings.phone_display}</span>
            </a>

            <Link
              href="/contact-us/"
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <span>شروع پروژه</span>
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="منوی سایت"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="pointer-events-auto lg:hidden mt-2 rounded-2xl bg-[#030712]/95 backdrop-blur-2xl border border-white/10 p-4 shadow-2xl space-y-3 animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-200 hover:text-brand-300 hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href={`tel:${settings.phone_e164}`}
              className="w-full py-2 rounded-xl border border-white/15 text-center text-white text-xs font-medium flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-mono dir-ltr">{settings.phone_display}</span>
            </a>

            <Link
              href="/contact-us/"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-center text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>استعلام آنلاین و شروع پروژه</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

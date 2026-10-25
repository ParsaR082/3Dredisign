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

  const navLinks = [
    { label: 'صفحه اصلی', href: '/' },
    {
      label: 'خدمات تخصصی',
      href: '/services/',
      hasDropdown: true,
    },
    { label: 'نمونه‌کارها', href: '/portfolio/' },
    { label: 'تعرفه‌ها', href: '/pricing/' },
    { label: 'نمایندگی ابنر', href: '/abner/' },
    { label: 'درباره ما', href: '/about-us/' },
    { label: 'وبلاگ', href: '/blog/' },
    { label: 'تماس با ما', href: '/contact-us/' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050c0a]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-[#050c0a] border-b border-emerald-950/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Slogan (Authentic UrumSima identity) */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/favicon.svg"
              alt="اروم سیما"
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(14,148,110,0.5)] group-hover:scale-105 transition-transform"
              width={40}
              height={40}
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-brand-400 transition-colors">
                {settings.site_name}
              </span>
              <span className="text-[9.5px] text-gray-400 font-light tracking-[2px] uppercase">
                DIGITAL AGENCY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'text-brand-400 bg-brand-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </Link>

                    {/* Services Dropdown Menu */}
                    {servicesDropdown && (
                      <div className="absolute top-full right-0 mt-1 w-80 rounded-2xl glass-panel-elevated p-3 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="text-xs font-bold text-gray-400 px-3 py-2 border-b border-white/5 mb-2">
                          دسته‌بندی خدمات استراتژیک
                        </div>
                        <div className="space-y-1">
                          {services.map((s) => (
                            <Link
                              key={s.id}
                              href={s.dedicated_url || `/services/${s.slug}/`}
                              className="block p-2.5 rounded-xl hover:bg-brand-600/15 transition-colors group"
                            >
                              <div className="text-sm font-semibold text-white group-hover:text-brand-300 flex items-center justify-between">
                                <span>{s.title}</span>
                                <ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                              </div>
                              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Phone */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${settings.phone_e164}`}
              className="px-3 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-brand-500/40 text-xs font-medium flex items-center gap-2 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-mono dir-ltr">{settings.phone_display}</span>
            </a>

            <Link
              href="/contact-us/"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>شروع پروژه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="منوی سایت"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden glass-panel-elevated border-b border-white/10 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-gray-200 hover:text-brand-400 hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href={`tel:${settings.phone_e164}`}
              className="w-full py-2.5 rounded-xl border border-white/15 text-center text-white text-sm font-medium flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-400" />
              <span className="font-mono dir-ltr">{settings.phone_display}</span>
            </a>

            <Link
              href="/contact-us/"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-center text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>استعلام آنلاین و شروع پروژه</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

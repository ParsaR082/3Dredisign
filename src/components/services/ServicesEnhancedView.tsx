'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Compass, Layers } from 'lucide-react';
import type { Service } from '@/types/content';
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';
import { MeshGradient } from '@/components/ui/MeshGradient';
import { TextScramble } from '@/components/ui/TextScramble';
import { KineticTypography } from '@/components/ui/KineticTypography';
import { TiltCard } from '@/components/ui/TiltCard';
import { IsometricCreativeUniverse3D } from '@/components/3d/IsometricCreativeUniverse3D';
import { ProductConfigurator3D } from '@/components/3d/ProductConfigurator3D';
import { MagneticButton } from '@/components/ui/MagneticButton';

interface ServicesEnhancedViewProps {
  services: Service[];
}

export function ServicesEnhancedView({ services }: ServicesEnhancedViewProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Animated Mesh Gradient */}
      <MeshGradient intensity="subtle" speed={0.0008} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
        {/* Top Hero Section: Split 3D & Kinetic Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-semibold backdrop-blur-md">
              <Compass className="w-4 h-4 text-brand-400" />
              <span>پرتفوی خدمات جامع و مهندسی دیجیتال اروم‌سیما</span>
            </div>

            <KineticTypography
              text="۵ بال استراتژیک برای سلطه دیجیتال برند شما"
              as="h1"
              type="words"
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight"
            />

            <div className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-2xl font-light">
              <TextScramble
                text="ما زنجیره کامل خدمات بازاریابی، طراحی سه‌بعدی و مهندسی وب را در قالب ایستگاه‌های به‌هم‌پیوسته با استانداردهای تراز اول بین‌المللی ارائه می‌دهیم."
                duration={1.2}
              />
            </div>

            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <MagneticButton distance={0.3}>
                <Link
                  href="/contact-us/"
                  className="px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all block"
                >
                  شروع مشاوره تخصصی
                </Link>
              </MagneticButton>

              <a
                href="#configurator"
                className="px-6 py-3 rounded-full border border-white/10 hover:border-brand-500/40 text-gray-300 hover:text-white font-medium text-sm transition-colors"
              >
                آزمایشگاه پیکربندی ۳D ↓
              </a>
            </div>
          </div>

          {/* Isometric 3D Creative Universe */}
          <div className="lg:col-span-5 h-[420px] sm:h-[480px] lg:h-[540px] relative w-full">
            <IsometricCreativeUniverse3D />
          </div>
        </div>

        {/* Bento Grid: 5 Core Strategic Stations */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
              ARCHITECTURE & SERVICES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              ایستگاه‌های پنج‌گانه نوآوری
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              کارت‌های تعاملی با زاویه عمق ۳D Tilt و پرتو نور پویا (Cursor Spotlight)
            </p>
          </div>

          <BentoGrid>
            {services.map((service, idx) => {
              const colSpan = idx === 0 ? 2 : idx === 3 ? 2 : 1;
              return (
                <TiltCard
                  key={service.id}
                  maxTilt={8}
                  glare
                  className={`h-full ${colSpan === 2 ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
                >
                  <BentoCard
                    title={service.title}
                    subtitle={`ایستگاه ۰${idx + 1} • ${service.breadcrumb_label}`}
                    description={service.short_description}
                    icon={Layers}
                    badge="فعال و آماده ارجاع"
                    actionText="مشاهده پرونده تخصصی و تعرفه‌ها"
                    actionHref={service.dedicated_url || `/services/${service.slug}/`}
                    colSpan={1}
                    className="h-full border-0 bg-transparent p-0"
                  >
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                      {service.features.slice(0, 3).map((f, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 text-xs text-gray-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                          <span>{f.text}</span>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </TiltCard>
              );
            })}
          </BentoGrid>
        </div>

        {/* 3D Product & Device Configurator Section */}
        <div id="configurator" className="space-y-6 pt-4 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
                LABORATORY • 3D CONFIGURATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                آزمایشگاه تعاملی هویت بصری و متریال ۳D
              </h2>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              Physical Based Rendering (PBR)
            </span>
          </div>

          <ProductConfigurator3D />
        </div>
      </div>
    </div>
  );
}

export default ServicesEnhancedView;

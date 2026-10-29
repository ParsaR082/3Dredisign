'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
  graphic?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  gradient?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BentoCard({
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  graphic,
  actionText,
  actionHref,
  colSpan = 1,
  rowSpan = 1,
  gradient = 'from-brand-500/10 via-transparent to-brand-700/5',
  className = '',
  children,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const colClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3',
  }[colSpan];

  const rowClasses = {
    1: 'row-span-1',
    2: 'row-span-1 md:row-span-2',
  }[rowSpan];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-dark-surface/60 p-7 lg:p-8 backdrop-blur-xl transition-all duration-300 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10 ${colClasses} ${rowClasses} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(59, 130, 246, 0.12), transparent 40%)',
        }}
      />

      {/* Background Gradient */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {Icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
            )}
            {badge && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs font-medium text-brand-400 mb-1 tracking-wide">
              {subtitle}
            </p>
          )}

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
            {title}
          </h3>

          <p className="text-sm text-gray-400 leading-relaxed font-sans line-clamp-3">
            {description}
          </p>

          {/* Optional graphic slot inside */}
          {graphic && <div className="mt-5">{graphic}</div>}

          {children}
        </div>

        {/* Footer Action */}
        {actionText && actionHref && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <a
              href={actionHref}
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors group/link"
            >
              <span>{actionText}</span>
              <span className="transition-transform group-hover/link:-translate-x-1">
                ←
              </span>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

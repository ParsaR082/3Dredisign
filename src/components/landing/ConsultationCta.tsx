import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';

interface ConsultationCtaProps {
  badge: string;
  title: string;
  text: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
}

export default function ConsultationCta({
  badge,
  title,
  text,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}: ConsultationCtaProps) {
  return (
    <section className="contact-cta py-24 px-4 sm:px-6 bg-[#08120F] border-t border-emerald-500/20" id="consultation">
      <div className="contact-cta__inner rv max-w-4xl mx-auto text-center p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0B1A15] to-[#07130F] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {/* Glow orb in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <span className="contact-cta__lbl inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 relative z-10">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{badge || 'مشاوره رایگان'}</span>
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 relative z-10 leading-tight">
          {title || 'آماده رشد کسب‌وکارتان هستید؟'}
        </h2>

        <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-8 relative z-10">
          {text || 'برای مشاوره رایگان دیجیتال مارکتینگ، طراحی سایت، سئو و تولید محتوا با کارشناسان اروم سیما تماس بگیرید.'}
        </p>

        <div className="contact-cta__actions flex flex-wrap items-center justify-center gap-4 relative z-10">
          <Link
            href={primaryUrl || '/contact/'}
            className="btn-p px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
          >
            <span>{primaryLabel || 'دریافت مشاوره رایگان'}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <Link
            href={secondaryUrl || '/portfolio/'}
            className="btn-s px-6 py-3 rounded-full border border-emerald-500/30 text-gray-300 hover:text-white hover:border-emerald-400 text-sm font-bold transition-all"
          >
            {secondaryLabel || 'مشاهده نمونه‌کارها'}
          </Link>
        </div>
      </div>
    </section>
  );
}

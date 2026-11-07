import React from 'react';
import { MessageSquare, FileSearch, Handshake, Code2, Rocket } from 'lucide-react';

interface ProcessSectionProps {
  title: string;
  subtitle: string;
  desc: string;
  steps: { id: number; step_number: string; title: string; description: string }[];
}

export default function ProcessSection({ title, subtitle, desc, steps }: ProcessSectionProps) {
  if (!steps || steps.length === 0) return null;

  const toPersian = (num: string | number) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const getStepIcon = (idx: number) => {
    if (idx === 0) return <MessageSquare className="w-5 h-5" />;
    if (idx === 1) return <FileSearch className="w-5 h-5" />;
    if (idx === 2) return <Handshake className="w-5 h-5" />;
    if (idx === 3) return <Code2 className="w-5 h-5" />;
    return <Rocket className="w-5 h-5" />;
  };

  return (
    <section className="process py-20 px-4 sm:px-6 bg-[#08120F]" id="process">
      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] mx-auto">
        <div className="sec-hd rv text-center max-w-2xl 2xl:max-w-4xl mx-auto mb-16">
          <span className="sec-lbl inline-block text-emerald-400 text-xs 2xl:text-sm font-bold tracking-wider uppercase mb-2">
            {title || 'روند همکاری با اروم سیما'}
          </span>
          <h2 className="sec-title text-3xl md:text-4xl 2xl:text-5xl font-black text-white mb-4">
            {subtitle || 'مسیر شفاف ۵ مرحله‌ای'}
          </h2>
          <p className="sec-desc text-sm md:text-base 2xl:text-lg text-gray-400 font-light">
            {desc || 'از مشاوره اولیه تا اجرا و پشتیبانی، در کنار شما هستیم'}
          </p>
        </div>

        {/* 5-step horizontal timeline with connector line */}
        <div className="proc-timeline relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="proc-step group text-center flex flex-col items-center relative z-10 p-4 rounded-2xl bg-[#0B1814]/60 lg:bg-transparent border border-emerald-500/10 lg:border-none"
            >
              {/* Step Number Circle */}
              <div className="proc-num-wrap w-14 h-14 rounded-full bg-[#0D1C17] border-2 border-emerald-500/40 group-hover:border-emerald-400 flex items-center justify-center text-lg font-black text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-emerald-950/50 group-hover:scale-110 mb-4">
                {toPersian(step.step_number || idx + 1)}
              </div>

              {/* Icon */}
              <div className="proc-ico-lbl text-emerald-400/80 group-hover:text-emerald-300 mb-3 transition-colors">
                {getStepIcon(idx)}
              </div>

              {/* Title */}
              <h3 className="proc-title text-base font-bold text-white mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="proc-desc text-xs text-gray-400 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

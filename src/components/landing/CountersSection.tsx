'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Award, Users, CheckCircle2, Clock } from 'lucide-react';

interface CountersSectionProps {
  counters: {
    id: number;
    icon: string;
    value: number;
    suffix: string;
    label: string;
  }[];
}

export default function CountersSection({ counters }: CountersSectionProps) {
  const [counts, setCounts] = useState<{ [id: number]: number }>({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const toPersian = (num: number) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const getIcon = (iconName: string, idx: number) => {
    if (idx === 0) return <Award className="w-8 h-8" />;
    if (idx === 1) return <Users className="w-8 h-8" />;
    if (idx === 2) return <CheckCircle2 className="w-8 h-8" />;
    return <Clock className="w-8 h-8" />;
  };

  useEffect(() => {
    if (!counters || counters.length === 0 || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          counters.forEach((c) => {
            const target = c.value;
            let current = 0;
            const duration = 1500;
            const stepTime = 30;
            const totalSteps = duration / stepTime;
            const increment = Math.max(1, Math.ceil(target / totalSteps));

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounts((prev) => ({ ...prev, [c.id]: current }));
            }, stepTime);
          });
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [counters, hasAnimated]);

  if (!counters || counters.length === 0) return null;

  return (
    <section ref={sectionRef} className="counters bg-[#08120F] border-y border-emerald-500/20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="cnt-grid grid grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, idx) => (
            <div
              key={counter.id}
              className={`cnt-item group text-center relative p-6 transition-all duration-300 ${
                hasAnimated ? 'vis' : ''
              }`}
            >
              <div className="cnt-ico text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-125 transition-transform">
                {getIcon(counter.icon, idx)}
              </div>

              <div className="flex items-baseline justify-center gap-1 leading-none mb-2">
                <span className="cnt-num text-4xl sm:text-5xl font-black bg-gradient-to-b from-white to-emerald-300 bg-clip-text text-transparent">
                  {toPersian(counts[counter.id] !== undefined ? counts[counter.id] : counter.value)}
                </span>
                {counter.suffix && (
                  <span className="cnt-suf text-sm sm:text-base font-bold text-emerald-400">
                    {counter.suffix}
                  </span>
                )}
              </div>

              <div className="cnt-lbl text-xs sm:text-sm text-gray-400 font-medium">
                {counter.label}
              </div>

              {/* Bottom expanding line */}
              <div
                className={`cnt-bar w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto mt-4 transition-transform duration-1000 ${
                  hasAnimated ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

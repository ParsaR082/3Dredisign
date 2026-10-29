'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StoryStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  graphic?: React.ReactNode;
}

interface ScrollytellingProps {
  steps: StoryStep[];
  className?: string;
}

export function Scrollytelling({ steps, className = '' }: ScrollytellingProps) {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const stepEls = containerRef.current.querySelectorAll('.story-step-marker');
      const windowCenter = window.innerHeight / 2;

      stepEls.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowCenter && rect.bottom >= windowCenter) {
          setActiveStep(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        {/* Sticky Graphics Visual Panel */}
        <div className="w-full lg:w-1/2 sticky top-28 h-[360px] sm:h-[460px] rounded-3xl border border-white/10 bg-dark-surface/70 backdrop-blur-2xl p-6 lg:p-8 flex items-center justify-center overflow-hidden z-10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="w-full h-full flex flex-col items-center justify-center text-center"
            >
              {steps[activeStep].graphic ? (
                steps[activeStep].graphic
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-20 w-20 rounded-3xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-3xl font-mono text-brand-300">
                    0{activeStep + 1}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {steps[activeStep].title}
                  </h4>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeStep === i
                    ? 'w-6 bg-brand-400'
                    : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scrolling Narrative Steps */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-32 py-12">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`story-step-marker p-6 sm:p-8 rounded-3xl border transition-all duration-500 ${
                activeStep === idx
                  ? 'border-brand-500/40 bg-brand-500/10 shadow-lg shadow-brand-500/5'
                  : 'border-white/5 bg-white/[0.02] opacity-40 hover:opacity-70'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {step.badge}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  مرحله ۰{idx + 1} از ۰{steps.length}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

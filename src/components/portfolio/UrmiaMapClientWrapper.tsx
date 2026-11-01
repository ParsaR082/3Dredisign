'use client';

import dynamic from 'next/dynamic';
import type { Project } from '@/types/content';

const UrmiaInteractiveMap = dynamic(
  () => import('./UrmiaInteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] sm:h-[620px] lg:h-[680px] rounded-2xl sm:rounded-3xl bg-dark-card/90 border border-white/10 flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-8 w-8">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-brand-500"></span>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 font-medium animate-pulse">
          در حال بارگذاری نقشه تعاملی کلانشهر ارومیه...
        </p>
      </div>
    ),
  }
);

interface UrmiaMapClientWrapperProps {
  projects: Project[];
}

export default function UrmiaMapClientWrapper({ projects }: UrmiaMapClientWrapperProps) {
  return <UrmiaInteractiveMap projects={projects} />;
}

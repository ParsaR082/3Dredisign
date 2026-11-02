'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PageTransition } from '@/components/ui/PageTransition';

export default function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCampus3D = Boolean(pathname && (pathname === '/campus-3d' || pathname.startsWith('/campus-3d')));

  if (isCampus3D) {
    return (
      <main className="w-screen h-screen overflow-hidden p-0 m-0 relative">
        {children}
      </main>
    );
  }

  return (
    <main className="flex-grow pt-20">
      <PageTransition>{children}</PageTransition>
    </main>
  );
}

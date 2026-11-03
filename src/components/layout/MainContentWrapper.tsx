'use client';

import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';

export default function MainContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-grow pt-20">
      <PageTransition>{children}</PageTransition>
    </main>
  );
}

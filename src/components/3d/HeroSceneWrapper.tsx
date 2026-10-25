'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const HeroSceneInternal = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-44 h-44 rounded-full bg-brand-600/20 blur-3xl animate-pulse" />
    </div>
  ),
});

export default function HeroSceneWrapper() {
  return <HeroSceneInternal />;
}

'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const TechLeadPlanetInternal = dynamic(() => import('./TechLeadPlanet'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 rounded-2xl animate-pulse" />,
});

interface Props {
  planetType: string;
  accentColor: string;
}

export default function TechLeadPlanetWrapper(props: Props) {
  return <TechLeadPlanetInternal {...props} />;
}

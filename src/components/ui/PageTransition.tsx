'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // If on 3D home page, do not apply DOM transition wrappers that could disrupt the WebGL canvas
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}

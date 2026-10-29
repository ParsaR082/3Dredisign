'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StackingCardItem {
  id: string | number;
  content: React.ReactNode;
}

interface StackingCardsProps {
  items: StackingCardItem[];
  className?: string;
}

function StackingCard({
  item,
  index,
  total,
}: {
  item: StackingCardItem;
  index: number;
  total: number;
}) {
  const topOffset = 80 + index * 24; // sticky top offset

  return (
    <div
      style={{ top: `${topOffset}px` }}
      className="sticky mb-12 sm:mb-16 will-change-transform"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="w-full"
      >
        {item.content}
      </motion.div>
    </div>
  );
}

export function StackingCards({ items, className = '' }: StackingCardsProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {items.map((item, index) => (
        <StackingCard
          key={item.id}
          item={item}
          index={index}
          total={items.length}
        />
      ))}
    </div>
  );
}

export default StackingCards;

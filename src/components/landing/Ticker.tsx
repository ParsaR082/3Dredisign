import React from 'react';

interface TickerProps {
  items: { id: number; text: string }[];
}

export default function Ticker({ items }: TickerProps) {
  if (!items || items.length === 0) return null;

  // Duplicate items 4 times to ensure seamless infinite scroll
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="ticker ticker--hero" aria-label="افتخارات و پیام‌های کلیدی">
      <div className="tk-track">
        {repeated.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="tk-item">
            <span className="tk-dot" aria-hidden="true" />
            <span className="tk-item-txt">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

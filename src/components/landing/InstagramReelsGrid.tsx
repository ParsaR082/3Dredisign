'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface InstagramReelsGridProps {
  config: {
    is_active: boolean;
    title: string;
    subtitle: string;
    placeholder_text: string;
    follow_cta_text: string;
  };
  reels: {
    id: number;
    reel_url: string;
    thumbnail: string;
    caption: string;
  }[];
  instagramUrl?: string;
}

export default function InstagramReelsGrid({
  config,
  reels,
  instagramUrl = 'https://www.instagram.com/urum.sima/',
}: InstagramReelsGridProps) {
  if (!config.is_active || !reels || reels.length === 0) return null;

  const resolvedInstagramUrl =
    instagramUrl && !instagramUrl.includes('urum_sima')
      ? instagramUrl
      : 'https://www.instagram.com/urum.sima/';

  const getMediaUrl = (url?: string | null) => {
    if (!url) return '/images/urumsima3.webp';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }
    return `/media/${url}`;
  };

  // Active index defaults to middle card, matching the original Math.floor(cards.length / 2)
  const [activeIndex, setActiveIndex] = useState<number>(() => Math.floor(reels.length / 2));
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Resize handler matching original layout() breakpoints
  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      setIsMobile(w <= 640);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const total = reels.length;

  const go = useCallback(
    (n: number) => {
      setActiveIndex((n + total) % total);
    },
    [total]
  );

  const handleNext = useCallback(() => {
    // In original landing-sections.js: data-dir="1" -> idx + 1
    go(activeIndex + 1);
  }, [activeIndex, go]);

  const handlePrev = useCallback(() => {
    // In original landing-sections.js: data-dir="-1" -> idx - 1
    go(activeIndex - 1);
  }, [activeIndex, go]);

  // Touch / swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (isMobile) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isMobile) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (isMobile || touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> Next
        handleNext();
      } else {
        // Swiped right -> Prev
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation when section is in view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = document.getElementById('instagram-reels');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Click on card:
  // If card is not the active one, bring it forward instead of navigating away (matching original landing-sections.js)
  const handleCardClick = (e: React.MouseEvent, index: number) => {
    if (isMobile) return;
    if (index !== activeIndex) {
      e.preventDefault();
      go(index);
    }
  };

  // Compute spread and depth matching landing-sections.js
  const spread = windowWidth < 900 ? 38 : windowWidth < 1200 ? 48 : 56;
  const depth = windowWidth < 900 ? 120 : 170;
  const visible = windowWidth < 900 ? 1 : 2;

  return (
    <section className="reels-section rv" id="instagram-reels">
      <div className="reels-inner">
        {/* Header */}
        <div className="reels-head">
          <span className="reels-badge">اینستاگرام</span>
          <h2 className="reels-title">{config.title || 'آخرین Reels ما'}</h2>
          {config.subtitle && <p className="reels-subtitle">{config.subtitle}</p>}
        </div>

        {/* 3D Stage */}
        <div
          className="reels-stage"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="reels-grid reels-3d" role="list">
            {reels.map((reel, i) => {
              const d = i - activeIndex;
              const a = Math.abs(d);
              const isActive = d === 0;

              // When mounted and not mobile: calculate exact 3D coverflow transforms
              // When on mobile (<= 640px) or SSR: styles are cleared so CSS media queries take over
              const cardStyle: React.CSSProperties =
                mounted && !isMobile
                  ? {
                      transform: `translateX(${d * spread}%) translateZ(${-a * depth}px) rotateY(${d * -26}deg) scale(${1 - a * 0.05})`,
                      zIndex: 100 - a,
                      opacity: a > visible ? 0 : 1,
                      pointerEvents: a > visible ? 'none' : undefined,
                    }
                  : {};

              return (
                <a
                  key={reel.id}
                  href={reel.reel_url}
                  onClick={(e) => handleCardClick(e, i)}
                  className={`reels-card ${isActive ? 'is-active' : ''}`}
                  style={cardStyle}
                  role="listitem"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={reel.caption || 'مشاهده Reel در اینستاگرام'}
                >
                  <div className="reels-card__media relative overflow-hidden">
                    <Image
                      src={getMediaUrl(reel.thumbnail)}
                      alt={reel.caption || 'Reel اروم سیما'}
                      loading="lazy"
                      width={270}
                      height={480}
                      sizes="(max-width: 640px) 70vw, 270px"
                      className="w-full h-full object-cover"
                    />
                    <span className="reels-card__play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="reels-card__ig" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                  </div>

                  {reel.caption && <p className="reels-card__caption">{reel.caption}</p>}
                </a>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons and Dots */}
        <div className="reels-nav">
          <button
            type="button"
            className="reels-nav__btn"
            onClick={handleNext}
            aria-label="بعدی"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="reels-nav__dots" role="tablist" aria-label="انتخاب اسلاید ریلز">
            {reels.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                className={`reels-nav__dot ${i === activeIndex ? 'act' : ''}`}
                onClick={() => go(i)}
                aria-label={`اسلاید ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="reels-nav__btn"
            onClick={handlePrev}
            aria-label="قبلی"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Follow CTA Button */}
        {resolvedInstagramUrl && (
          <div className="reels-foot">
            <a
              href={resolvedInstagramUrl}
              className="reels-follow-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{config.follow_cta_text || 'ما را در اینستاگرام دنبال کنید'}</span>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

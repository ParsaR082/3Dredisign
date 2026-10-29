'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_CHARS = '0123456789!@#$%^&*()_+~|}{[]:;?><=ABCDEFGHIJKLMNOPQRSTUVWXYZابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';

interface TextScrambleProps {
  text: string;
  triggerOn?: 'hover' | 'inView' | 'mount';
  duration?: number;
  chars?: string;
  className?: string;
}

export function TextScramble({
  text,
  triggerOn = 'hover',
  duration = 800,
  chars = DEFAULT_CHARS,
  className = '',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const scramble = useCallback(() => {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text);
      return;
    }

    if (isScrambling) return;
    setIsScrambling(true);

    const length = text.length;
    const startTime = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      // How many characters should be resolved
      const resolvedCount = Math.floor(progress * length);

      let result = '';
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < resolvedCount) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(update);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
      }
    };

    frameRef.current = requestAnimationFrame(update);
  }, [chars, duration, isScrambling, text]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (triggerOn === 'mount') {
      scramble();
    } else if (triggerOn === 'inView' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            scramble();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [triggerOn, scramble]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={triggerOn === 'hover' ? scramble : undefined}
      className={`inline-block font-mono tracking-tight cursor-default ${className}`}
    >
      {displayText}
    </span>
  );
}

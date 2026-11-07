'use client';

import React, { useState } from 'react';

interface BackstageVideoPlayerProps {
  src?: string | null;
  poster: string;
  title: string;
}

export default function BackstageVideoPlayer({ src, poster, title }: BackstageVideoPlayerProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative w-full h-full max-h-[78vh] flex items-center justify-center rounded-2xl overflow-hidden bg-black">
      {src && !videoError ? (
        <video
          src={src}
          poster={poster || '/images/urumsima3.webp'}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="w-full h-full max-h-[75vh] object-contain relative z-10"
          onError={() => setVideoError(true)}
        />
      ) : (
        <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center group">
          <img
            src={poster || '/images/urumsima3.webp'}
            alt={title}
            className="w-full h-full max-h-[75vh] object-contain group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col items-center justify-end p-6 text-center text-white">
            <div className="px-4 py-2 rounded-2xl bg-black/75 border border-white/10 text-xs text-gray-200 backdrop-blur-md">
              {src && videoError
                ? 'فایل ویدیویی در دسترس نیست • نمایش تصویر صحنه'
                : 'پخش مستقیم اختصاصی در وبسایت اروم‌سیما'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

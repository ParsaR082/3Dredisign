import React from 'react';
import { Play, ArrowLeft, Instagram } from 'lucide-react';

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
  instagramUrl = 'https://instagram.com/urum_sima',
}: InstagramReelsGridProps) {
  if (!config.is_active || !reels || reels.length === 0) return null;

  return (
    <section className="reels-section rv py-16 px-4 sm:px-6 bg-[#060D0B] border-y border-emerald-500/15" id="instagram-reels">
      <div className="reels-inner max-w-7xl mx-auto">
        <div className="reels-head text-center mb-12">
          <span className="reels-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-3">
            <Instagram className="w-3.5 h-3.5" />
            <span>اینستاگرام</span>
          </span>
          <h2 className="reels-title text-3xl md:text-4xl font-black text-white mb-3">
            {config.title || 'آخرین Reels ما'}
          </h2>
          {config.subtitle && (
            <p className="reels-subtitle text-sm md:text-base text-gray-400 max-w-xl mx-auto font-light">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="reels-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-10" role="list">
          {reels.map((reel) => (
            <a
              key={reel.id}
              href={reel.reel_url}
              className="reels-card group relative flex flex-col rounded-2xl overflow-hidden bg-[#0A1613] border border-emerald-500/20 hover:border-emerald-400/50 shadow-lg hover:shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-1.5"
              role="listitem"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={reel.caption || 'مشاهده Reel در اینستاگرام'}
            >
              <div className="reels-card__media relative aspect-[9/16] overflow-hidden bg-emerald-950/40">
                <img
                  src={reel.thumbnail}
                  alt={reel.caption || 'Reel اروم سیما'}
                  loading="lazy"
                  decoding="async"
                  width={270}
                  height={480}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Play Button Overlay */}
                <span
                  className="reels-card__play absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/20 transition-colors"
                  aria-hidden="true"
                >
                  <span className="w-12 h-12 rounded-full bg-emerald-600/90 flex items-center justify-center text-white shadow-lg shadow-emerald-600/50 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </span>

                {/* Instagram Icon Badge */}
                <span
                  className="reels-card__ig absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/10"
                  aria-hidden="true"
                >
                  <Instagram className="w-4 h-4" />
                </span>
              </div>

              {reel.caption && (
                <div className="p-3 bg-[#0A1613]">
                  <p className="reels-card__caption text-xs font-semibold text-gray-200 line-clamp-2 leading-relaxed text-right">
                    {reel.caption}
                  </p>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="reels-foot text-center">
          <a
            href={instagramUrl}
            className="reels-follow-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="w-4 h-4" />
            <span>{config.follow_cta_text || 'ما را در اینستاگرام دنبال کنید'}</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

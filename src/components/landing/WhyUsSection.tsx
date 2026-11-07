import React from 'react';

interface WhyUsSectionProps {
  title: string;
  subtitle: string;
  items: { id: number; number: string; title: string; description: string }[];
  sideImage?: string;
  sideImageAlt?: string;
}

export default function WhyUsSection({
  title,
  subtitle,
  items,
  sideImage = '/images/team-photo.webp',
  sideImageAlt = 'تیم اروم سیما',
}: WhyUsSectionProps) {
  if (!items || items.length === 0) return null;

  // Convert number to Persian
  const toPersian = (num: number | string) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  return (
    <section className="why py-20 px-4 sm:px-6 bg-[#050C0A]">
      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] mx-auto">
        <div className="sec-hd rv text-center max-w-2xl 2xl:max-w-4xl mx-auto mb-14">
          <span className="sec-lbl inline-block text-emerald-400 text-xs 2xl:text-sm font-bold tracking-wider uppercase mb-2">
            {title || 'چرا اروم سیما؟'}
          </span>
          <h2 className="sec-title text-3xl md:text-4xl 2xl:text-5xl font-black text-white">
            {subtitle || 'مزیت‌های رقابتی ما'}
          </h2>
        </div>

        <div className="why-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Why Items Left List */}
          <div className="rv-l space-y-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="why-item flex items-start gap-5 p-5 sm:p-6 rounded-2xl bg-[#091512] border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-x-2"
              >
                <div className="why-num text-3xl sm:text-4xl font-black bg-gradient-to-b from-emerald-300 to-teal-500 bg-clip-text text-transparent min-w-[48px] leading-none pt-1">
                  {toPersian(item.number || idx + 1)}
                </div>
                <div className="why-txt">
                  <h3 className="why-item-title text-base sm:text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Banner Image */}
          <div className="rv-r flex justify-center">
            <div className="why-banner relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#091512] shadow-2xl">
              <img
                src={sideImage}
                alt={sideImageAlt}
                loading="lazy"
                decoding="async"
                width={800}
                height={900}
                className="why-banner__img w-full h-auto aspect-[4/5] object-cover transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050C0A] via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

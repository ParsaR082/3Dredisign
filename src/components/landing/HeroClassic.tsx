import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Check, Play } from 'lucide-react';

interface HeroClassicProps {
  badge: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  service1Title?: string;
  service2Title?: string;
  service3Title?: string;
  service4Title?: string;
  trust1?: string;
  trust2?: string;
  trust3?: string;
  trust4?: string;
  counters?: { value: number; suffix: string; label: string }[];
}

export default function HeroClassic({
  badge,
  title,
  highlight,
  description,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  service1Title = 'طراحی سایت',
  service2Title = 'سئو حرفه‌ای',
  service3Title = 'تبلیغات دیجیتال',
  service4Title = 'تولید محتوا',
  trust1 = 'پشتیبانی ۲۴/۷',
  trust2 = 'تحویل به‌موقع',
  trust3 = 'ضمانت کیفیت',
  trust4 = 'مشاوره رایگان',
  counters = [],
}: HeroClassicProps) {
  // Convert Persian numbers
  const toPersian = (num: number | string) => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  return (
    <section className="hero">
      <div className="h-spot" aria-hidden="true" />
      <div className="hbg-grid" aria-hidden="true" />
      <div className="orb orb1" aria-hidden="true" />
      <div className="orb orb2" aria-hidden="true" />
      <div className="orb orb3" aria-hidden="true" />

      <div className="hero-container rv">
        <div className="hero-text">
          {/* Badge */}
          {badge && (
            <div className="h-badge">
              <div className="h-badge-dot" />
              <span className="h-badge-txt">{badge}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="h-title">
            <span className="l1">{title}</span>
            {highlight && <span className="l2">{highlight}</span>}
          </h1>

          <span className="h-rule" aria-hidden="true" />

          {/* Description */}
          {description && <p className="h-desc">{description}</p>}

          {/* Quick Service Pills */}
          <div className="h-services-quick">
            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                </svg>
              </div>
              <span>{service1Title}</span>
            </div>

            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span>{service2Title}</span>
            </div>

            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 11v2a1 1 0 0 0 1 1h1l2 9h12l2-9h1a1 1 0 0 0 1-1v-2" />
                  <path d="M12 3a4 4 0 0 1 4 4v1H8V7a4 4 0 0 1 4-4z" />
                </svg>
              </div>
              <span>{service3Title}</span>
            </div>

            <div className="h-sq-card">
              <div className="h-sq-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <span>{service4Title}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="h-actions">
            {primaryCtaText && (
              <Link href={primaryCtaUrl || '/contact/'} className="btn-p">
                <span>{primaryCtaText}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}

            {secondaryCtaText && (
              <Link href={secondaryCtaUrl || '/services/'} className="btn-s">
                <div className="btn-s-icon">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>{secondaryCtaText}</span>
              </Link>
            )}
          </div>

          {/* Trust Bar */}
          <div className="h-trust-bar">
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust1}</span>
            </div>
            <div className="h-trust-dot" />
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust2}</span>
            </div>
            <div className="h-trust-dot" />
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust3}</span>
            </div>
            <div className="h-trust-dot" />
            <div className="h-trust-item">
              <Check className="w-3.5 h-3.5" />
              <span>{trust4}</span>
            </div>
          </div>

          {/* Stats */}
          {counters.length > 0 && (
            <div className="h-stats">
              {counters.slice(0, 3).map((stat, idx) => (
                <React.Fragment key={idx}>
                  <div className="h-stat">
                    <span className="h-stat-n">
                      {toPersian(stat.value)}
                      {stat.suffix && <sup>{stat.suffix}</sup>}
                    </span>
                    <div className="h-stat-l">{stat.label}</div>
                  </div>
                  {idx < Math.min(counters.length, 3) - 1 && <div className="h-stat-div" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

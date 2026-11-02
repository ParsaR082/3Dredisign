import React from 'react';

export default function TeamBanner() {
  return (
    <div className="team-banner">
      <picture>
        <source media="(max-width: 480px)" srcSet="/images/team-hero-mobile.webp" type="image/webp" />
        <source media="(max-width: 900px)" srcSet="/images/team-hero-tablet.webp" type="image/webp" />
        <source srcSet="/images/team-hero.webp" type="image/webp" />
        <img
          src="/images/team-hero.webp"
          alt="تیم اروم سیما"
          loading="eager"
          decoding="async"
          className="team-banner__img"
          sizes="100vw"
          width={1920}
          height={700}
        />
      </picture>
      <div className="team-banner__fade-top" aria-hidden="true" />
      <div className="team-banner__fade-bottom" aria-hidden="true" />
      <div className="team-banner__overlay" aria-hidden="true" />
      <div className="team-banner__label">
        <div className="team-banner__label-line" />
        <span className="team-banner__label-text">THE TEAM</span>
      </div>
    </div>
  );
}

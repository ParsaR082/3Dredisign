import React from 'react';
import type { LiveLandingFullData, SiteSettings } from '@/types/content';
import TeamBanner from './TeamBanner';
import Ticker from './Ticker';
import HeroClassic from './HeroClassic';
import PortfolioSection from './PortfolioSection';
import InstagramReelsGrid from './InstagramReelsGrid';
import MapTeaser from './MapTeaser';
import BeforeAfterSlider from './BeforeAfterSlider';
import ServicesSection from './ServicesSection';
import WhyUsSection from './WhyUsSection';
import CountersSection from './CountersSection';
import GrowthSection from './GrowthSection';
import ProcessSection from './ProcessSection';
import TestimonialsSection from './TestimonialsSection';
import RoiCalculatorWidget from './RoiCalculatorWidget';
import PricingSection from './PricingSection';
import ConsultationCta from './ConsultationCta';

interface ClassicLandingViewProps {
  data: LiveLandingFullData;
  settings: SiteSettings;
}

export default function ClassicLandingView({ data, settings }: ClassicLandingViewProps) {
  const {
    landingPage,
    tickerItems,
    whyItems,
    counters,
    growthStats,
    processSteps,
    testimonials,
    roiConfig,
    reelsConfig,
    reels,
    mapProjectsCount,
    mapProjects,
    beforeAfterProject,
    featuredProjects,
    services,
    pricingPlans,
  } = data;

  return (
    <div className="landing-top w-full overflow-hidden bg-[#050C0A] text-white">
      {/* Top Spacer for fixed navbar */}
      <div className="nav-spacer h-20 sm:h-24" aria-hidden="true" />

      {/* 1. Team Banner */}
      <TeamBanner />

      {/* 2. Marquee Ticker */}
      {landingPage.show_ticker && tickerItems.length > 0 && (
        <Ticker items={tickerItems} />
      )}

      {/* 3. Hero Section */}
      <HeroClassic
        badge={landingPage.hero_badge}
        title={landingPage.hero_title}
        highlight={landingPage.hero_highlight}
        description={landingPage.hero_description}
        primaryCtaText={landingPage.primary_cta_text}
        primaryCtaUrl={landingPage.primary_cta_url}
        secondaryCtaText={landingPage.secondary_cta_text}
        secondaryCtaUrl={landingPage.secondary_cta_url}
        service1Title={landingPage.hero_service_1_title}
        service2Title={landingPage.hero_service_2_title}
        service3Title={landingPage.hero_service_3_title}
        service4Title={landingPage.hero_service_4_title}
        trust1={landingPage.hero_trust_1}
        trust2={landingPage.hero_trust_2}
        trust3={landingPage.hero_trust_3}
        trust4={landingPage.hero_trust_4}
        counters={counters}
      />

      {/* 4. Portfolio Section */}
      {landingPage.show_portfolio && featuredProjects.length > 0 && (
        <PortfolioSection
          sectionTitle={landingPage.portfolio_section_title}
          sectionSubtitle={landingPage.portfolio_section_subtitle}
          sectionDesc={landingPage.portfolio_section_desc}
          projects={featuredProjects}
        />
      )}

      {/* 5. Instagram Reels Grid */}
      {reelsConfig.is_active && reels.length > 0 && (
        <InstagramReelsGrid
          config={reelsConfig}
          reels={reels}
          instagramUrl={settings.instagram_url}
        />
      )}

      {/* 6. Projects Map Teaser */}
      {mapProjectsCount > 0 && (
        <MapTeaser
          projectsCount={mapProjectsCount}
          projects={mapProjects}
        />
      )}

      {/* 7. Before / After Transformation Slider */}
      {beforeAfterProject && (
        <BeforeAfterSlider project={beforeAfterProject} />
      )}

      {/* 8. Core Services Section */}
      {landingPage.show_services && services.length > 0 && (
        <ServicesSection
          sectionTitle={landingPage.services_section_title}
          sectionSubtitle={landingPage.services_section_subtitle}
          sectionDesc={landingPage.services_section_desc}
          services={services}
        />
      )}

      {/* 9. Why Choose Us Section */}
      {landingPage.show_why && whyItems.length > 0 && (
        <WhyUsSection
          title={landingPage.why_section_title}
          subtitle={landingPage.why_section_subtitle}
          items={whyItems}
          sideImage={landingPage.why_side_image}
          sideImageAlt={landingPage.why_side_image_alt}
        />
      )}

      {/* 10. Dynamic Animated Stat Counters */}
      {landingPage.show_counters && counters.length > 0 && (
        <CountersSection counters={counters} />
      )}

      {/* 11. Growth Trajectory & Chart */}
      {landingPage.show_growth && growthStats.length > 0 && (
        <GrowthSection
          badge={landingPage.growth_section_badge}
          title={landingPage.growth_section_title}
          desc={landingPage.growth_section_desc}
          stats={growthStats}
        />
      )}

      {/* 12. 5-Step Process Timeline */}
      {landingPage.show_process && processSteps.length > 0 && (
        <ProcessSection
          title={landingPage.process_section_title}
          subtitle={landingPage.process_section_subtitle}
          desc={landingPage.process_section_desc}
          steps={processSteps}
        />
      )}

      {/* 13. Testimonials & Client Reviews */}
      {landingPage.show_testimonials && (
        <TestimonialsSection
          title={landingPage.testimonial_section_title}
          subtitle={landingPage.testimonial_section_subtitle}
          testimonials={testimonials}
        />
      )}

      {/* 14. Interactive ROI Growth Calculator */}
      {roiConfig.is_active && (
        <RoiCalculatorWidget config={roiConfig} />
      )}

      {/* 15. Pricing Packages */}
      {landingPage.show_pricing && pricingPlans.length > 0 && (
        <PricingSection
          title={landingPage.pricing_section_title}
          subtitle={landingPage.pricing_section_subtitle}
          desc={landingPage.pricing_section_desc}
          plans={pricingPlans}
        />
      )}

      {/* 16. Pre-Footer Consultation CTA */}
      <ConsultationCta
        badge={landingPage.bottom_cta_badge}
        title={landingPage.bottom_cta_title}
        text={landingPage.bottom_cta_text}
        primaryLabel={landingPage.bottom_cta_primary_label}
        primaryUrl={landingPage.bottom_cta_primary_url}
        secondaryLabel={landingPage.bottom_cta_secondary_label}
        secondaryUrl={landingPage.bottom_cta_secondary_url}
      />
    </div>
  );
}

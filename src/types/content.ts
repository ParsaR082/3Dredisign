// TypeScript contracts directly aligned with Django models and field mappings

export interface SiteSettings {
  site_name: string;
  site_slogan: string;
  phone_display: string;
  phone_e164: string;
  whatsapp_number: string;
  office_address: string;
  office_city: string;
  office_region: string;
  office_latitude: number | string;
  office_longitude: number | string;
  map_zoom: number | string;
  show_contact_map: boolean;
  instagram_url: string;
  telegram_url: string;
  rubika_url: string;
  linkedin_url?: string;
  footer_about_text: string;
  footer_working_hours: string;
  footer_copyright_text: string;
  meta_title_default: string;
  meta_description_default: string;
  default_robots: string;
  default_og_image?: string | null;
}

export interface LandingHero {
  badge: string;
  title_line1: string;
  title_highlight: string;
  title_line2: string;
  subtitle: string;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
  badge_reviews: string;
  experience_years: string;
}

export interface StatItem {
  value: string;
  label: string;
  detail: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  duration: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  avatar?: string;
}

export interface LandingData {
  hero: LandingHero;
  stats: StatItem[];
  why_us_title: string;
  why_us_subtitle: string;
  why_us_items: FeatureItem[];
  process_title: string;
  process_subtitle: string;
  process_steps: ProcessStep[];
  testimonials: Testimonial[];
  trust_tickers: string[];
}

export interface ServiceFeature {
  icon: string;
  text: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServicePackage {
  name: string;
  price: string;
  period: string;
  is_popular?: boolean;
  features: string[];
}

export interface Service {
  id: string;
  slug: string;
  dedicated_url?: string;
  title: string;
  breadcrumb_label: string;
  canonical_url: string;
  short_description: string;
  description: string;
  icon: string;
  meta_title: string;
  meta_description: string;
  features_section_title: string;
  features_intro: string;
  features: ServiceFeature[];
  why_us_title: string;
  why_us_intro: string;
  why_us_bullets: string[];
  faq_section_title: string;
  faqs: ServiceFAQ[];
  packages?: ServicePackage[];
}

export interface ProjectKPI {
  label: string;
  value: string;
  detail?: string;
}

export interface ProjectTimelineStep {
  date?: string;
  title: string;
  description: string;
}

export interface ProjectROI {
  cost?: number;
  revenue?: number;
  percentage?: number;
}

export interface ProjectVideo {
  id: number;
  title: string;
  video_file?: string | null;
  optimized_file?: string | null;
  embed_url?: string | null;
  thumbnail?: string | null;
  orientation?: string;
  width?: number | null;
  height?: number | null;
  order: number;
}

export interface ProjectImage {
  id: number;
  image: string;
  caption?: string;
  orientation?: string;
  width?: number | null;
  height?: number | null;
  order: number;
}

export interface ProjectMockups {
  desktop?: string;
  mobile?: string;
  tablet?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  category_slug: string;
  additional_categories?: string[];
  additional_category_slugs?: string[];
  industry: string;
  technologies: string[];
  description: string;
  detailed_description: string;
  challenge?: string;
  featured: boolean;
  recent?: boolean;
  popular?: boolean;
  project_date: string;
  website_url?: string;
  pdf_url?: string;
  thumbnail_image: string;
  thumbnail_video_url?: string | null;
  mockups?: ProjectMockups;
  kpis: ProjectKPI[];
  timeline_steps?: ProjectTimelineStep[];
  roi?: ProjectROI;
  videos?: ProjectVideo[];
  gallery?: ProjectImage[];
  location_zone?: string;
  latitude?: number;
  longitude?: number;
  show_on_map?: boolean;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
  cover_image?: string | null;
  description?: string;
  icon?: string;
  order?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface PricingPlan {
  id: number;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  billing_period?: string;
  custom_price_text?: string;
  is_popular: boolean;
  order: number;
  features: string[];
}

export interface PricingSettings {
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  hero_badge: string;
  hero_title: string;
  hero_description: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  plans_section_title: string;
  plans_section_subtitle: string;
}

export interface TechLead {
  name: string;
  role: string;
  skills: string[];
  years_experience: number;
  total_projects: number;
  accent_color: string;
  planet_type: 'rocky' | 'gas_giant' | 'ice' | 'lava' | 'crystal' | 'ringed';
  tagline: string;
  poster_image?: string;
  order: number;
}

export interface AboutSettings {
  title: string;
  subtitle: string;
  vision: string;
  mission: string;
  stats: StatItem[];
}

export interface AbnerProduct {
  name: string;
  category: string;
  pitch: string;
  description: string;
  specs: Record<string, string>;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  published_at: string;
  reading_time: string;
  cover_image: string;
  tags: string[];
}

export interface LiveLandingFullData {
  landingPage: {
    site_title: string;
    hero_image?: string | null;
    meta_title?: string;
    meta_description?: string;
    og_title?: string;
    og_description?: string;
    canonical_url?: string;
    meta_robots?: string;
    og_image?: string;
    hero_badge: string;
    hero_title: string;
    hero_highlight: string;
    hero_description: string;
    primary_cta_text: string;
    primary_cta_url: string;
    secondary_cta_text: string;
    secondary_cta_url: string;
    services_section_title: string;
    services_section_subtitle: string;
    services_section_desc: string;
    why_section_title: string;
    why_section_subtitle: string;
    why_side_image?: string;
    why_side_image_alt?: string;
    why_side_image_link?: string;
    portfolio_section_title: string;
    portfolio_section_subtitle: string;
    portfolio_section_desc: string;
    process_section_title: string;
    process_section_subtitle: string;
    process_section_desc: string;
    testimonial_section_title: string;
    testimonial_section_subtitle: string;
    pricing_section_title: string;
    pricing_section_subtitle: string;
    pricing_section_desc: string;
    growth_section_badge: string;
    growth_section_title: string;
    growth_section_desc: string;
    bottom_cta_badge: string;
    bottom_cta_title: string;
    bottom_cta_text: string;
    bottom_cta_primary_label: string;
    bottom_cta_primary_url: string;
    bottom_cta_secondary_label: string;
    bottom_cta_secondary_url: string;
    hero_service_1_title: string;
    hero_service_2_title: string;
    hero_service_3_title: string;
    hero_service_4_title: string;
    hero_trust_1: string;
    hero_trust_2: string;
    hero_trust_3: string;
    hero_trust_4: string;
    show_ticker: boolean;
    show_services: boolean;
    show_why: boolean;
    show_counters: boolean;
    show_portfolio: boolean;
    show_growth: boolean;
    show_process: boolean;
    show_testimonials: boolean;
    show_pricing: boolean;
  };
  tickerItems: { id: number; text: string }[];
  whyItems: { id: number; number: string; title: string; description: string }[];
  counters: { id: number; icon: string; value: number; suffix: string; label: string }[];
  growthStats: { id: number; icon: string; value: string; label: string }[];
  processSteps: { id: number; step_number: string; title: string; description: string }[];
  testimonials: {
    id: number;
    name: string;
    role: string;
    company: string;
    text: string;
    stars: number;
    is_video: boolean;
    video_url?: string;
    video_thumbnail?: string;
    avatar_text?: string;
  }[];
  roiConfig: {
    is_active: boolean;
    title: string;
    subtitle: string;
    disclaimer: string;
    web_seo_min: number;
    web_seo_max: number;
    content_min: number;
    content_max: number;
    ads_min: number;
    ads_max: number;
    sales_min: number;
    sales_max: number;
  };
  reelsConfig: {
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
  mapProjectsCount: number;
  mapProjects: {
    id: string;
    title: string;
    slug: string;
    lat: number;
    lng: number;
    category?: string;
  }[];
  beforeAfterProject: {
    title: string;
    slug: string;
    before_url: string;
    after_url: string;
  } | null;
  featuredProjects: Project[];
  services: Service[];
  pricingPlans: PricingPlan[];
}


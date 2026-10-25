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
  office_latitude: number;
  office_longitude: number;
  map_zoom: number;
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
  default_og_image?: string;
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
  industry: string;
  technologies: string[];
  description: string;
  detailed_description: string;
  challenge?: string;
  featured: boolean;
  project_date: string;
  website_url?: string;
  thumbnail_image: string;
  mockups?: ProjectMockups;
  kpis: ProjectKPI[];
  location_zone?: string;
  latitude?: number;
  longitude?: number;
}

export interface PricingPlan {
  id: number;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
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

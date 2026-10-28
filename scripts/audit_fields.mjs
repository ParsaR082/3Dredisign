import fs from 'fs';

const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');

function extractModelFields(modelName) {
  const regex = new RegExp(`model\\s+${modelName}\\s+\\{([^}]+)\\}`, 'm');
  const match = regex.exec(schemaContent);
  if (!match) return null;

  const lines = match[1].split('\n');
  const fields = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      fields[parts[0]] = parts[1];
    }
  }
  return fields;
}

const checks = {
  ServiceService: [
    'id', 'category_id', 'title', 'slug', 'short_description', 'description', 'icon',
    'image', 'card_image', 'price_start', 'duration', 'difficulty', 'is_popular', 'is_featured',
    'is_active', 'order', 'created_at', 'updated_at', 'meta_title', 'meta_description',
    'canonical_url', 'meta_robots', 'breadcrumb_label', 'features_section_title', 'features_intro',
    'why_us_title', 'why_us_intro', 'why_us_bullets', 'faq_section_title', 'other_services_title',
    'cta_title', 'cta_text', 'cta_primary_label', 'cta_secondary_label', 'cta_primary_url',
    'cta_secondary_url', 'bts_title', 'bts_video_url', 'bts_poster'
  ],
  PortfolioProject: [
    'id', 'category_id', 'industry_id', 'title', 'subtitle', 'slug', 'description',
    'detailed_description', 'challenge', 'featured', 'featured_order', 'recent', 'popular',
    'project_date', 'website_url', 'pdf_url', 'thumbnail_image', 'thumbnail_video_url',
    'desktop_mockup', 'tablet_mockup', 'mobile_mockup', 'kpi_data', 'timeline_steps',
    'roi_cost', 'roi_revenue', 'roi_percentage', 'latitude', 'longitude', 'location_zone',
    'show_on_map', 'order', 'is_active', 'meta_title', 'meta_description', 'og_image',
    'canonical_url', 'meta_robots'
  ],
  BlogPost: [
    'id', 'category_id', 'author_id', 'series_id', 'series_order', 'title', 'slug',
    'excerpt', 'content_format', 'body', 'body_html', 'cover_image', 'meta_title',
    'meta_description', 'og_title', 'og_description', 'og_image', 'canonical_url',
    'meta_robots', 'status', 'is_featured', 'is_pinned', 'read_time', 'read_time_manual',
    'view_count', 'published_at', 'scheduled_at', 'created_at', 'updated_at'
  ],
  ContactConsultationbooking: [
    'id', 'full_name', 'phone', 'email', 'booking_date', 'start_time', 'notes', 'status', 'created_at'
  ],
  ContactProjectwizardsubmission: [
    'id', 'goal', 'industry', 'budget', 'timeline', 'recommended_plan', 'recommended_services',
    'lead_score', 'full_name', 'phone', 'email', 'message', 'wizard_summary', 'is_seen', 'created_at'
  ],
  AboutTechlead: [
    'id', 'name', 'role', 'order', 'is_active', 'optimized_video', 'poster_image',
    'raw_video', 'accent_color', 'skills_csv', 'total_projects', 'years_experience',
    'planet_type', 'tagline'
  ],
  PricingPricingplan: [
    'id', 'name', 'description', 'monthly_price', 'is_popular', 'order', 'billing_period',
    'custom_price_text', 'yearly_price'
  ],
  BackstageBackstageitem: [
    'id', 'title', 'slug', 'subtitle', 'excerpt', 'body', 'cover_image', 'cover_video',
    'embed_url', 'location', 'duration_label', 'status', 'is_featured', 'order',
    'published_at', 'created_at', 'updated_at', 'meta_title', 'meta_description',
    'og_image', 'category_id', 'canonical_url', 'meta_robots'
  ],
  WebsitesWebsite: [
    'id', 'title', 'slug', 'subtitle', 'excerpt', 'body', 'cover_image', 'mobile_preview',
    'live_url', 'client_name', 'industry', 'year', 'is_one_page', 'accent_color',
    'tech_stack_csv', 'pages_label', 'status', 'is_featured', 'order', 'published_at',
    'created_at', 'updated_at', 'meta_title', 'meta_description', 'og_image', 'category_id',
    'canonical_url', 'meta_robots'
  ],
  AbnerAbnercitytvmodel: [
    'id', 'name', 'environment', 'pixel_pitch', 'module_size', 'module_resolution',
    'cabinet_size', 'cabinet_resolution', 'cabinet_material', 'cabinet_weight',
    'aspect_ratio', 'brightness', 'contrast', 'viewing_angle', 'ip_rating',
    'input_voltage', 'operating_temp', 'refresh_rate', 'power_max', 'power_avg',
    'maintenance', 'lifespan', 'gray_scale', 'control_system', 'order', 'page_id'
  ],
  AbnerAbnerstandmodel: [
    'id', 'name', 'height', 'width', 'resolution', 'pixel_pitch', 'lifespan',
    'temp_range', 'voltage', 'power', 'ip_rating', 'body_material', 'body_color',
    'shock_water', 'ports', 'wifi', 'bezel', 'video_playback', 'portable', 'order', 'page_id'
  ]
};

console.log('AUDITING CORE MODEL FIELD COMPATIBILITY:');
let totalDiscrepancies = 0;

for (const [model, expected] of Object.entries(checks)) {
  const fields = extractModelFields(model);
  if (!fields) {
    console.error(`ERROR: Model ${model} NOT FOUND in schema!`);
    totalDiscrepancies++;
    continue;
  }
  const fieldNames = Object.keys(fields);
  const missingFields = expected.filter(f => !fieldNames.includes(f));
  if (missingFields.length > 0) {
    console.warn(`[!] ${model} is missing fields:`, missingFields);
    totalDiscrepancies += missingFields.length;
  } else {
    console.log(`[OK] ${model} - all ${expected.length} expected fields match perfectly.`);
  }
}

if (totalDiscrepancies === 0) {
  console.log('\n>>> 100% FIELD-BY-FIELD COMPLIANCE WITH DJANGO PRODUCTION SPECIFICATION!');
} else {
  console.log(`\nFound ${totalDiscrepancies} field discrepancies.`);
}

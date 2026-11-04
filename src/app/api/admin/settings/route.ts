import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [settings, landing, contactPage] = await Promise.all([
      prisma.publicSitesettings.findFirst(),
      prisma.publicLandingpage.findFirst(),
      prisma.contactContactpagesettings.findFirst(),
    ]);

    return NextResponse.json({ success: true, settings, landing, contactPage });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'خطا در دریافت تنظیمات' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { settings, landing, contactPage } = body;

    let updatedSettings = null;
    let updatedLanding = null;
    let updatedContactPage = null;

    if (settings) {
      const existingSettings = await prisma.publicSitesettings.findFirst();
      if (existingSettings) {
        updatedSettings = await prisma.publicSitesettings.update({
          where: { id: existingSettings.id },
          data: {
            site_name: settings.site_name !== undefined ? settings.site_name : existingSettings.site_name,
            site_slogan: settings.site_slogan !== undefined ? settings.site_slogan : existingSettings.site_slogan,
            phone_display: settings.phone_display !== undefined ? settings.phone_display : existingSettings.phone_display,
            phone_e164: settings.phone_e164 !== undefined ? settings.phone_e164 : existingSettings.phone_e164,
            whatsapp_number: settings.whatsapp_number !== undefined ? settings.whatsapp_number : existingSettings.whatsapp_number,
            office_address: settings.office_address !== undefined ? settings.office_address : existingSettings.office_address,
            office_city: settings.office_city !== undefined ? settings.office_city : existingSettings.office_city,
            office_region: settings.office_region !== undefined ? settings.office_region : existingSettings.office_region,
            office_latitude: settings.office_latitude !== undefined ? Number(settings.office_latitude) : existingSettings.office_latitude,
            office_longitude: settings.office_longitude !== undefined ? Number(settings.office_longitude) : existingSettings.office_longitude,
            instagram_url: settings.instagram_url !== undefined ? settings.instagram_url : existingSettings.instagram_url,
            telegram_url: settings.telegram_url !== undefined ? settings.telegram_url : existingSettings.telegram_url,
            rubika_url: settings.rubika_url !== undefined ? settings.rubika_url : existingSettings.rubika_url,
            linkedin_url: settings.linkedin_url !== undefined ? settings.linkedin_url : existingSettings.linkedin_url,
            meta_title_default: settings.meta_title_default !== undefined ? settings.meta_title_default : existingSettings.meta_title_default,
            meta_description_default: settings.meta_description_default !== undefined ? settings.meta_description_default : existingSettings.meta_description_default,
            default_og_image: settings.default_og_image !== undefined ? settings.default_og_image : existingSettings.default_og_image,
            footer_about_text: settings.footer_about_text !== undefined ? settings.footer_about_text : existingSettings.footer_about_text,
            footer_working_hours: settings.footer_working_hours !== undefined ? settings.footer_working_hours : existingSettings.footer_working_hours,
            footer_copyright_text: settings.footer_copyright_text !== undefined ? settings.footer_copyright_text : existingSettings.footer_copyright_text,
          },
        });

        // Also sync local fallback JSON file to ensure complete data parity
        try {
          const filePath = path.join(process.cwd(), 'src/content/site-settings.json');
          const fileData = await fs.readFile(filePath, 'utf-8').then(JSON.parse).catch(() => ({}));
          const merged = { ...fileData, ...updatedSettings };
          delete merged.id;
          await fs.writeFile(filePath, JSON.stringify(merged, null, 2), 'utf-8');
        } catch (e) {
          console.error('Failed to update local site-settings.json fallback:', e);
        }
      }
    }

    if (landing) {
      const existingLanding = await prisma.publicLandingpage.findFirst();
      if (existingLanding) {
        updatedLanding = await prisma.publicLandingpage.update({
          where: { id: existingLanding.id },
          data: {
            site_title: landing.site_title !== undefined ? landing.site_title : existingLanding.site_title,
            hero_title: landing.hero_title !== undefined ? landing.hero_title : existingLanding.hero_title,
            hero_highlight: landing.hero_highlight !== undefined ? landing.hero_highlight : existingLanding.hero_highlight,
            hero_description: landing.hero_description !== undefined ? landing.hero_description : existingLanding.hero_description,
            hero_badge: landing.hero_badge !== undefined ? landing.hero_badge : existingLanding.hero_badge,
            hero_image: landing.hero_image !== undefined ? landing.hero_image : existingLanding.hero_image,
            primary_cta_text: landing.primary_cta_text !== undefined ? landing.primary_cta_text : existingLanding.primary_cta_text,
            primary_cta_url: landing.primary_cta_url !== undefined ? landing.primary_cta_url : existingLanding.primary_cta_url,
            secondary_cta_text: landing.secondary_cta_text !== undefined ? landing.secondary_cta_text : existingLanding.secondary_cta_text,
            secondary_cta_url: landing.secondary_cta_url !== undefined ? landing.secondary_cta_url : existingLanding.secondary_cta_url,
            hero_service_1_title: landing.hero_service_1_title !== undefined ? landing.hero_service_1_title : existingLanding.hero_service_1_title,
            hero_service_2_title: landing.hero_service_2_title !== undefined ? landing.hero_service_2_title : existingLanding.hero_service_2_title,
            hero_service_3_title: landing.hero_service_3_title !== undefined ? landing.hero_service_3_title : existingLanding.hero_service_3_title,
            hero_service_4_title: landing.hero_service_4_title !== undefined ? landing.hero_service_4_title : existingLanding.hero_service_4_title,
            hero_trust_1: landing.hero_trust_1 !== undefined ? landing.hero_trust_1 : existingLanding.hero_trust_1,
            hero_trust_2: landing.hero_trust_2 !== undefined ? landing.hero_trust_2 : existingLanding.hero_trust_2,
            hero_trust_3: landing.hero_trust_3 !== undefined ? landing.hero_trust_3 : existingLanding.hero_trust_3,
            hero_trust_4: landing.hero_trust_4 !== undefined ? landing.hero_trust_4 : existingLanding.hero_trust_4,
            services_section_title: landing.services_section_title !== undefined ? landing.services_section_title : existingLanding.services_section_title,
            services_section_subtitle: landing.services_section_subtitle !== undefined ? landing.services_section_subtitle : existingLanding.services_section_subtitle,
            services_section_desc: landing.services_section_desc !== undefined ? landing.services_section_desc : existingLanding.services_section_desc,
            why_section_title: landing.why_section_title !== undefined ? landing.why_section_title : existingLanding.why_section_title,
            why_section_subtitle: landing.why_section_subtitle !== undefined ? landing.why_section_subtitle : existingLanding.why_section_subtitle,
            why_side_image: landing.why_side_image !== undefined ? landing.why_side_image : existingLanding.why_side_image,
            portfolio_section_title: landing.portfolio_section_title !== undefined ? landing.portfolio_section_title : existingLanding.portfolio_section_title,
            portfolio_section_subtitle: landing.portfolio_section_subtitle !== undefined ? landing.portfolio_section_subtitle : existingLanding.portfolio_section_subtitle,
            portfolio_section_desc: landing.portfolio_section_desc !== undefined ? landing.portfolio_section_desc : existingLanding.portfolio_section_desc,
            process_section_title: landing.process_section_title !== undefined ? landing.process_section_title : existingLanding.process_section_title,
            process_section_subtitle: landing.process_section_subtitle !== undefined ? landing.process_section_subtitle : existingLanding.process_section_subtitle,
            process_section_desc: landing.process_section_desc !== undefined ? landing.process_section_desc : existingLanding.process_section_desc,
            growth_section_badge: landing.growth_section_badge !== undefined ? landing.growth_section_badge : existingLanding.growth_section_badge,
            growth_section_title: landing.growth_section_title !== undefined ? landing.growth_section_title : existingLanding.growth_section_title,
            growth_section_desc: landing.growth_section_desc !== undefined ? landing.growth_section_desc : existingLanding.growth_section_desc,
            testimonial_section_title: landing.testimonial_section_title !== undefined ? landing.testimonial_section_title : existingLanding.testimonial_section_title,
            testimonial_section_subtitle: landing.testimonial_section_subtitle !== undefined ? landing.testimonial_section_subtitle : existingLanding.testimonial_section_subtitle,
            pricing_section_title: landing.pricing_section_title !== undefined ? landing.pricing_section_title : existingLanding.pricing_section_title,
            pricing_section_subtitle: landing.pricing_section_subtitle !== undefined ? landing.pricing_section_subtitle : existingLanding.pricing_section_subtitle,
            pricing_section_desc: landing.pricing_section_desc !== undefined ? landing.pricing_section_desc : existingLanding.pricing_section_desc,
            bottom_cta_badge: landing.bottom_cta_badge !== undefined ? landing.bottom_cta_badge : existingLanding.bottom_cta_badge,
            bottom_cta_title: landing.bottom_cta_title !== undefined ? landing.bottom_cta_title : existingLanding.bottom_cta_title,
            bottom_cta_text: landing.bottom_cta_text !== undefined ? landing.bottom_cta_text : existingLanding.bottom_cta_text,
            bottom_cta_primary_label: landing.bottom_cta_primary_label !== undefined ? landing.bottom_cta_primary_label : existingLanding.bottom_cta_primary_label,
            bottom_cta_primary_url: landing.bottom_cta_primary_url !== undefined ? landing.bottom_cta_primary_url : existingLanding.bottom_cta_primary_url,
            bottom_cta_secondary_label: landing.bottom_cta_secondary_label !== undefined ? landing.bottom_cta_secondary_label : existingLanding.bottom_cta_secondary_label,
            bottom_cta_secondary_url: landing.bottom_cta_secondary_url !== undefined ? landing.bottom_cta_secondary_url : existingLanding.bottom_cta_secondary_url,
            show_ticker: landing.show_ticker !== undefined ? Boolean(landing.show_ticker) : existingLanding.show_ticker,
            show_services: landing.show_services !== undefined ? Boolean(landing.show_services) : existingLanding.show_services,
            show_why: landing.show_why !== undefined ? Boolean(landing.show_why) : existingLanding.show_why,
            show_counters: landing.show_counters !== undefined ? Boolean(landing.show_counters) : existingLanding.show_counters,
            show_portfolio: landing.show_portfolio !== undefined ? Boolean(landing.show_portfolio) : existingLanding.show_portfolio,
            show_growth: landing.show_growth !== undefined ? Boolean(landing.show_growth) : existingLanding.show_growth,
            show_process: landing.show_process !== undefined ? Boolean(landing.show_process) : existingLanding.show_process,
            show_testimonials: landing.show_testimonials !== undefined ? Boolean(landing.show_testimonials) : existingLanding.show_testimonials,
            show_pricing: landing.show_pricing !== undefined ? Boolean(landing.show_pricing) : existingLanding.show_pricing,
          },
        });
      }
    }

    if (contactPage) {
      const existingContactPage = await prisma.contactContactpagesettings.findFirst();
      if (existingContactPage) {
        updatedContactPage = await prisma.contactContactpagesettings.update({
          where: { id: existingContactPage.id },
          data: {
            hero_badge: contactPage.hero_badge !== undefined ? contactPage.hero_badge : existingContactPage.hero_badge,
            hero_title: contactPage.hero_title !== undefined ? contactPage.hero_title : existingContactPage.hero_title,
            hero_description: contactPage.hero_description !== undefined ? contactPage.hero_description : existingContactPage.hero_description,
            info_section_badge: contactPage.info_section_badge !== undefined ? contactPage.info_section_badge : existingContactPage.info_section_badge,
            info_section_title: contactPage.info_section_title !== undefined ? contactPage.info_section_title : existingContactPage.info_section_title,
            meta_title: contactPage.meta_title !== undefined ? contactPage.meta_title : existingContactPage.meta_title,
            meta_description: contactPage.meta_description !== undefined ? contactPage.meta_description : existingContactPage.meta_description,
          },
        });
      }
    }

    // Force Next.js to revalidate layout & pages immediately so navbar & footer update live
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/contact-us', 'page');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      landing: updatedLanding,
      contactPage: updatedContactPage,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'خطا در ذخیره تنظیمات' }, { status: 500 });
  }
}

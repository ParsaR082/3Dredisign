import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [settings, landing] = await Promise.all([
      prisma.publicSitesettings.findFirst(),
      prisma.publicLandingpage.findFirst(),
    ]);

    return NextResponse.json({ success: true, settings, landing });
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
    const { settings, landing } = body;

    let updatedSettings = null;
    let updatedLanding = null;

    if (settings) {
      const existingSettings = await prisma.publicSitesettings.findFirst();
      if (existingSettings) {
        updatedSettings = await prisma.publicSitesettings.update({
          where: { id: existingSettings.id },
          data: {
            site_name: settings.site_name,
            site_slogan: settings.site_slogan,
            phone_display: settings.phone_display,
            phone_e164: settings.phone_e164,
            whatsapp_number: settings.whatsapp_number,
            office_address: settings.office_address,
            office_city: settings.office_city,
            office_region: settings.office_region || 'آذربایجان غربی',
            office_latitude: settings.office_latitude !== undefined ? Number(settings.office_latitude) : existingSettings.office_latitude,
            office_longitude: settings.office_longitude !== undefined ? Number(settings.office_longitude) : existingSettings.office_longitude,
            instagram_url: settings.instagram_url,
            telegram_url: settings.telegram_url,
            rubika_url: settings.rubika_url,
            linkedin_url: settings.linkedin_url || '',
            meta_title_default: settings.meta_title_default,
            meta_description_default: settings.meta_description_default,
            footer_about_text: settings.footer_about_text,
            footer_working_hours: settings.footer_working_hours,
            footer_copyright_text: settings.footer_copyright_text,
          },
        });
      }
    }

    if (landing) {
      const existingLanding = await prisma.publicLandingpage.findFirst();
      if (existingLanding) {
        updatedLanding = await prisma.publicLandingpage.update({
          where: { id: existingLanding.id },
          data: {
            site_title: landing.site_title || existingLanding.site_title,
            hero_title: landing.hero_title || existingLanding.hero_title,
            hero_highlight: landing.hero_highlight || existingLanding.hero_highlight,
            hero_description: landing.hero_description || existingLanding.hero_description,
            hero_badge: landing.hero_badge || existingLanding.hero_badge,
            primary_cta_text: landing.primary_cta_text || existingLanding.primary_cta_text,
            primary_cta_url: landing.primary_cta_url || existingLanding.primary_cta_url,
            secondary_cta_text: landing.secondary_cta_text || existingLanding.secondary_cta_text,
            secondary_cta_url: landing.secondary_cta_url || existingLanding.secondary_cta_url,
          },
        });
      }
    }

    return NextResponse.json({ success: true, settings: updatedSettings, landing: updatedLanding });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'خطا در ذخیره تنظیمات' }, { status: 500 });
  }
}

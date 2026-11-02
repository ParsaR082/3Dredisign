import React from 'react';
import ClassicLandingView from '@/components/landing/ClassicLandingView';
import { getLiveLandingFull, getLiveSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const landing = await getLiveLandingFull();
  const settings = await getLiveSiteSettings();

  const title =
    landing.landingPage.meta_title ||
    landing.landingPage.og_title ||
    'آژانس دیجیتال مارکتینگ اروم سیما | طراحی سایت، سئو و تولید محتوا در ارومیه';

  const description =
    landing.landingPage.meta_description ||
    landing.landingPage.og_description ||
    settings.meta_description_default ||
    'اروم سیما؛ آژانس جامع دیجیتال مارکتینگ در ارومیه. ارائه خدمات طراحی سایت اختصاصی، سئو تکنیکال رتبه یک، تولید محتوای ویدیویی صنعتی و تبلیغات هدفمند.';

  return generatePageMetadata({
    title,
    description,
    path: '/',
    ogImage: landing.landingPage.og_image || settings.default_og_image,
  });
}

export default async function HomePage() {
  const [landing, settings] = await Promise.all([
    getLiveLandingFull(),
    getLiveSiteSettings(),
  ]);

  return <ClassicLandingView data={landing} settings={settings} />;
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { getLiveSiteSettings, getLiveServices } from '@/lib/db';
import { generatePageMetadata, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo';

export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: '#0B0F17',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://urumsima.ir'),
  ...generatePageMetadata({}),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  verification: {
    google: 'googlef9b51c033c088346',
  },
  alternates: {
    canonical: 'https://urumsima.ir/',
  },
};

import { SmoothScroll } from '@/components/ui/SmoothScroll';
import MainContentWrapper from '@/components/layout/MainContentWrapper';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, services] = await Promise.all([
    getLiveSiteSettings(),
    getLiveServices(),
  ]);
  const orgJsonLd = generateOrganizationJsonLd();
  const webSiteJsonLd = generateWebSiteJsonLd();

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="preload"
          href="/fonts/DigiRastinPlusLine-fa.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="image"
          href="/images/team-hero.webp"
          type="image/webp"
          // @ts-ignore
          fetchPriority="high"
          media="(min-width: 901px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/team-hero-tablet.webp"
          type="image/webp"
          // @ts-ignore
          fetchPriority="high"
          media="(min-width: 481px) and (max-width: 900px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/team-hero-mobile.webp"
          type="image/webp"
          // @ts-ignore
          fetchPriority="high"
          media="(max-width: 480px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-dark-base text-gray-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white antialiased">
        <Navbar settings={settings} services={services} />
        <SmoothScroll>
          <MainContentWrapper>{children}</MainContentWrapper>
          <Footer settings={settings} services={services} />
        </SmoothScroll>
        <WhatsAppButton number={settings.whatsapp_number} />
      </body>
    </html>
  );
}


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
import { CustomCursor } from '@/components/ui/CustomCursor';
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
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/DigiRastinPlusLine-fa.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
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
        <SmoothScroll>
          <CustomCursor />
          <Navbar settings={settings} services={services} />
          <MainContentWrapper>{children}</MainContentWrapper>
          <Footer settings={settings} services={services} />
          <WhatsAppButton number={settings.whatsapp_number} />
        </SmoothScroll>
      </body>
    </html>
  );
}


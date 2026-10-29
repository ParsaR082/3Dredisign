import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { getLiveSiteSettings, getLiveServices } from '@/lib/db';
import { generatePageMetadata, generateOrganizationJsonLd } from '@/lib/seo';

export const viewport: Viewport = {
  themeColor: '#0B0F17',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  ...generatePageMetadata({}),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
};

import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { PageTransition } from '@/components/ui/PageTransition';

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
      </head>
      <body className="min-h-screen bg-dark-base text-gray-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white antialiased">
        <SmoothScroll>
          <CustomCursor />
          <Navbar settings={settings} services={services} />
          <main className="flex-grow pt-20">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer settings={settings} services={services} />
          <WhatsAppButton number={settings.whatsapp_number} />
        </SmoothScroll>
      </body>
    </html>
  );
}


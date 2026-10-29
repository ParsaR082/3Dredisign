import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Invalid URL protocol' }, { status: 400 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fa,en-US;q=0.9,en;q=0.8',
      },
      next: { revalidate: 300 }, // Cache 5 min
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch preview: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type') || 'text/html';
    let html = await response.text();

    const baseUrl = `${parsed.protocol}//${parsed.host}`;
    const baseTag = `<base href="${baseUrl}/" target="_blank">`;

    // Inject base tag right after <head> or at start
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/(<head[^>]*>)/i, `$1\n${baseTag}\n`);
    } else {
      html = `${baseTag}\n${html}`;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Explicitly omit X-Frame-Options and permit iframe embedding on any origin
        'Content-Security-Policy': "frame-ancestors * 'self'",
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Preview proxy error:', error);
    return new NextResponse(`Error loading preview: ${error?.message || 'Unknown error'}`, {
      status: 500,
    });
  }
}

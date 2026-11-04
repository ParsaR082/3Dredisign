import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Production Canonical Domain & Security Middleware
 *
 * Enforces:
 * 1. Canonical domain: redirect www.urumsima.ir -> https://urumsima.ir (301 Permanent)
 * 2. Protocol canonicalization: redirect http -> https in production environments
 * 3. Security headers (HSTS, X-Content-Type-Options, Referrer-Policy, etc.)
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  const isWww = host.startsWith('www.urumsima.ir');
  const isHttp = proto === 'http' && !host.includes('localhost') && !host.includes('127.0.0.1');

  // If accessed via www or insecure http on the live domain, 301 Permanent Redirect to canonical https://urumsima.ir
  if (isWww || (isHttp && host.includes('urumsima.ir'))) {
    const canonicalUrl = new URL(`https://urumsima.ir${pathname}${search}`);
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // Common legacy Django path redirects (301 Permanent)
  if (pathname === '/about') {
    return NextResponse.redirect(new URL('/about-us/', request.url), 301);
  }
  if (pathname === '/contact') {
    return NextResponse.redirect(new URL('/contact-us/', request.url), 301);
  }

  const response = NextResponse.next();

  // Production SEO and Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (HTTP Strict Transport Security) - enforce HTTPS for 1 year
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.png, favicon.svg
     * - public assets (/images/, /media/, /fonts/, /3Dmodels/, /draco/)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|favicon\\.svg|manifest\\.json|google[a-zA-Z0-9]+\\.html|images/|media/|fonts/|3Dmodels/|draco/).*)',
  ],
};


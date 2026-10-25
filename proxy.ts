import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // This wizard is session-only and does not hydrate from query parameters.
  // Consolidating legacy parameter URLs prevents duplicate crawl entries.
  if (request.nextUrl.pathname === '/mere-liye' && request.nextUrl.search) {
    return NextResponse.redirect(new URL('/mere-liye', request.url), 308);
  }

  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/admin/:path*', '/admin-login', '/api/admin/:path*', '/mere-liye'] };

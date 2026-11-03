import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // This wizard is session-only and does not hydrate from query parameters.
  // Consolidating legacy parameter URLs prevents duplicate crawl entries.
  if (request.nextUrl.pathname === '/mere-liye' && request.nextUrl.search) {
    return NextResponse.redirect(new URL('/mere-liye', request.url), 308);
  }

  // Robots policy belongs to route metadata and static headers, not this
  // request proxy. Some edge adapters invoke this proxy outside its matcher;
  // setting X-Robots-Tag here would then make otherwise public pages noindex.
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*', '/admin-login', '/api/admin/:path*', '/mere-liye'] };

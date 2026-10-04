import { NextResponse, type NextRequest } from 'next/server';

/**
 * Keep private administration responses out of search indexes even when a
 * server-component redirect happens before page metadata is rendered.
 */
export function proxy(_request: NextRequest) {
  if (/^\/admin(?:\/|$)/.test(_request.nextUrl.pathname)) {
    const userId = _request.headers.get('oai-authenticated-user-id');
    const allowedIds = new Set(
      (process.env.ADMIN_USER_IDS ?? '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean),
    );

    if (!userId || !allowedIds.has(userId)) {
      const redirect = NextResponse.redirect(new URL('/admin-login', _request.url), 307);
      redirect.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return redirect;
    }
  }

  const response = NextResponse.next();
  // No X-Robots-Tag header for public routes; admin routes handled above.
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
};

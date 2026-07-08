import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const hasAccess = !!req.cookies.get('accessToken');
    const hasSession = !!req.cookies.get('session');
    if (!hasAccess || !hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

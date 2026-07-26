// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession, getAccessToken, getPermissions } from '@/lib/cookies';
import { getFirstAvailableRoute, isRouteAccessible } from '@/lib/navigation';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for static files, API routes, and public assets
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/assets') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get session and permissions
  const session = await getSession();
  const accessToken = await getAccessToken();
  const permissions = await getPermissions();
  
  const isAuthenticated = !!session?.id && !!accessToken;
  
  // Public routes
  const publicRoutes = ['/', '/forgot-password', '/verify-otp', '/reset-password', '/register'];
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(route + '/')
  );
  
  // Protected routes
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/settings');
  
  // CASE 1: Not authenticated on protected route → redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // CASE 2: Authenticated on public route → redirect to first available dashboard route
  if (isPublicRoute && isAuthenticated && path !== '/register') {
    const redirectTo = getFirstAvailableRoute(permissions);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
  
  // CASE 3: Authenticated on protected route → check permissions
  if (isProtectedRoute && isAuthenticated) {
    // Settings is always accessible
    if (path.startsWith('/dashboard/settings')) {
      return NextResponse.next();
    }
    
    // Check if the route is accessible based on permissions
    const hasAccess = isRouteAccessible(path, permissions);
    
    if (!hasAccess) {
      console.log(`🚫 User doesn't have permission for ${path}, redirecting to first available route`);
      const redirectTo = getFirstAvailableRoute(permissions);
      
      // If no permissions at all, redirect to login
      if (redirectTo === '/') {
        const { clearAuthCookies } = await import('@/lib/cookies');
        await clearAuthCookies();
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }
  
  // CASE 4: No permissions but authenticated → clear session and redirect to login
  if (isAuthenticated && !permissions && isProtectedRoute) {
    console.log('⚠️ No permissions found, clearing session');
    const { clearAuthCookies } = await import('@/lib/cookies');
    await clearAuthCookies();
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|api/proxy|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
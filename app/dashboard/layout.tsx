import React from 'react';
import { redirect } from 'next/navigation';
import { LayoutShell } from './LayoutShell';
import { getPermissions, getSession } from '@/lib/cookies';
import { ALL_NAV_ITEMS, filterNavItemsByPermissions, getFirstAvailableRoute, isRouteAccessible } from '@/lib/navigation';

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Get permissions from cookies (server-side)
  const permissions = await getPermissions();
  const session = await getSession();
  
  // If no permissions, redirect to login
  if (!permissions) {
    console.log('No permissions, redirecting to login');
    redirect('/');
  }
  
  // Filter navigation items based on permissions
  const filteredNavItems = filterNavItemsByPermissions(ALL_NAV_ITEMS, permissions);
  
  // If no nav items (no permissions at all), redirect to login
  if (filteredNavItems.length === 0) {
    console.log('No accessible routes, redirecting to login');
    redirect('/');
  }
  
  // Get the first available route for default redirect
  const firstAvailableRoute = getFirstAvailableRoute(permissions);
  
  // Serialize the data for client components
  const serializedNavItems = filteredNavItems.map(item => ({
    iconName: item.iconName,
    label: item.label,
    href: item.href,
    permission: item.permission,
  }));

  return (
    <LayoutShell 
      navItems={serializedNavItems}
      user={session}
      permissions={permissions}
      firstAvailableRoute={firstAvailableRoute}
    >
      {children}
    </LayoutShell>
  );
}
// lib/navigation.ts

import { 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Trophy, 
  Headphones 
} from 'lucide-react';

export type IconName = 'Calendar' | 'FileText' | 'LayoutDashboard' | 'Users' | 'Briefcase' | 'Trophy' | 'Headphones';

export interface NavItem {
  iconName: IconName;
  label: string;
  href: string;
  permission: string;
}

export const ALL_NAV_ITEMS: NavItem[] = [
  { iconName: 'Calendar', label: "Schedule", href: "/dashboard", permission: "schedule" },
  { iconName: 'FileText', label: "Bookings", href: "/dashboard/bookings", permission: "bookings" },
  { iconName: 'LayoutDashboard', label: "Court Management", href: "/dashboard/courts", permission: "courts" },
  { iconName: 'Users', label: "Customers", href: "/dashboard/customers", permission: "customers" },
  { iconName: 'Briefcase', label: "Manager Staff", href: "/dashboard/staff", permission: "courts" },
  { iconName: 'Trophy', label: "Tournaments", href: "/dashboard/tournaments", permission: "tournaments" },
  { iconName: 'Trophy', label: "Revenue", href: "/dashboard/revenue", permission: "revenue" },
  { iconName: 'Headphones', label: "Support", href: "/dashboard/support", permission: "support" },
];

export const ICON_MAP: Record<IconName, any> = {
  'Calendar': Calendar,
  'FileText': FileText,
  'LayoutDashboard': LayoutDashboard,
  'Users': Users,
  'Briefcase': Briefcase,
  'Trophy': Trophy,
  'Headphones': Headphones,
};

// Ordered by priority - highest priority first
const ROUTE_PRIORITY = [
  { route: '/dashboard', permission: 'schedule' },
  { route: '/dashboard/bookings', permission: 'bookings' },
  { route: '/dashboard/courts', permission: 'courts' },
  { route: '/dashboard/customers', permission: 'customers' },
  { route: '/dashboard/tournaments', permission: 'tournaments' },
  { route: '/dashboard/revenue', permission: 'revenue' },
  { route: '/dashboard/support', permission: 'support' },
];

export function filterNavItemsByPermissions(
  navItems: NavItem[],
  permissions: Record<string, boolean> | null
): NavItem[] {
  if (!permissions) {
    console.log('No permissions found, returning empty array');
    return [];
  }
  
  const filtered = navItems.filter(item => {
    const hasPermission = permissions[item.permission] === true;
    return hasPermission;
  });
  
  return filtered;
}

export function getFirstAvailableRoute(
  permissions: Record<string, boolean> | null
): string {
  if (!permissions) {
    console.log('No permissions, redirecting to login');
    return '/';
  }
  
  // Check permissions in priority order
  for (const item of ROUTE_PRIORITY) {
    if (permissions[item.permission] === true) {
      console.log(`First available route: ${item.route} (permission: ${item.permission})`);
      return item.route;
    }
  }
  
  // No permissions found - redirect to login
  console.log('No permissions found, redirecting to login');
  return '/';
}

export function getAccessibleRoutes(
  permissions: Record<string, boolean> | null
): string[] {
  if (!permissions) return [];
  
  const routes: string[] = [];
  for (const item of ROUTE_PRIORITY) {
    if (permissions[item.permission] === true) {
      routes.push(item.route);
    }
  }
  return routes;
}

export function isRouteAccessible(
  pathname: string,
  permissions: Record<string, boolean> | null
): boolean {
  // Settings is always accessible
  if (pathname.startsWith('/dashboard/settings')) {
    return true;
  }
  
  if (!permissions) return false;
  
  // Check if the route matches any accessible route
  for (const item of ROUTE_PRIORITY) {
    if (permissions[item.permission] === true) {
      const route = item.route;
      if (route === '/dashboard' && pathname === '/dashboard') {
        return true;
      }
      if (route !== '/dashboard' && pathname.startsWith(route)) {
        return true;
      }
    }
  }
  
  return false;
}
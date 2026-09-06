// app/dashboard/LayoutShell.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import type { NavItem, IconName } from '@/lib/navigation';

interface LayoutShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user?: any;
  permissions?: any;
  firstAvailableRoute?: string;
}

export function LayoutShell({ 
  children, 
  navItems, 
  user, 
  permissions,
  firstAvailableRoute = '/dashboard'
}: LayoutShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check if current route is accessible
  useEffect(() => {
    // If user doesn't have schedule permission and is on dashboard root, redirect
    if (pathname === '/dashboard' && permissions?.schedule !== true) {
      router.replace(firstAvailableRoute);
      return;
    }

    // Check if the current route is in the allowed nav items
    const isRouteAllowed = navItems.some(item => {
      if (item.href === '/dashboard') {
        return pathname === '/dashboard';
      }
      return pathname.startsWith(item.href);
    });

    // If current route is not in the allowed list and not settings (always allowed)
    if (!isRouteAllowed && !pathname.startsWith('/dashboard/settings')) {
      router.replace(firstAvailableRoute);
    }
  }, [pathname, navItems, permissions, firstAvailableRoute, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
  <div className="flex h-screen overflow-hidden bg-white">
    {/* Overlay for mobile */}
    {isMobile && isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    <div
      className={`
        fixed lg:relative z-50 h-screen transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isSidebarOpen && 'lg:w-[80px]'}
      `}
    >
      <Sidebar
        isCollapsed={!isSidebarOpen}
        navItems={navItems}
        user={user}
      />
    </div>

    <div className="flex flex-col flex-1 min-w-0">
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        user={user}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);
}
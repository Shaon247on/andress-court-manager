// components/dashboard/SidebarClient.tsx

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { logoutAction } from "@/actions/court-manager-auth.action";
import type { NavItem } from "@/lib/navigation";

interface SidebarClientProps {
  navItems: NavItem[];
  isCollapsed?: boolean;
  user?: any;
  permissions?: any;
}

export function SidebarClient({ 
  navItems, 
  isCollapsed = false,
  user,
  permissions
}: SidebarClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
  };

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('SidebarClient - Nav Items:', navItems.map(i => i.label));
    console.log('SidebarClient - Permissions:', permissions);
    console.log('SidebarClient - User:', user);
  }

  return (
    <aside
      className={cn(
        "h-screen bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[260px]",
      )}
    >
      {/* Logo Section */}
      <div className={cn("p-4", isCollapsed && "px-2")}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src="/assets/athlon_avatar.png"
              alt="AthlonGo Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-lg leading-tight text-slate-800 truncate">
                AthlonGo
              </h2>
              <p className="text-xs text-slate-500 truncate">Manager Dashboard</p>
              {user && (
                <p className="text-xs text-slate-400 truncate max-w-[140px]">
                  {user.full_name || user.email}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-2 space-y-1 overflow-y-auto",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {navItems.length > 0 ? (
          navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (pathname?.startsWith(item.href) &&
                item.href !== "/dashboard" &&
                item.href !== "#");
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-2" : "",
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-slate-600 hover:bg-slate-200",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive ? "text-white" : "text-slate-400",
                  )}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })
        ) : (
          <div className={cn(
            "text-sm text-slate-400 px-4 py-2",
            isCollapsed && "text-center px-2"
          )}>
            {isCollapsed ? "..." : "No items available"}
          </div>
        )}
      </nav>

      {/* Bottom Section - Settings & Logout (Always shown) */}
      <div
        className={cn(
          "p-4 border-t border-slate-200 space-y-1",
          isCollapsed && "px-2",
        )}
      >
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors",
            isCollapsed ? "justify-center px-2" : "",
          )}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="w-5 h-5 text-slate-400 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center space-x-3 px-4 py-2.5 rounded-md w-full text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors",
            isCollapsed ? "justify-center px-2" : "",
          )}
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-red-600" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
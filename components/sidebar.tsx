'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, LayoutDashboard, Settings, LogOut, Headphones, Trophy, Briefcase, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { icon: Calendar, label: 'Schedule', href: '/dashboard' },
  { icon: FileText, label: 'Bookings', href: '/dashboard/bookings' },
  { icon: LayoutDashboard, label: 'Court Management', href: '/dashboard/courts' },
  { icon: Users, label: 'Customers', href: '/dashboard/customers' },
  { icon: Briefcase, label: 'Manager Team', href: '/dashboard/team' },
  { icon: Trophy, label: 'Tournaments', href: '/dashboard/tournaments' },
  { icon: FileText, label: 'Posts', href: '/dashboard/posts' },
  { icon: Trophy, label: 'Revenue', href: '/dashboard/revenue' },
  { icon: Headphones, label: 'Support', href: '/dashboard/support' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-screen bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
            <Image
              src="/assets/athlon_avatar.png"
              alt="AthlonGo Logo"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight text-slate-800">AthlonGo</h2>
            <p className="text-xs text-slate-500">Manager Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '#');
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-slate-600 hover:bg-slate-200"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-1">
        <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-200">
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Settings</span>
        </Link>
        <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-200">
          <LogOut className="w-5 h-5 text-slate-400" />
          <span>Log Out</span>
        </Link>
      </div>
    </aside>
  );
}

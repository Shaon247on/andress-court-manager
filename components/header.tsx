'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Settings, LogOut } from 'lucide-react';
import { Input } from './ui/input';

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      <div className="w-full max-w-lg">
        <Input 
          icon={<Search className="w-4 h-4" />} 
          placeholder="Search users, courts, bookings, matches..." 
          className="bg-slate-50 border-slate-200"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-full cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-slate-800 leading-tight">Admin User</p>
              <p className="text-xs text-slate-500">Athens, Greece</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
              <div className="px-4 py-4 border-b border-slate-100 bg-white">
                <p className="text-base font-semibold text-slate-900">Admin User</p>
                <p className="text-sm text-slate-500 truncate mt-0.5">admin@athlongo.com</p>
              </div>
              <div className="py-2 bg-white">
                <Link href="/dashboard/settings" onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors">
                  <Settings className="w-5 h-5 mr-3" strokeWidth={2} />
                  Settings
                </Link>
                <Link href="/" onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-5 h-5 mr-3" strokeWidth={2} />
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

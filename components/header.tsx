"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Settings, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/actions/court-manager-auth.action";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  user?: any;
}

export function Header({ onToggleSidebar, isSidebarOpen, user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    setIsDropdownOpen(false);
    router.push("/");
  };

  const userName = user?.full_name || "Admin User";
  const userEmail = user?.email || "admin@athlongo.com";
  const userInitial = userName.charAt(0).toUpperCase();
  const userPhoto = user?.photo_url || null;

  // Get role label with fallback
  const roleLabel = user?.role_label || user?.role_name || user?.role || "User";

  console.log("the user:",user)

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 flex-1">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-slate-600" />
          ) : (
            <Menu className="w-5 h-5 text-slate-600" />
          )}
        </button>

        <div>
          <h3 className="text-2xl font-semibold text-emerald-500">
            {roleLabel}&apos;s Dashboard
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-full cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100"
          >
            {/* Avatar with user photo */}
            <Avatar className="w-8 h-8 border-2 border-emerald-500/20">
              {userPhoto ? (
                <AvatarImage src={userPhoto} alt={userName} />
              ) : (
                <AvatarFallback className="bg-emerald-500 text-white text-sm font-medium">
                  {userInitial}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="hidden md:block text-sm">
              <p className="font-medium text-slate-800 leading-tight">
                {userName}
              </p>
              <p className="text-xs text-slate-500 capitalize">{roleLabel}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
              <div className="px-4 py-4 border-b border-slate-100 bg-white flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-emerald-500/20">
                  {userPhoto ? (
                    <AvatarImage src={userPhoto} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-emerald-500 text-white text-lg font-medium">
                      {userInitial}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900 truncate">
                    {userName}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {userEmail}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium capitalize">
                    {roleLabel}
                  </p>
                </div>
              </div>
              <div className="py-2 bg-white">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-5 h-5 mr-3" strokeWidth={2} />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" strokeWidth={2} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
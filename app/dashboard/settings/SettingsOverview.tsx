"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Shield,
  Mail,
  Phone,
  Camera,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/actions/settings.action";
import { ClubInfo } from "./ClubInfo";
import type { Profile, Schedule, VenueImage } from "@/types/Settings.type";
import { toast } from "sonner";
import Image from "next/image";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  role_label: string;
  role_name: string;
  status: "active" | "inactive" | "pending" | "suspended";
  is_staff_member: boolean;
}
interface SettingsOverviewProps {
  profile: Profile | null;
  schedule: Schedule | null;
  errorMessage?: string;
  scheduleError?: string;
  user?: User;
  // ── Venue settings props ──
  venueClubName?: string;
  venueStreetAddress?: string;
  venueCity?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  venueImages?: VenueImage[];
}

export default function SettingsOverview({
  profile,
  schedule,
  errorMessage,
  scheduleError,
  user,
  venueClubName = "",
  venueStreetAddress = "",
  venueCity = "",
  venueLatitude = 40.7128,
  venueLongitude = -74.006,
  venueImages = [],
}: SettingsOverviewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Initialize state with profile data directly
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.photo_url || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Check if user is an Owner - from session user data
  const isOwner = user?.role_label === "Owner";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Image must be JPG, PNG, or GIF format");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);

    const formData = new FormData();
    if (fullName) formData.append("full_name", fullName);
    if (phoneNumber) formData.append("phone_number", phoneNumber);
    if (selectedFile) formData.append("photo", selectedFile);

    const res = await updateProfileAction(formData);

    if (res.success) {
      toast.success(res.data.message);
      // Update local state with the new data
      if (res.data.profile) {
        setAvatarPreview(res.data.profile.photo_url || null);
      }
      // Refresh the page to update all data
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  // ── Handle venue update success ──
  const handleVenueUpdate = () => {
    // Just refresh the page to show updated data
    router.refresh();
  };

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "AU";
  };

  if (errorMessage) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-8 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your account settings and preferences
        </p>
        {user?.role_label && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {user.role_label}
          </div>
        )}
      </div>

      <div className="max-w-4xl space-y-8 pb-10 w-full mx-auto">
        {/* Profile Information */}
        <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white shadow-sm">
          <div className="flex items-center mb-6">
            <User className="w-5 h-5 text-emerald-500 mr-3" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Profile Information
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 bg-background border border-border rounded-full hover:bg-background/80 transition-colors"
              >
                <Camera className="h-4 w-4 text-text-muted" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                className="mb-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
              <p className="text-xs text-slate-400">
                JPG, PNG or GIF. Max size 2MB
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <Input
                  value={profile?.email || ""}
                  disabled
                  className="h-12 pl-12 bg-slate-50 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 pl-12"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="primary"
              onClick={handleProfileUpdate}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {/* ── Club Information Section (Only for Owners) ── */}
        {isOwner && (
          <ClubInfo
            clubName={venueClubName}
            streetAddress={venueStreetAddress}
            city={venueCity}
            latitude={venueLatitude}
            longitude={venueLongitude}
            images={venueImages}
            onUpdate={handleVenueUpdate}
          />
        )}

        {/* Payment Methods - Only show for Owners */}
        {isOwner && (
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white shadow-sm">
            <div className="flex items-center mb-6">
              <CreditCard className="w-5 h-5 text-emerald-500 mr-3" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Payment Methods
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 border-b border-slate-100 gap-3">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Manage Payment Methods
                </div>
                <div className="text-xs text-slate-500">
                  View all cards, set default, or remove payment methods
                </div>
              </div>
              <Link
                href="/dashboard/settings/payment-methods"
                className="w-full sm:w-auto"
              >
                <button className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto">
                  Manage
                </button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 sm:pt-6 gap-3">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Add New Payment Method
                </div>
                <div className="text-xs text-slate-500">
                  Add a bank account for withdrawals
                </div>
              </div>
              <Link
                href="/dashboard/settings/payment-methods"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  className="h-10 px-5 rounded-lg text-sm font-semibold w-full sm:w-auto"
                >
                  Add Card
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white shadow-sm">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-emerald-500 mr-3" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Security
            </h2>
          </div>

          {/* Schedule Maintenance - Only show for Owners */}
          {isOwner && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-5 border border-slate-100 rounded-xl px-4 sm:px-6 mb-4 bg-white shadow-sm gap-3">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Schedule Maintenance
                </div>
                <div className="text-xs text-slate-500">
                  {scheduleError
                    ? "Unable to load schedule"
                    : "Manage your weekly availability"}
                </div>
              </div>
              <Link
                href="/dashboard/settings/schedule"
                className="w-full sm:w-auto"
              >
                <button className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto">
                  Change Schedule
                </button>
              </Link>
            </div>
          )}

          {/* Password - Always shown */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-5 border border-slate-100 rounded-xl px-4 sm:px-6 bg-white shadow-sm gap-3">
            <div>
              <div className="text-sm font-medium text-slate-900">Password</div>
              <div className="text-xs text-slate-500">
                Last changed 30 days ago
              </div>
            </div>
            <Link
              href="/dashboard/settings/password"
              className="w-full sm:w-auto"
            >
              <button className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto">
                Change Password
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

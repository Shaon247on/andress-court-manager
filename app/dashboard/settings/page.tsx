// app/dashboard/settings/page.tsx

import { notFound } from "next/navigation";
import SettingsOverview from "./SettingsOverview";
import { 
  getProfileAction, 
  getScheduleAction,
  getVenueSettingsAction
} from "@/actions/settings.action";
import { getSession } from "@/lib/cookies";
import type { VenueImage } from "@/types/Settings.type";

export default async function SettingsPage() {
  // ── Get session user ──
  const session = await getSession();

  // ── Fetch profile ──
  const profileRes = await getProfileAction();
  if (!profileRes.success) {
    return (
      <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileRes.message}
        </div>
      </div>
    );
  }

  // ── Fetch schedule ──
  const scheduleRes = await getScheduleAction();
  const scheduleError = !scheduleRes.success ? scheduleRes.message : undefined;

  // ── Fetch venue settings ──
  const venueRes = await getVenueSettingsAction();
  
  // ── Properly typed venue data ──
  let venueData: {
    clubName: string;
    streetAddress: string;
    city: string;
    latitude: number;
    longitude: number;
    images: VenueImage[];
  } = {
    clubName: "",
    streetAddress: "",
    city: "",
    latitude: 40.7128,
    longitude: -74.006,
    images: [], // Now an array of VenueImage objects
  };

  if (venueRes.success && venueRes.data) {
    venueData = {
      clubName: venueRes.data.club_name || "",
      streetAddress: venueRes.data.location?.street_address || "",
      city: venueRes.data.location?.city || "",
      latitude: venueRes.data.location?.latitude || 40.7128,
      longitude: venueRes.data.location?.longitude || -74.006,
      images: venueRes.data.images || [], // Array of VenueImage objects
    };
  }

  return (
    <SettingsOverview
      profile={profileRes.data.profile}
      schedule={scheduleRes.success ? scheduleRes.data.schedule : null}
      scheduleError={scheduleError}
      user={session}
      venueClubName={venueData.clubName}
      venueStreetAddress={venueData.streetAddress}
      venueCity={venueData.city}
      venueLatitude={venueData.latitude}
      venueLongitude={venueData.longitude}
      venueImages={venueData.images}
    />
  );
}
// types/Settings.type.ts

export interface Profile {
  full_name: string;
  email: string;
  phone_number: string;
  photo_url: string;
}

export interface ProfileResponse {
  success: boolean;
  profile: Profile;
}

export interface ProfileUpdatePayload {
  full_name?: string;
  phone_number?: string;
  photo?: File;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  profile: Profile;
}

export interface DaySchedule {
  is_open: boolean;
  open: string;
  close: string;
}

export interface Schedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface ScheduleResponse {
  success: boolean;
  schedule: Schedule;
}

export interface UpdateSchedulePayload {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
  cancellation_hours?: number;
}

export interface UpdateScheduleResponse {
  success: boolean;
  message: string;
  schedule: Schedule;
}

export interface CancellationResponse {
  success: boolean;
  cancellation_hours: number;
}

export interface UpdateCancellationPayload {
  cancellation_hours: number;
}

export interface UpdateCancellationResponse {
  success: boolean;
  message: string;
  cancellation_hours: number;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// ── Club/Venue Information Types ──

export interface VenueLocation {
  latitude: number;
  longitude: number;
  street_address: string;
  city: string;
}

export interface VenueImage {
  id: string;
  url: string;
  is_cover: boolean;
  order: number;
}

export interface VenueSettings {
  club_name: string;
  location: VenueLocation;
  images: VenueImage[]; // Now an array of VenueImage objects
}

export interface VenueSettingsResponse {
  success: boolean;
  location: VenueLocation;
  club_name: string;
  images: VenueImage[]; // Array of image objects
}

export interface UpdateVenueSettingsPayload {
  club_name?: string;
  street_address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  images?: File[];
}

export interface UpdateVenueSettingsResponse {
  success: boolean;
  message: string;
  location: VenueLocation;
  club_name: string;
  images: VenueImage[]; // Array of image objects
}
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
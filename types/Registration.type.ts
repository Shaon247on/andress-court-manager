// types/Registration.type.ts

export interface DayScheduleInput {
  is_open: boolean;
  open: string;
  close: string;
}

export interface RegistrationSchedule {
  monday: DayScheduleInput;
  tuesday: DayScheduleInput;
  wednesday: DayScheduleInput;
  thursday: DayScheduleInput;
  friday: DayScheduleInput;
  saturday: DayScheduleInput;
  sunday: DayScheduleInput;
}

export interface RegistrationFormData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  clubName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  website: string;

  // Step 2: Location Details
  country: string;
  city: string;
  street: string;
  state: string;
  zip: string;

  // Step 3: Map Location
  latitude: number;
  longitude: number;

  // Step 4: Schedule (was Step 5)
  schedule: RegistrationSchedule;
  cancellationHours: number;

  // Step 5: Terms (was Step 6)
  agreedToTerms: boolean;
}

export interface RegistrationPayload {
  first_name: string;
  last_name: string;
  club_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  website: string;
  country: string;
  city: string;
  street_address: string;
  state_province: string;
  zip_postal_code: string;
  latitude: number;
  longitude: number;
  agreed_to_terms: boolean;
  schedule: RegistrationSchedule;
  cancellation_hours: number;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  application_id: string;
}
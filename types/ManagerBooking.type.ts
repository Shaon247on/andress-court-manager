export interface ScheduleBooking {
  id: string;
  court_name: string;
  booking_type: 'regular' | 'lesson' | 'event';
  status: 'confirmed' | 'cancelled' | 'pending';
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  payment_type: 'single' | 'split';
  game_format?: string;
  price_per_hour?: string;
  price_per_person?: string;
  total_amount: string;
  game_owner: string;
  repeat_type: 'none' | 'weekly' | 'monthly';
}

export interface CourtSchedule {
  court_id: string;
  court_name: string;
  game_formats: string[];
  price_per_hour: string;
  bookings: ScheduleBooking[];
}

export interface ScheduleResponse {
  success: boolean;
  schedule: {
    date: string;
    courts: CourtSchedule[];
  };
}


// ── Create Booking Types ──

export interface ParticipantInput {
  team: 'a' | 'b';
  position_role?: string;
  is_game_owner: boolean;
  is_paid: boolean;
  app_user_id: string;
}

export interface CreateBookingPayload {
  court_id: string;
  booking_type: 'regular' | 'lesson' | 'event';
  date: string;
  start_time: string;
  end_time: string;
  payment_type: 'single' | 'split';
  game_format: string;
  repeat_type: 'none' | 'weekly' | 'monthly';
  visibility: 'private' | 'public';
  participants: ParticipantInput[];
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  bookings: {
    id: string;
    court_name: string;
    venue_name: string;
    date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    match_type: string;
    visibility: string;
    payment_type: string;
    total_amount: string;
    amount_paid: string;
    status: string;
    created_at: string;
  }[];
}

// ── Booking Details Types ──

export interface Participant {
  id: string;
  team: 'a' | 'b';
  player_name: string;
  position_role: string;
  is_game_owner: boolean;
  amount_to_pay: string;
  is_paid: boolean;
  app_user_id: string;
}

export interface BookingDetail {
  id: string;
  court_name: string;
  booking_type: 'regular' | 'lesson' | 'event';
  status: 'confirmed' | 'cancelled' | 'pending';
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  payment_type: 'single' | 'split';
  game_format: string;
  price_per_hour: string;
  price_per_person: string;
  total_amount: string;
  repeat_type: 'none' | 'weekly' | 'monthly';
  repeat_group_id: string | null;
  visibility: 'private' | 'public';
  participants: Participant[];
  created_at: string;
}

export interface BookingDetailResponse {
  success: boolean;
  booking: BookingDetail;
}

// ── Search User Types ──

export interface SearchUserResult {
  user_id: string;
  name: string;
  email: string;
  username: string;
  code: string;
  preferred_position: string;
  is_customer: boolean;
  is_blocked: boolean;
}

export interface SearchUserResponse {
  success: boolean;
  results: SearchUserResult[];
  count: number;
}

// ── Update Booking Types ──

export interface UpdateBookingPayload {
  court_id: string;
  booking_type: 'regular' | 'lesson' | 'event';
  date: string;
  start_time: string;
  end_time: string;
  payment_type: 'single' | 'split';
  game_format: string;
  repeat_type: 'none' | 'weekly' | 'monthly';
  visibility: 'private' | 'public';
  participants: ParticipantInput[];
}

export interface UpdateBookingResponse {
  success: boolean;
  message: string;
  booking: BookingDetail;
}

// ── Cancel Booking ──

export interface CancelBookingResponse {
  success: boolean;
  message: string;
}

// ── Mark Participant Paid ──

export interface MarkParticipantPaidResponse {
  success: boolean;
  message: string;
}
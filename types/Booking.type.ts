export interface BookingCards {
  total_bookings: number;
  available_slots: number;
  utilization: number;
}

export interface BookingListItem {
  id: string;
  source: string;
  date: string;
  start_time: string;
  end_time: string;
  court: string;
  players: string[];
  player_count: number;
  amount: string;
  payment_type: string;
  booking_type: 'regular' | 'lesson' | 'event';
  kind: 'booking' | 'lesson';
  status: 'confirmed' | 'cancelled' | 'pending' | 'completed';
}

export interface BookingsTabResponse {
  success: boolean;
  date: string;
  cards: BookingCards;
  bookings: BookingListItem[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface BookingsTabQuery {
  date?: string;
  type?: 'all' | 'bookings' | 'lessons' | 'events';
  page?: number;
}

// ── Booking Details Types ──

export interface BookingParticipant {
  id: string;
  team: 'a' | 'b';
  player_name: string;
  position_role: string;
  is_game_owner: boolean;
  amount_to_pay: string;
  is_paid: boolean;
  app_user_id: string;
}

export interface BookingPlayerSlot {
  slot: number;
  open: boolean;
  name?: string;
  is_captain?: boolean;
  position?: string;
  ovr?: number;
  is_paid?: boolean;
  amount?: string;
}

export interface BookingTeamDetail {
  name: string;
  capacity: number;
  filled: number;
  players: BookingPlayerSlot[];
}

export interface BookingDetail {
  id: string;
  code: string;
  source: string;
  court_name: string;
  booking_type: 'regular' | 'lesson' | 'event';
  status: 'confirmed' | 'cancelled' | 'pending' | 'completed';
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  payment_type: string;
  game_format: string;
  price_per_hour: string;
  price_per_person: string;
  total_amount: string;
  repeat_type: string;
  repeat_group_id: string | null;
  visibility: string;
  participants: BookingParticipant[];
  created_at: string;
  court: {
    name: string;
    facility: string;
  };
  location: string;
  time: string;
  duration: number;
  price: string;
  per_player: string;
  customer: {
    name: string;
    email: string;
  };
  team_a: BookingTeamDetail;
  team_b: BookingTeamDetail;
}

export interface BookingDetailResponse {
  success: boolean;
  booking: BookingDetail;
}
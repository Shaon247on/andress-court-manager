// types/CourtManagerCourt.type.ts

export interface CourtStats {
  success: boolean;
  total: number;
  available: number;
  under_maintenance: number;
  closed: number;
}

export interface CourtResult {
  id: string;
  name: string;
  location: string;
  sport: string;
  surface: string;
  court_type: 'indoor' | 'outdoor' | 'both';
  game_formats: string[];
  status: 'active' | 'under_maintenance' | 'closed' | 'upcoming' | "merged";
  price_per_hour: string;
  merged_court_ids: string[];
  is_merged: boolean;
  bookings: number;
  revenue: string;
  created_at: string;
}

export interface CourtsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CourtResult[];
}

export interface CourtsQuery {
  search?: string;
  court_type?: 'indoor' | 'outdoor' | 'both';
  status?: 'active' | 'under_maintenance' | 'closed';
  page?: number;
}

export interface PricingPreview {
  duration: string;
  price: string;
}

export interface CourtDetail extends Omit<CourtResult, 'game_formats'> {
  game_formats: string[];
  description?: string;
  images_url: string | null;
  pricing: any[];
  rating: {
    average: number;
    count: number;
  };
  pricing_preview: PricingPreview[];
  updated_at: string;
}

export interface CourtDetailResponse {
  success: boolean;
  message: string;
  court: CourtDetail;
}

export interface CreateCourtPayload {
  name: string;
  description?: string;
  court_type: 'indoor' | 'outdoor' | 'both';
  game_formats: string[];
  price_per_hour: string;
  image?: File; // Changed from images to image (single)
}

export interface UpdateCourtPayload {
  name: string;
  description?: string;
  court_type: 'indoor' | 'outdoor' | 'both';
  game_formats: string[];
  price_per_hour: string;
  image?: File; // Changed from images to image (single)
}

export interface UpdateStatusPayload {
  status: 'active' | 'under_maintenance' | 'closed';
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
}


// marge courts

export interface MergedCourtItem {
  id: string;
  name: string;
  court_type: string;
  game_format: string;
}

export interface MergedCourt {
  id: string;
  name: string;
  court_type: 'indoor' | 'outdoor' | 'both';
  sport: string;
  surface: string;
  game_format: string;
  game_formats: string[];
  location: string;
  start_time: string;
  end_time: string;
  price_per_hour: string;
  status: 'upcoming' | 'merged' | 'completed' | 'cancelled' | 'active';
  current_status: string;
  courts: MergedCourtItem[];
  created_at: string;
}

export interface MergedCourtsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MergedCourt[];
}

export interface MergedCourtsQuery {
  q?: string;
  status?: 'upcoming' | 'merged' | 'completed' | 'cancelled' | 'active';
  page?: number;
}

export interface CreateMergedCourtPayload {
  court_ids: string[];
  start_time: string;
  end_time: string;
  price: number;
}

export interface MergedCourtResponse {
  success: boolean;
  message: string;
  data: MergedCourt;
}

export interface MergedCourtDetailResponse {
  success: boolean;
  data: MergedCourt;
}
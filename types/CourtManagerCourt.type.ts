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
  status: 'active' | 'under_maintenance' | 'closed';
  price_per_hour: string;
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
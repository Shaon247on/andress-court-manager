// ── Revenue Overview Types ──

export interface RevenueStats {
  success: boolean;
  total_earnings: string;
  bookings_count: number;
  total_withdrawn: string;
  pending_amount: string;
  pending_count: number;
  available_balance: string;
}

export interface WithdrawalRequest {
  id: string;
  code: string;
  amount: string;
  status: 'pending' | 'paid' | 'rejected';
  created_at: string;
  process_date: string | null;
}

export interface EarningItem {
  date: string;
  booking_id: string;
  players: string;
  amount: string;
  status: 'Paid' | 'Pending';
}

export interface RevenueResponse {
  success: boolean;
  total_earnings: string;
  bookings_count: number;
  total_withdrawn: string;
  pending_amount: string;
  pending_count: number;
  available_balance: string;
  withdrawal_requests: WithdrawalRequest[];
  earnings_summary: EarningItem[];
}

// ── Withdrawals List Types ──

export interface WithdrawalsListResponse {
  success: boolean;
  results: WithdrawalRequest[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface EarningsListResponse {
  success: boolean;
  results: EarningItem[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface WithdrawPayload {
  amount: string;
}

export interface WithdrawResponse {
  success: boolean;
  message: string;
  withdrawal: WithdrawalRequest;
}
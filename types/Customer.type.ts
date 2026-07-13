// types/Customer.type.ts

export interface Customer {
  id: string;
  user_id: string;
  code: string;
  username: string;
  full_name: string;
  country: string;
  phone: string;
  email: string;
  total_games: number;
  benefits: number;
  is_blocked: boolean;
}

export interface CustomersListResponse {
  success: boolean;
  customers: Customer[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface CustomersQuery {
  search?: string;
  filter?: 'all' | 'benefits';
  page?: number;
}

export interface Benefit {
  id: string;
  benefit_type: 'percentage' | 'fixed';
  value: string;
  apply_on: 'split' | 'full' | 'all';
  usage_per_day: number;
  usage_per_month: number;
  is_active: boolean;
  created_at: string;
}

export interface BenefitsResponse {
  success: boolean;
  benefits: Benefit[];
}

export interface CreateCustomerPayload {
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  username?: string;
}

export interface CreateCustomerResponse {
  success: boolean;
  message: string;
  customer_id: string;
  code: string;
  created: boolean;
}

export interface EditCustomerPayload {
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  username?: string;
}

export interface EditCustomerResponse {
  success: boolean;
  message: string;
  customer_id: string;
  code: string;
  created: boolean;
}

export interface BlockCustomerResponse {
  success: boolean;
  message: string;
  is_blocked: boolean;
}

export interface AddBenefitPayload {
  benefit_type: 'percentage' | 'fixed';
  value: string;
  apply_on: 'split' | 'full' | 'all';
  usage_per_day: number;
  usage_per_month: number;
}

export interface AddBenefitResponse {
  success: boolean;
  message: string;
  benefit_id: string;
}

export interface RemoveBenefitResponse {
  success: boolean;
  message: string;
}
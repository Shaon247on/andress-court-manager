export interface PayoutMethod {
  id: string;
  account_type: string;
  account_number: string;
  account_holder: string;
  is_default: boolean;
  created_at: string;
}

export interface PayoutMethodsResponse {
  success: boolean;
  payout_methods: PayoutMethod[];
}

export interface AddPayoutMethodPayload {
  account_type: string;
  account_number: string;
  account_holder: string;
}

export interface AddPayoutMethodResponse {
  success: boolean;
  message: string;
  payout_method: PayoutMethod;
}

export interface SetDefaultPayoutMethodResponse {
  success: boolean;
  message: string;
  payout_method: PayoutMethod;
}

export interface RemovePayoutMethodResponse {
  success: boolean;
  message: string;
}
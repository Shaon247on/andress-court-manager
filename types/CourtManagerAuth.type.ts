export interface CourtManagerLoginPayload {
  email: string;
  password: string;
}

export interface CourtManagerUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface CourtManagerLoginResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  user: CourtManagerUser;
}
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  session_token: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  reset_token: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
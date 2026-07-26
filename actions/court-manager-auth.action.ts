"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  clearAuthCookies,
  clearSessionToken,
  getResetToken,
  getSessionToken,
  setAuthCookies,
  setResetToken,
  setSessionToken,
} from "@/lib/cookies";
import { courtManagerLoginSchema } from "@/schemas/CourtManagerAuth.schema";
import type { CourtManagerLoginResponse } from "@/types/CourtManagerAuth.type";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "@/schemas/auth.schema";
import { getFirstAvailableRoute } from "@/lib/navigation";

export async function courtManagerLoginAction(values: unknown) {
  const parseResult = courtManagerLoginSchema.safeParse(values);
  if (!parseResult.success) {
    return { 
      success: false, 
      message: parseResult.error.issues[0]?.message || 'Invalid login values' 
    };
  }

  try {
    const api = await getServerApi();
    const response = await api.post('/manager/auth/login/', parseResult.data);
    const apiResult = handleActionResponse(response.data);
    
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || 'Login failed' };
    }

    const data = apiResult.data;
    const permissions = data.user?.permissions || {};
    
    console.log('🔐 Login Response - Full User:', JSON.stringify(data.user, null, 2));
    console.log('🔐 Login Response - Role Label:', data.user?.role_label);
    console.log('🔐 Login Response - Role Name:', data.user?.role_name);
    
    // Store COMPLETE user data in cookies
    await setAuthCookies({ 
      access_token: data.access_token, 
      refresh_token: data.refresh_token, 
      user: data.user, // Pass the complete user object
      permissions: permissions
    });
    
    // Get the first available route based on permissions
    const redirectRoute = getFirstAvailableRoute(permissions);
    console.log('➡️ Redirecting to:', redirectRoute);
    
    return { 
      success: true, 
      data: { 
        user: data.user,
        redirectTo: redirectRoute
      } 
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

export async function forgotPasswordAction(values: unknown) {
  const parseResult = forgotPasswordSchema.safeParse(values);
  if (!parseResult.success) {
    return {
      success: false,
      message: parseResult.error.issues[0]?.message || "Invalid email address",
    };
  }

  try {
    const api = await getServerApi();
    const response = await api.post(
      "/manager/auth/forgot-password/",
      parseResult.data,
    );
    const apiResult = handleActionResponse(response.data);
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || "Request failed" };
    }

    const data = apiResult.data;
    if (data.session_token) {
      await setSessionToken(data.session_token);
    }

    return {
      success: true,
      data: {
        session_token: data.session_token,
        message: data.message,
      },
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

export async function verifyOtpAction(values: unknown) {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return {
      success: false,
      message: "Session expired. Please request a new OTP.",
    };
  }

  const valuesWithToken = {
    ...(values as Record<string, any>),
    session_token: sessionToken,
  };
  const parseResult = verifyOtpSchema.safeParse(valuesWithToken);
  if (!parseResult.success) {
    return {
      success: false,
      message: parseResult.error.issues[0]?.message || "Invalid OTP input",
    };
  }

  try {
    const api = await getServerApi();
    const response = await api.post(
      "/manager/auth/verify-otp/",
      parseResult.data,
    );
    const apiResult = handleActionResponse(response.data);
    if (!apiResult.success) {
      return {
        success: false,
        message: apiResult.message || "OTP verification failed",
      };
    }

    const data = apiResult.data;
    if (data.reset_token) {
      await setResetToken(data.reset_token);
      // Clear session token as it's no longer needed
      await clearSessionToken();
    }

    return {
      success: true,
      data: {
        reset_token: data.reset_token,
        message: data.message,
      },
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

export async function resetPasswordAction(values: unknown) {
  const token = await getResetToken();
  if (!token) {
    return {
      success: false,
      message: "Reset session expired. Please request a new password reset.",
    };
  }

  const valuesWithToken = {
    ...(values as Record<string, any>),
    reset_token: token,
  };
  const parseResult = resetPasswordSchema.safeParse(valuesWithToken);
  if (!parseResult.success) {
    return {
      success: false,
      message: parseResult.error.issues[0]?.message || "Invalid reset values",
    };
  }

  try {
    const api = await getServerApi();
    const response = await api.post(
      "/manager/auth/reset-password/",
      parseResult.data,
    );
    const apiResult = handleActionResponse(response.data);
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || "Reset failed" };
    }

    // Clear all auth cookies
    await clearAuthCookies();

    return {
      success: true,
      data: {
        message: apiResult.data.message || "Password reset successfully.",
      },
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
export async function logoutAction() {
  try {
    const { clearAuthCookies } = await import("@/lib/cookies");
    await clearAuthCookies();
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    return { success: false, message: "Error during logout" };
  }
}

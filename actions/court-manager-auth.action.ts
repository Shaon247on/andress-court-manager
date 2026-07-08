"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { setAuthCookies } from "@/lib/cookies";
import { courtManagerLoginSchema } from "@/schemas/CourtManagerAuth.schema";
import type { CourtManagerLoginResponse } from "@/types/CourtManagerAuth.type";

export async function courtManagerLoginAction(values: unknown) {
  const parseResult = courtManagerLoginSchema.safeParse(values);
  if (!parseResult.success) {
    return { 
      success: false, 
      message: parseResult.error.errors[0]?.message || 'Invalid login values' 
    };
  }

  try {
    const api = await getServerApi();
    const response = await api.post('/manager/auth/login/', parseResult.data);
    const apiResult = handleActionResponse(response.data);
    
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || 'Login failed' };
    }

    const data = apiResult.data as CourtManagerLoginResponse;
    
    // Store auth cookies (access token, refresh token, user)
    await setAuthCookies({ 
      access_token: data.access_token, 
      refresh_token: data.refresh_token, 
      user: data.user,
      permissions: {} // Court managers don't have permissions like admin
    });
    
    return { success: true, data: { user: data.user } };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
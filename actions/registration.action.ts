// actions/registration.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { registrationPayloadSchema } from "@/schemas/Registration.schema";
import type { RegistrationPayload, RegistrationResponse } from "@/types/Registration.type";

export async function registerCourtManagerAction(values: unknown) {
  const parseResult = registrationPayloadSchema.safeParse(values);
  if (!parseResult.success) {
    return { 
      success: false, 
      message: parseResult.error.issues[0]?.message || 'Invalid registration values' 
    };
  }

  try {
    const api = await getServerApi();
    const response = await api.post('/manager/auth/register/', parseResult.data);
    const apiResult = handleActionResponse(response.data);
    
    if (!apiResult.success) {
      return { success: false, message: apiResult.message || 'Registration failed' };
    }

    const data = apiResult.data as RegistrationResponse;
    
    return { 
      success: true, 
      data: {
        message: data.message,
        application_id: data.application_id
      } 
    };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
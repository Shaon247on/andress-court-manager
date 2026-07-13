// actions/settings.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  profileUpdateSchema,
  changePasswordSchema,
  updateScheduleSchema,
  updateCancellationSchema,
} from "@/schemas/Settings.schema";
import { updateSession } from "@/lib/cookies";
import type {
  ProfileResponse,
  ProfileUpdatePayload,
  ProfileUpdateResponse,
  ScheduleResponse,
  UpdateSchedulePayload,
  UpdateScheduleResponse,
  UpdateCancellationPayload,
  UpdateCancellationResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  CancellationResponse,
} from "@/types/Settings.type";

// ── GET profile ────────────────────────────────────────────────────────────

export async function getProfileAction(): Promise<
  { success: true; data: ProfileResponse } | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/settings/profile/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load profile",
      };
    }

    return { success: true, data: result.data as ProfileResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── UPDATE profile ─────────────────────────────────────────────────────────

export async function updateProfileAction(
  raw: FormData,
): Promise<
  | { success: true; data: ProfileUpdateResponse }
  | { success: false; message: string }
> {
  try {
    // Extract and validate text fields
    const full_name = (raw.get("full_name") as string) || undefined;
    const phone_number = (raw.get("phone_number") as string) || undefined;
    const photo = (raw.get("photo") as File) || undefined;

    // Validate the data
    const validationResult = profileUpdateSchema.safeParse({
      full_name,
      phone_number,
    });
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues[0]?.message ?? "Invalid input",
      };
    }

    // Create FormData for the API
    const formData = new FormData();
    if (full_name) formData.append("full_name", full_name);
    if (phone_number) formData.append("phone_number", phone_number);
    if (photo && photo instanceof File) {
      // Validate file size (2MB)
      if (photo.size > 2 * 1024 * 1024) {
        return {
          success: false,
          message: "Photo must be less than 2MB",
        };
      }
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(photo.type)) {
        return {
          success: false,
          message: "Photo must be JPG, PNG, or GIF format",
        };
      }
      formData.append("photo", photo);
    }

    const api = await getServerApi();
    const response = await api.patch("/manager/settings/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to update profile",
      };
    }

    const profileData = result.data as ProfileUpdateResponse;

    // Update session cookie with new user data
    const updatedUserData = {
      full_name: profileData.profile.full_name,
      email: profileData.profile.email,
      phone_number: profileData.profile.phone_number,
      photo_url: profileData.profile.photo_url,
    };
    await updateSession(updatedUserData);

    return { success: true, data: profileData };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET schedule ───────────────────────────────────────────────────────────

export async function getScheduleAction(): Promise<
  { success: true; data: ScheduleResponse } | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/settings/schedule/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load schedule",
      };
    }

    return { success: true, data: result.data as ScheduleResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── UPDATE schedule ────────────────────────────────────────────────────────

export async function updateScheduleAction(
  raw: unknown,
): Promise<
  | { success: true; data: UpdateScheduleResponse }
  | { success: false; message: string }
> {
  const parsed = updateScheduleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const body: UpdateSchedulePayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.put("/manager/settings/schedule/", body);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to update schedule",
      };
    }

    return { success: true, data: result.data as UpdateScheduleResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET cancellation ────────────────────────────────────────────────────


export async function getCancellationAction(): Promise<
  { success: true; data: CancellationResponse } | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/settings/cancellation/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load cancellation window",
      };
    }

    return { success: true, data: result.data as CancellationResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── UPDATE cancellation ────────────────────────────────────────────────────

export async function updateCancellationAction(
  raw: unknown,
): Promise<
  | { success: true; data: UpdateCancellationResponse }
  | { success: false; message: string }
> {
  const parsed = updateCancellationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const body: UpdateCancellationPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.patch("/manager/settings/cancellation/", body);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to update cancellation window",
      };
    }

    return { success: true, data: result.data as UpdateCancellationResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Change password ────────────────────────────────────────────────────────

export async function changePasswordAction(
  raw: unknown,
): Promise<
  | { success: true; data: ChangePasswordResponse }
  | { success: false; message: string }
> {
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const body: ChangePasswordPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/settings/change-password/", body);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to change password",
      };
    }

    return { success: true, data: result.data as ChangePasswordResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
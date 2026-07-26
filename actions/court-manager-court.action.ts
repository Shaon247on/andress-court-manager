// actions/court-manager-court.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  courtsQuerySchema,
  createCourtSchema,
  updateCourtSchema,
  updateStatusSchema,
} from "@/schemas/CourtManagerCourt.schema";
import type {
  CourtStats,
  CourtsQuery,
  CourtsListResponse,
  CourtDetailResponse,
  CreateCourtPayload,
  UpdateCourtPayload,
  UpdateStatusPayload,
  UpdateStatusResponse,
} from "@/types/CourtManagerCourt.type";

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getCourtStatsAction(): Promise<
  | { success: true; data: CourtStats }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/courts/stats/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load stats" };
    }
    
    return { success: true, data: result.data as CourtStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET courts ─────────────────────────────────────────────────────────────

export async function getCourtsAction(rawParams: unknown): Promise<
  | { success: true; data: CourtsListResponse }
  | { success: false; message: string }
> {
  const parseResult = courtsQuerySchema.safeParse(rawParams);
  const params: CourtsQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/manager/courts/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load courts" };
    }
    
    return { success: true, data: result.data as CourtsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET court details ─────────────────────────────────────────────────────

export async function getCourtDetailsAction(courtId: string): Promise<
  | { success: true; data: CourtDetailResponse }
  | { success: false; message: string }
> {
  if (!courtId) return { success: false, message: "Court ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/manager/courts/${courtId}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load court details" };
    }
    
    return { success: true, data: result.data as CourtDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Create court ──────────────────────────────────────────────────────────

export async function createCourtAction(raw: FormData): Promise<
  | { success: true; data: CourtDetailResponse }
  | { success: false; message: string }
> {
  try {
    // Extract and validate text fields
    const name = raw.get("name") as string;
    // const description = raw.get("description") as string | undefined;
    const court_type = raw.get("court_type") as 'indoor' | 'outdoor' | 'both';
    const game_formats = JSON.parse(raw.get("game_formats") as string || '[]');
    const price_per_hour = raw.get("price_per_hour") as string;

    // Validate the data
    const validationResult = createCourtSchema.safeParse({
      name,
      // description,
      court_type,
      game_formats,
      price_per_hour,
    });
    
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues[0]?.message ?? "Invalid input",
      };
    }

    // Create FormData for the API
    const formData = new FormData();
    formData.append("name", name);
    formData.append("court_type", court_type);
    formData.append("game_formats", JSON.stringify(game_formats));
    formData.append("price_per_hour", price_per_hour);

    // Handle single image
    const image = raw.get("image") as File;
    if (image && image instanceof File) {
      // Validate file size (10MB)
      if (image.size > 10 * 1024 * 1024) {
        return {
          success: false,
          message: "Image must be less than 10MB",
        };
      }
      formData.append("image", image);
    }

    const api = await getServerApi();
    const response = await api.post("/manager/courts/create/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to create court" };
    }
    
    return { success: true, data: result.data as CourtDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Update court ──────────────────────────────────────────────────────────

export async function updateCourtAction(
  courtId: string,
  raw: FormData
): Promise<
  | { success: true; data: CourtDetailResponse }
  | { success: false; message: string }
> {
  if (!courtId) return { success: false, message: "Court ID is required" };

  try {
    const name = raw.get("name") as string;
    const description = raw.get("description") as string | undefined;
    const court_type = raw.get("court_type") as 'indoor' | 'outdoor' | 'both';
    const game_formats = JSON.parse(raw.get("game_formats") as string || '[]');
    const price_per_hour = raw.get("price_per_hour") as string;

    const validationResult = updateCourtSchema.safeParse({
      name,
      description,
      court_type,
      game_formats,
      price_per_hour,
    });
    
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    formData.append("court_type", court_type);
    formData.append("game_formats", JSON.stringify(game_formats));
    formData.append("price_per_hour", price_per_hour);

    // Handle single image
    const image = raw.get("image") as File;
    if (image && image instanceof File) {
      if (image.size > 10 * 1024 * 1024) {
        return {
          success: false,
          message: "Image must be less than 10MB",
        };
      }
      formData.append("images", image);
    }

    const api = await getServerApi();
    const response = await api.patch(`/manager/courts/${courtId}/update/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to update court" };
    }
    
    return { success: true, data: result.data as CourtDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Update court status ──────────────────────────────────────────────────

export async function updateCourtStatusAction(
  courtId: string,
  raw: unknown
): Promise<
  | { success: true; data: UpdateStatusResponse }
  | { success: false; message: string }
> {
  if (!courtId) return { success: false, message: "Court ID is required" };

  const parsed = updateStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const body: UpdateStatusPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/manager/courts/${courtId}/status/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to update court status" };
    }
    
    return { success: true, data: result.data as UpdateStatusResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Delete court ──────────────────────────────────────────────────────────

export async function deleteCourtAction(courtId: string): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  if (!courtId) return { success: false, message: "Court ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.delete(`/manager/courts/${courtId}/delete/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to delete court" };
    }
    
    return { success: true, message: result.data?.message ?? "Court deleted successfully" };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
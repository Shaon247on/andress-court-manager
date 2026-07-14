// actions/manager-booking.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { bookingsTabQuerySchema } from "@/schemas/Booking.schema";
import type {
  BookingsTabResponse,
  BookingsTabQuery,
  BookingDetailResponse,
} from "@/types/Booking.type";

// ── GET bookings tab data ─────────────────────────────────────────────────

export async function getBookingsTabAction(rawParams: unknown): Promise<
  | { success: true; data: BookingsTabResponse }
  | { success: false; message: string }
> {
  const parseResult = bookingsTabQuerySchema.safeParse(rawParams);
  const params: BookingsTabQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/manager/bookings/tab/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load bookings" };
    }
    
    return { success: true, data: result.data as BookingsTabResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET booking details ───────────────────────────────────────────────────

export async function getManagerBookingDetailsAction(id: string): Promise<
  | { success: true; data: BookingDetailResponse }
  | { success: false; message: string }
> {
  if (!id) return { success: false, message: "Booking ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/manager/bookings/${id}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load booking details" };
    }
    
    return { success: true, data: result.data as BookingDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
// actions/manager-booking.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  createBookingSchema,
  updateBookingSchema,
  searchUsersSchema,
} from "@/schemas/ManagerBooking.schema";
import type {
  ScheduleResponse,
  CreateBookingPayload,
  CreateBookingResponse,
  BookingDetailResponse,
  UpdateBookingPayload,
  UpdateBookingResponse,
  CancelBookingResponse,
  SearchUserResponse,
  MarkParticipantPaidResponse,
} from "@/types/ManagerBooking.type";

// ── GET Schedule ────────────────────────────────────────────────────────────

export async function getScheduleAction(date: string): Promise<
  | { success: true; data: ScheduleResponse }
  | { success: false; message: string }
> {
  if (!date) return { success: false, message: "Date is required" };

  try {
    const api = await getServerApi();
    // Ensure the date is in YYYY-MM-DD format
    const formattedDate = date.split('T')[0]; // Just in case
    const response = await api.get("/manager/bookings/schedule/", { 
      params: { date: formattedDate } 
    });

    console.log("the schedule data response:",response.data.schedule.courts.bookings  )
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load schedule" };
    }
    
    return { success: true, data: result.data as ScheduleResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Create Booking ──────────────────────────────────────────────────────────

export async function createBookingAction(raw: unknown): Promise<
  | { success: true; data: CreateBookingResponse }
  | { success: false; message: string }
> {
  const parsed = createBookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: CreateBookingPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/bookings/create/", body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to create booking" };
    }
    
    return { success: true, data: result.data as CreateBookingResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Get Booking Details ────────────────────────────────────────────────────

export async function getBookingDetailsAction(bookingId: string): Promise<
  | { success: true; data: BookingDetailResponse }
  | { success: false; message: string }
> {
  if (!bookingId) return { success: false, message: "Booking ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/manager/bookings/${bookingId}/`);
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

// ── Update Booking ──────────────────────────────────────────────────────────

export async function updateBookingAction(
  bookingId: string,
  raw: unknown
): Promise<
  | { success: true; data: UpdateBookingResponse }
  | { success: false; message: string }
> {
  if (!bookingId) return { success: false, message: "Booking ID is required" };

  // ── Only validate fields that are present ──
  const parsed = updateBookingSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('❌ Validation error:', parsed.error.issues);
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }


  
  
  const body: UpdateBookingPayload = parsed.data;
  
  console.log("the payload:",body)
  try {
    const api = await getServerApi();
    const response = await api.patch(`/manager/bookings/${bookingId}/update/`, body);

    console.log("the response:", response.data)
    const result = handleActionResponse(response.data);
    
    // ── Check if the API returned an error ──
    if (!result.success) {
      // ── Extract the error message from the API response ──
      const errorMessage = result.message || response.data?.message || 'Failed to update booking';
      console.error('❌ API Error:', errorMessage);
      return { success: false, message: errorMessage };
    }
    
    return { success: true, data: result.data as UpdateBookingResponse };
  } catch (error: any) {
    // ── Handle Axios errors ──
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update booking';
    console.error('❌ Update error:', errorMessage);
    return { success: false, message: errorMessage };
  }
}

// ── Cancel Booking ──────────────────────────────────────────────────────────

export async function cancelBookingAction(bookingId: string): Promise<
  | { success: true; data: CancelBookingResponse }
  | { success: false; message: string }
> {
  if (!bookingId) return { success: false, message: "Booking ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.delete(`/manager/bookings/${bookingId}/cancel/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to cancel booking" };
    }
    
    return { success: true, data: result.data as CancelBookingResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Mark Participant as Paid ───────────────────────────────────────────────

export async function markParticipantPaidAction(
  bookingId: string,
  participantId: string
): Promise<
  | { success: true; data: MarkParticipantPaidResponse }
  | { success: false; message: string }
> {
  if (!bookingId) return { success: false, message: "Booking ID is required" };
  if (!participantId) return { success: false, message: "Participant ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(
      `/manager/bookings/${bookingId}/participants/${participantId}/paid/`
    );
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to mark participant as paid" };
    }
    
    return { success: true, data: result.data as MarkParticipantPaidResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Search Users ────────────────────────────────────────────────────────────

export async function searchUsersAction(raw: unknown): Promise<
  | { success: true; data: SearchUserResponse }
  | { success: false; message: string }
> {
  const parsed = searchUsersSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid search query" 
    };
  }

  try {
    const api = await getServerApi();
    const response = await api.get("/manager/players/search/", { 
      params: parsed.data 
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to search users" };
    }
    
    return { success: true, data: result.data as SearchUserResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
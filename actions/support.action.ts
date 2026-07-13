// actions/support.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  supportQuerySchema,
  createSupportTicketSchema,
  supportReplySchema,
} from "@/schemas/Support.schema";
import type {
  SupportCategory,
  SupportStatus,
  SupportTicketsListResponse,
  SupportTicketDetailResponse,
  SupportReplyResponse,
  CreateSupportTicketPayload,
  SupportReplyPayload,
  SupportQuery,
  SupportTicket,
} from "@/types/Support.type";

// ── GET categories ──────────────────────────────────────────────────────────

export async function getSupportCategoriesAction(): Promise<
  | { success: true; data: SupportCategory[] }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/support/categories/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load categories" };
    }
    
    return { success: true, data: result.data.categories as SupportCategory[] };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET statuses ────────────────────────────────────────────────────────────

export async function getSupportStatusesAction(): Promise<
  | { success: true; data: SupportStatus[] }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/support/statuses/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load statuses" };
    }
    
    return { success: true, data: result.data.statuses as SupportStatus[] };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET manager tickets ────────────────────────────────────────────────────

export async function getManagerTicketsAction(rawParams: unknown): Promise<
  | { success: true; data: SupportTicketsListResponse }
  | { success: false; message: string }
> {
  const parseResult = supportQuerySchema.safeParse(rawParams);
  const params: SupportQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/manager/support/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load tickets" };
    }
    
    return { success: true, data: result.data as SupportTicketsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET ticket thread ──────────────────────────────────────────────────────

export async function getTicketThreadAction(code: string): Promise<
  | { success: true; data: SupportTicketDetailResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Ticket code is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/manager/support/${code}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load ticket thread" };
    }
    
    return { success: true, data: result.data as SupportTicketDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Create ticket ──────────────────────────────────────────────────────────

export async function createTicketAction(raw: unknown): Promise<
  | { success: true; data: { message: string; ticket: SupportTicket } }
  | { success: false; message: string }
> {
  const parsed = createSupportTicketSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: CreateSupportTicketPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/support/", body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to create ticket" };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Reply to ticket ────────────────────────────────────────────────────────

export async function replyToTicketAction(
  code: string,
  raw: unknown
): Promise<
  | { success: true; data: SupportReplyResponse }
  | { success: false; message: string }
> {
  if (!code) return { success: false, message: "Ticket code is required" };

  const parsed = supportReplySchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: SupportReplyPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/manager/support/${code}/reply/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to send reply" };
    }
    
    return { success: true, data: result.data as SupportReplyResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
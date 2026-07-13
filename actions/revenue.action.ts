"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { withdrawSchema } from "@/schemas/Revenue.schema";
import type {
  RevenueResponse,
  WithdrawalsListResponse,
  EarningsListResponse,
  WithdrawPayload,
  WithdrawResponse,
} from "@/types/Revenue.type";

// ── GET revenue overview ──────────────────────────────────────────────────

export async function getRevenueAction(): Promise<
  | { success: true; data: RevenueResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/revenue/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load revenue data" };
    }
    
    return { success: true, data: result.data as RevenueResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET withdrawals list ──────────────────────────────────────────────────

export async function getWithdrawalsAction(page: number = 1): Promise<
  | { success: true; data: WithdrawalsListResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/revenue/withdrawals/", { 
      params: { page } 
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load withdrawals" };
    }
    
    return { success: true, data: result.data as WithdrawalsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET earnings list ─────────────────────────────────────────────────────

export async function getEarningsAction(page: number = 1): Promise<
  | { success: true; data: EarningsListResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/revenue/earnings/", { 
      params: { page } 
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load earnings" };
    }
    
    return { success: true, data: result.data as EarningsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Request withdrawal ────────────────────────────────────────────────────

export async function withdrawAction(raw: unknown): Promise<
  | { success: true; data: WithdrawResponse }
  | { success: false; message: string }
> {
  const parsed = withdrawSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: WithdrawPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/revenue/withdraw/", body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to submit withdrawal" };
    }
    
    return { success: true, data: result.data as WithdrawResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
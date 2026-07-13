"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import { addPayoutMethodSchema } from "@/schemas/Revenue.schema";
import type {
  PayoutMethodsResponse,
  AddPayoutMethodPayload,
  AddPayoutMethodResponse,
  SetDefaultPayoutMethodResponse,
  RemovePayoutMethodResponse,
} from "@/types/PayoutMethod.type";

// ── GET payout methods ────────────────────────────────────────────────────

export async function getPayoutMethodsAction(): Promise<
  | { success: true; data: PayoutMethodsResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/settings/payout-methods/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load payout methods" };
    }
    
    return { success: true, data: result.data as PayoutMethodsResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Add payout method ─────────────────────────────────────────────────────

export async function addPayoutMethodAction(raw: unknown): Promise<
  | { success: true; data: AddPayoutMethodResponse }
  | { success: false; message: string }
> {
  const parsed = addPayoutMethodSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: AddPayoutMethodPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/settings/payout-methods/", body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to add payout method" };
    }
    
    return { success: true, data: result.data as AddPayoutMethodResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Set default payout method ─────────────────────────────────────────────

export async function setDefaultPayoutMethodAction(payoutMethodId: string): Promise<
  | { success: true; data: SetDefaultPayoutMethodResponse }
  | { success: false; message: string }
> {
  if (!payoutMethodId) return { success: false, message: "Payout method ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/manager/settings/payout-methods/${payoutMethodId}/default/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to set default payout method" };
    }
    
    return { success: true, data: result.data as SetDefaultPayoutMethodResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Remove payout method ──────────────────────────────────────────────────

export async function removePayoutMethodAction(payoutMethodId: string): Promise<
  | { success: true; data: RemovePayoutMethodResponse }
  | { success: false; message: string }
> {
  if (!payoutMethodId) return { success: false, message: "Payout method ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.delete(`/manager/settings/payout-methods/${payoutMethodId}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to remove payout method" };
    }
    
    return { success: true, data: result.data as RemovePayoutMethodResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
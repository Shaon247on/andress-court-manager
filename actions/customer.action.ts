// actions/customer.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  customersQuerySchema,
  createCustomerSchema,
  editCustomerSchema,
  addBenefitSchema,
} from "@/schemas/Customer.schema";
import type {
  CustomersListResponse,
  CustomersQuery,
  BenefitsResponse,
  CreateCustomerPayload,
  CreateCustomerResponse,
  EditCustomerPayload,
  EditCustomerResponse,
  BlockCustomerResponse,
  AddBenefitPayload,
  AddBenefitResponse,
  RemoveBenefitResponse,
} from "@/types/Customer.type";

// ── GET customers ──────────────────────────────────────────────────────────

export async function getCustomersAction(rawParams: unknown): Promise<
  | { success: true; data: CustomersListResponse }
  | { success: false; message: string }
> {
  const parseResult = customersQuerySchema.safeParse(rawParams);
  const params: CustomersQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/manager/customers/", { params });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load customers" };
    }
    
    return { success: true, data: result.data as CustomersListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET customer benefits ─────────────────────────────────────────────────

export async function getCustomerBenefitsAction(customerId: string): Promise<
  | { success: true; data: BenefitsResponse }
  | { success: false; message: string }
> {
  if (!customerId) return { success: false, message: "Customer ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/manager/customers/${customerId}/benefits/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load benefits" };
    }
    
    return { success: true, data: result.data as BenefitsResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Create customer ───────────────────────────────────────────────────────

export async function createCustomerAction(raw: unknown): Promise<
  | { success: true; data: CreateCustomerResponse }
  | { success: false; message: string }
> {
  const parsed = createCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: CreateCustomerPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/customers/", body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to create customer" };
    }
    
    return { success: true, data: result.data as CreateCustomerResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Edit customer ─────────────────────────────────────────────────────────

export async function editCustomerAction(
  customerId: string,
  raw: unknown
): Promise<
  | { success: true; data: EditCustomerResponse }
  | { success: false; message: string }
> {
  if (!customerId) return { success: false, message: "Customer ID is required" };

  const parsed = editCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: EditCustomerPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.put(`/manager/customers/${customerId}/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to edit customer" };
    }
    
    return { success: true, data: result.data as EditCustomerResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Block customer ────────────────────────────────────────────────────────

export async function blockCustomerAction(customerId: string): Promise<
  | { success: true; data: BlockCustomerResponse }
  | { success: false; message: string }
> {
  if (!customerId) return { success: false, message: "Customer ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/manager/customers/${customerId}/block/`, {
      blocked: true,
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to block customer" };
    }
    
    return { success: true, data: result.data as BlockCustomerResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Unblock customer ──────────────────────────────────────────────────────

export async function unblockCustomerAction(customerId: string): Promise<
  | { success: true; data: BlockCustomerResponse }
  | { success: false; message: string }
> {
  if (!customerId) return { success: false, message: "Customer ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.post(`/manager/customers/${customerId}/block/`, {
      blocked: false,
    });
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to unblock customer" };
    }
    
    return { success: true, data: result.data as BlockCustomerResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Add benefit ───────────────────────────────────────────────────────────

export async function addBenefitAction(
  customerId: string,
  raw: unknown
): Promise<
  | { success: true; data: AddBenefitResponse }
  | { success: false; message: string }
> {
  if (!customerId) return { success: false, message: "Customer ID is required" };

  const parsed = addBenefitSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: AddBenefitPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post(`/manager/customers/${customerId}/benefits/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to add benefit" };
    }
    
    return { success: true, data: result.data as AddBenefitResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Remove benefit ────────────────────────────────────────────────────────

export async function removeBenefitAction(
  customerId: string,
  benefitId: string
): Promise<
  | { success: true; data: RemoveBenefitResponse }
  | { success: false; message: string }
> {
  if (!customerId) return { success: false, message: "Customer ID is required" };
  if (!benefitId) return { success: false, message: "Benefit ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.delete(`/manager/customers/${customerId}/benefits/${benefitId}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to remove benefit" };
    }
    
    return { success: true, data: result.data as RemoveBenefitResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
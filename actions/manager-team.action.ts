// actions/manager-team.action.ts

"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  createStaffSchema,
  editStaffSchema,
} from "@/schemas/ManagerTeam.schema";
import type {
  TeamListResponse,
  TeamRolesResponse,
  TeamStaffDetailResponse,
  CreateStaffPayload,
  CreateStaffResponse,
  EditStaffPayload,
  EditStaffResponse,
  DeleteStaffResponse,
} from "@/types/ManagerTeam.type";

// ── GET team list ──────────────────────────────────────────────────────────

export async function getTeamListAction(): Promise<
  | { success: true; data: TeamListResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/team/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load team" };
    }
    
    return { success: true, data: result.data as TeamListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET roles ──────────────────────────────────────────────────────────────

export async function getTeamRolesAction(): Promise<
  | { success: true; data: TeamRolesResponse }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/team/roles/");
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load roles" };
    }
    
    return { success: true, data: result.data as TeamRolesResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET staff details ─────────────────────────────────────────────────────

export async function getStaffDetailsAction(staffId: string): Promise<
  | { success: true; data: TeamStaffDetailResponse }
  | { success: false; message: string }
> {
  if (!staffId) return { success: false, message: "Staff ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get(`/manager/team/${staffId}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to load staff details" };
    }
    
    return { success: true, data: result.data as TeamStaffDetailResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Create staff ──────────────────────────────────────────────────────────

export async function createStaffAction(raw: unknown): Promise<
  | { success: true; data: CreateStaffResponse }
  | { success: false; message: string }
> {
  const parsed = createStaffSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: CreateStaffPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/team/", body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to create staff" };
    }
    
    return { success: true, data: result.data as CreateStaffResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Edit staff ────────────────────────────────────────────────────────────

export async function editStaffAction(
  staffId: string,
  raw: unknown
): Promise<
  | { success: true; data: EditStaffResponse }
  | { success: false; message: string }
> {
  if (!staffId) return { success: false, message: "Staff ID is required" };

  const parsed = editStaffSchema.safeParse(raw);
  if (!parsed.success) {
    return { 
      success: false, 
      message: parsed.error.issues[0]?.message ?? "Invalid input" 
    };
  }

  const body: EditStaffPayload = parsed.data;

  try {
    const api = await getServerApi();
    const response = await api.patch(`/manager/team/${staffId}/`, body);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to edit staff" };
    }
    
    return { success: true, data: result.data as EditStaffResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── Delete staff ──────────────────────────────────────────────────────────

export async function deleteStaffAction(staffId: string): Promise<
  | { success: true; data: DeleteStaffResponse }
  | { success: false; message: string }
> {
  if (!staffId) return { success: false, message: "Staff ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.delete(`/manager/team/${staffId}/`);
    const result = handleActionResponse(response.data);
    
    if (!result.success) {
      return { success: false, message: result.message ?? "Failed to delete staff" };
    }
    
    return { success: true, data: result.data as DeleteStaffResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
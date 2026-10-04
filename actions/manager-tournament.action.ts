"use server";

import { handleApiError, handleActionResponse } from "@/lib/errors";
import { getServerApi } from "@/lib/server-api";
import {
  tournamentsQuerySchema,
  createTournamentSchema,
  updateTournamentSchema,
  createTournamentTeamSchema,
  updateTournamentTeamSchema,
  assignTournamentPlayerSchema,
  searchTournamentPlayersSchema,
} from "@/app/dashboard/tournaments/lib/tournamment.schema";
import type {
  TournamentsListResponse,
  TournamentsQuery,
  TournamentStats,
  TournamentAPI,
  CreateTournamentPayload,
  CreateTournamentResponse,
  UpdateTournamentResponse,
  DeleteTournamentResponse,
  TournamentDetailsResponse,
  TournamentTeamsResponse,
  TournamentTeamResponse,
  TournamentTeamMutationResponse,
  TournamentTeamDeleteResponse,
  TournamentSlotMutationResponse,
  TournamentPlayerSearchResponse,
  MatchesResponse,
  GroupAssignmentRequest,
  GroupAssignmentResponse,
  GenerateMatchesRequest,
  GenerateMatchesResponse,
  UpdateMatchRequest,
  UpdateMatchResponse,
} from "@/app/dashboard/tournaments/lib/tournament.types";

function validationMessage(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Invalid input";
}

function failureMessage(error: unknown) {
  return handleApiError(error).message;
}

export async function getTournamentDetailsAction(tournamentId: string) {
  if (!tournamentId) return { success: false as const, message: "Tournament ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get<TournamentDetailsResponse>(`/manager/tournaments/${tournamentId}/`);
    const tournament = response.data;
    console.log("the respone:", response)
    if (!tournament) return { success: false as const, message: "Tournament not found" };
    return { success: true as const, data: tournament };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function getTournamentTeamsAction(tournamentId: string) {
  if (!tournamentId) return { success: false as const, message: "Tournament ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get<TournamentTeamsResponse>(`/manager/tournaments/${tournamentId}/teams/`);
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function createTournamentTeamAction(tournamentId: string, raw: unknown) {
  const parsed = createTournamentTeamSchema.safeParse(raw);
  if (!parsed.success) return { success: false as const, message: validationMessage(parsed.error) };

  try {
    const api = await getServerApi();
    const response = await api.post<TournamentTeamMutationResponse>(
      `/manager/tournaments/${tournamentId}/teams/`,
      parsed.data
    );
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function updateTournamentTeamAction(teamId: string, raw: unknown) {
  if (!teamId) return { success: false as const, message: "Team ID is required" };
  const parsed = updateTournamentTeamSchema.safeParse(raw);
  if (!parsed.success) return { success: false as const, message: validationMessage(parsed.error) };

  try {
    const api = await getServerApi();
    const response = await api.patch<TournamentTeamMutationResponse>(
      `/manager/tournaments/teams/${teamId}/`,
      parsed.data
    );
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function deleteTournamentTeamAction(teamId: string) {
  if (!teamId) return { success: false as const, message: "Team ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.delete<TournamentTeamDeleteResponse>(`/manager/tournaments/teams/${teamId}/`);
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function getTournamentTeamDetailsAction(teamId: string) {
  if (!teamId) return { success: false as const, message: "Team ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get<TournamentTeamResponse>(`/manager/tournaments/teams/${teamId}/`);
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function assignTournamentPlayerAction(teamId: string, slotNumber: number, raw: unknown) {
  const parsed = assignTournamentPlayerSchema.safeParse(raw);
  if (!parsed.success) return { success: false as const, message: validationMessage(parsed.error) };

  try {
    const api = await getServerApi();
    const response = await api.post<TournamentSlotMutationResponse>(
      `/manager/tournaments/teams/${teamId}/slots/${slotNumber}/assign/`,
      parsed.data
    );
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function clearTournamentPlayerSlotAction(teamId: string, slotNumber: number) {
  try {
    const api = await getServerApi();
    const response = await api.post<TournamentSlotMutationResponse>(
      `/manager/tournaments/teams/${teamId}/slots/${slotNumber}/clear/`
    );
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function searchTournamentPlayersAction(raw: unknown) {
  const parsed = searchTournamentPlayersSchema.safeParse(raw);
  if (!parsed.success) return { success: false as const, message: validationMessage(parsed.error) };

  try {
    const api = await getServerApi();
    const response = await api.get<TournamentPlayerSearchResponse>("/manager/players/search/", {
      params: parsed.data,
    });
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function getTournamentMatchesAction(tournamentId: string) {
  if (!tournamentId) return { success: false as const, message: "Tournament ID is required" };

  try {
    const api = await getServerApi();
    const response = await api.get<MatchesResponse>(`/manager/tournaments/${tournamentId}/matches/`);
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function assignTournamentGroupsAction(tournamentId: string, teamsPerGroup: number) {
  if (!tournamentId) return { success: false as const, message: "Tournament ID is required" };
  if (!Number.isFinite(teamsPerGroup) || teamsPerGroup <= 0) {
    return { success: false as const, message: "Teams per group must be greater than zero" };
  }

  try {
    const api = await getServerApi();
    const payload: GroupAssignmentRequest = {
      teams_per_group: teamsPerGroup,
      clear_existing: true,
    };
    const response = await api.post<GroupAssignmentResponse>(
      `/manager/tournaments/${tournamentId}/groups/assign/`,
      payload,
    );
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function generateTournamentMatchesAction(tournamentId: string) {
  if (!tournamentId) return { success: false as const, message: "Tournament ID is required" };

  try {
    const api = await getServerApi();
    const payload: GenerateMatchesRequest = { clear_existing: true };
    const response = await api.post<GenerateMatchesResponse>(
      `/manager/tournaments/${tournamentId}/matches/generate/`,
      payload,
    );
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

export async function updateTournamentMatchAction(matchId: string, raw: unknown) {
  if (!matchId) return { success: false as const, message: "Match ID is required" };
  const payload = raw && typeof raw === "object" ? (raw as UpdateMatchRequest) : {};
  try {
    const api = await getServerApi();
    const response = await api.patch<UpdateMatchResponse>(`/manager/tournaments/matches/${matchId}/`, payload);
    return { success: true as const, data: response.data };
  } catch (error) {
    return { success: false as const, message: failureMessage(error) };
  }
}

// ── GET list of tournaments ────────────────────────────────────────────────

export async function getTournamentsAction(rawParams: unknown): Promise<
  | { success: true; data: TournamentsListResponse }
  | { success: false; message: string }
> {
  const parseResult = tournamentsQuerySchema.safeParse(rawParams);
  const params: TournamentsQuery = parseResult.success ? parseResult.data : {};

  try {
    const api = await getServerApi();
    const response = await api.get("/manager/tournaments/", { params });
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load tournaments",
      };
    }

    return { success: true, data: response.data as TournamentsListResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── GET stats ──────────────────────────────────────────────────────────────

export async function getTournamentStatsAction(): Promise<
  | { success: true; data: TournamentStats }
  | { success: false; message: string }
> {
  try {
    const api = await getServerApi();
    const response = await api.get("/manager/tournaments/stats/");
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to load stats",
      };
    }

    return { success: true, data: response.data as TournamentStats };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── CREATE ─────────────────────────────────────────────────────────────────

export async function createTournamentAction(raw: unknown): Promise<
  | { success: true; data: CreateTournamentResponse }
  | { success: false; message: string }
> {
  const parsed = createTournamentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;

  const payload: CreateTournamentPayload = {
    name: data.name,
    format: data.format,
    skill_category: data.skill_category,
    team_type: data.team_type,
    number_of_teams: data.number_of_teams,
    currency: data.currency,
    entry_fee_per_player: data.entry_fee_per_player.toFixed(2),
    short_description: data.short_description,
    rules: data.rules,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
  };

  try {
    const api = await getServerApi();
    const response = await api.post("/manager/tournaments/create/", payload);
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to create tournament",
      };
    }

    return { success: true, data: response.data as CreateTournamentResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── UPDATE ─────────────────────────────────────────────────────────────────

export async function updateTournamentAction(
  tournamentId: string,
  raw: unknown
): Promise<
  | { success: true; data: UpdateTournamentResponse }
  | { success: false; message: string }
> {
  if (!tournamentId) {
    return { success: false, message: "Tournament ID is required" };
  }

  const parsed = updateTournamentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;

  const payload: CreateTournamentPayload = {
    name: data.name,
    format: data.format,
    skill_category: data.skill_category,
    team_type: data.team_type,
    number_of_teams: data.number_of_teams,
    currency: data.currency,
    entry_fee_per_player: data.entry_fee_per_player.toFixed(2),
    short_description: data.short_description,
    rules: data.rules,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
  };

  try {
    const api = await getServerApi();
    const response = await api.patch(
      `/manager/tournaments/${tournamentId}/update/`,
      payload
    );
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to update tournament",
      };
    }

    return { success: true, data: response.data as UpdateTournamentResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────

export async function deleteTournamentAction(tournamentId: string): Promise<
  | { success: true; data: DeleteTournamentResponse }
  | { success: false; message: string }
> {
  if (!tournamentId) {
    return { success: false, message: "Tournament ID is required" };
  }

  try {
    const api = await getServerApi();
    const response = await api.delete(
      `/manager/tournaments/${tournamentId}/delete/`
    );
    const result = handleActionResponse(response.data);

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to delete tournament",
      };
    }

    return { success: true, data: response.data as DeleteTournamentResponse };
  } catch (error) {
    const err = handleApiError(error);
    return { success: false, message: err.message };
  }
}
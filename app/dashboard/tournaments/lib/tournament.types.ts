// app/dashboard/tournaments/lib/types.ts

import { z } from "zod";

// ── Enums (must match API values exactly) ──
export const tournamentStatusEnum = z.enum([
  "upcoming",
  "ongoing",
  "completed",
]);

export const tournamentFormatEnum = z.enum(["knockout", "group_stage"]);

export const skillCategoryEnum = z.enum([
  "low_beginner",
  "medium_beginner",
  "high_beginner",
  "low_intermediate",
  "medium_intermediate",
  "high_intermediate",
  "low_advanced",
  "medium_advanced",
  "high_advanced",
]);

export const teamTypeEnum = z.enum(["5v5", "6v6", "7v7", "8v8", "11v11"]);

export const currencyEnum = z.enum(["USD", "EUR", "GBP", "BDT"]);

export const teamCountOptions = [4, 8, 16, 32] as const;

// ── API Tournament shape (from GET list / create / update) ──
export interface TournamentAPI {
  id: string;
  name: string;
  format: "knockout" | "group_stage";
  format_display: string;
  skill_category:
    | "low_beginner"
    | "medium_beginner"
    | "high_beginner"
    | "low_intermediate"
    | "medium_intermediate"
    | "high_intermediate"
    | "low_advanced"
    | "medium_advanced"
    | "high_advanced";
  skill_category_display: string;
  team_type: string;
  team_type_display: string;
  number_of_teams: number;
  currency: string;
  entry_fee_per_player: string;
  entry_fee_per_team: string;
  players_per_team: number;
  total_capacity: number;
  total_slots: number;
  short_description: string;
  rules: string;
  status: "upcoming" | "ongoing" | "completed";
  status_display: string;
  start_date: string | null;
  end_date: string | null;
  banner: string | null;
  registered_teams_count: number;
  is_full: boolean;
  created_at: string;
  updated_at: string;
}

export interface TournamentDetailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TournamentAPI[];
}

export interface TournamentTeamSlot {
  id: string;
  slot_number: number;
  user: string | null;
  user_email: string | null;
  user_full_name: string | null;
  player_name: string;
  player_phone: string;
  display_player_name: string;
  is_captain: boolean;
  is_paid: boolean;
  status: "empty" | "filled" | string;
  created_at: string;
  updated_at: string;
}

export interface TournamentTeam {
  id: string;
  tournament: string;
  name: string;
  seed: number;
  group: string | null;
  game_played: number;
  win: number;
  draw: number;
  lose: number;
  points: number;
  captain: string | null;
  captain_name: string | null;
  captain_email: string | null;
  status: string;
  total_slots: number;
  filled_slots_count: number;
  is_roster_complete: boolean;
  slots: TournamentTeamSlot[];
  created_at: string;
  updated_at: string;
}

export interface TournamentTeamsResponse {
  success: boolean;
  teams: TournamentTeam[];
}

export interface TournamentTeamResponse {
  success: boolean;
  message?: string;
  team: TournamentTeam;
}

export interface TournamentTeamMutationResponse {
  success: boolean;
  message: string;
  team: TournamentTeam;
}

export interface TournamentTeamDeleteResponse {
  success: boolean;
  message: string;
}

export interface TournamentSlotMutationResponse {
  success: boolean;
  message: string;
  slot: TournamentTeamSlot;
}

export interface TournamentPlayerSearchResult {
  user_id: string;
  name: string;
  email: string;
  username: string;
  code: string | null;
  preferred_position: string;
  is_customer: boolean;
  is_blocked: boolean;
}

export interface TournamentPlayerSearchResponse {
  success: boolean;
  results: TournamentPlayerSearchResult[];
  count: number;
}

export type MatchStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

export interface TournamentMatch {
  id: string;
  tournament: string;
  home_team: string;
  home_team_name: string;
  away_team: string;
  away_team_name: string;
  group: string;
  round_number: number;
  match_time: string | null;
  court: string | null;
  court_name: string | null;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  status_display: string;
  winner: string | null;
  winner_name: string | null;
  is_draw: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchResponse {
  success: boolean;
  message?: string;
  match: TournamentMatch;
}

export interface MatchesResponse {
  success: boolean;
  total_matches: number;
  matches: TournamentMatch[];
}

export interface GroupAssignmentRequest {
  teams_per_group: number;
  clear_existing: true;
}

export interface TournamentGroupAssignment {
  id: string;
  name: string;
  seed: number;
}

export interface GroupAssignmentResponse {
  success: boolean;
  message: string;
  groups: Record<string, TournamentGroupAssignment[]>;
}

export interface GenerateMatchesRequest {
  clear_existing: true;
}

export interface GenerateMatchesSummary {
  tournament_id: string;
  teams_count: number;
  groups_count: number;
  matches_created_count: number;
  groups: Record<string, string[]>;
}

export interface GenerateMatchesResponse {
  success: boolean;
  message: string;
  summary: GenerateMatchesSummary;
  matches: TournamentMatch[];
}

export interface UpdateMatchRequest {
  match_time?: string | null;
  court_id?: string | null;
  home_score?: number | null;
  away_score?: number | null;
  status?: MatchStatus;
  notes?: string | null;
}

export interface UpdateMatchResponse {
  success: boolean;
  message: string;
  match?: TournamentMatch;
}

export interface TournamentsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TournamentAPI[];
}

export interface TournamentsQuery {
  status?: "upcoming" | "ongoing" | "completed";
  skill_category?: string;
  search?: string;
  page?: number;
}

export interface TournamentStats {
  success: boolean;
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
}

export interface CreateTournamentPayload {
  name: string;
  format: "knockout" | "group_stage";
  skill_category: string;
  team_type: string;
  number_of_teams: number;
  currency: string;
  entry_fee_per_player: string;
  short_description: string;
  rules: string;
  start_date?: string | null;
  end_date?: string | null;
}

export interface CreateTournamentResponse {
  success: boolean;
  message: string;
  tournament_id: string;
  tournament: TournamentAPI;
}

export interface UpdateTournamentResponse {
  success: boolean;
  message: string;
  tournament: TournamentAPI;
}

export interface DeleteTournamentResponse {
  success: boolean;
  message: string;
}

// ── Form schema (client-side) ──

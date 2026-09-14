// app/dashboard/tournaments/lib/types.ts

import { z } from "zod";

export const tournamentStatusEnum = z.enum(["upcoming", "ongoing", "completed"]);

// ── NEW: 9-level skill scale ──
export const tournamentCategoryEnum = z.enum([
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

// ── NEW: group vs knockout mode ──
export const tournamentFormatEnum = z.enum(["group", "knockout"]);

// ── NEW: currency ──
export const currencyEnum = z.enum(["USD", "EUR", "GBP", "BDT"]);

export const teamTypeEnum = z.enum(["5v5", "6v6", "7v7", "8v8", "11v11"]);

export const tournamentSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortDescription: z.string(),
  rulesAndRegulations: z.string(),
  category: tournamentCategoryEnum,
  teamType: teamTypeEnum,
  teamCount: z.number(),
  capacity: z.number(),
  entryFeePerPlayer: z.number(),      // ← was entryFeePerTeam
  currency: currencyEnum,             // ← NEW
  format: tournamentFormatEnum,       // ← NEW (group | knockout)
  status: tournamentStatusEnum,
  createdAt: z.string(),
});

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  flag: z.string(),
});

export const matchStatusEnum = z.enum(["unscheduled", "scheduled", "completed"]);

export const matchSchema = z.object({
  id: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  status: matchStatusEnum,
  scheduledAt: z.string().nullable(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
  courtName: z.string().nullable().optional(),
});

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  tournamentId: z.string(),
  teamIds: z.array(z.string()),
  matches: z.array(matchSchema),
});

export const knockoutMatchSchema = z.object({
  id: z.string(),
  round: z.number(),
  position: z.number(),
  homeTeamId: z.string().nullable(),
  awayTeamId: z.string().nullable(),
  status: matchStatusEnum,
  scheduledAt: z.string().nullable(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
  courtName: z.string().nullable().optional(),
});

export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string().optional(),
});

export const teamCountOptions = [4, 8, 16, 32] as const;

// ── Shared form schema for create + edit ──
export const tournamentFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    shortDescription: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Keep it under 200 characters"),
    rulesAndRegulations: z.string().min(10, "Please add rules and regulations"),
    format: tournamentFormatEnum,
    category: tournamentCategoryEnum,
    teamType: teamTypeEnum,
    teamCount: z.coerce.number(),
    entryFeePerPlayer: z.coerce.number().min(0, "Entry fee can't be negative"),
    currency: currencyEnum.default("USD"),
  })
  .refine(
    (data) => (teamCountOptions as readonly number[]).includes(data.teamCount),
    { message: "Select a valid number of teams", path: ["teamCount"] }
  )
  .refine((data) => data.format !== "group" || data.teamCount >= 8, {
    message: "Group stage requires at least 8 teams",
    path: ["format"],
  });

export type Tournament = z.infer<typeof tournamentSchema>;
export type TournamentStatus = z.infer<typeof tournamentStatusEnum>;
export type TournamentCategory = z.infer<typeof tournamentCategoryEnum>;
export type TournamentFormat = z.infer<typeof tournamentFormatEnum>;
export type Currency = z.infer<typeof currencyEnum>;
export type TeamType = z.infer<typeof teamTypeEnum>;
export type Team = z.infer<typeof teamSchema>;
export type MatchStatus = z.infer<typeof matchStatusEnum>;
export type Match = z.infer<typeof matchSchema>;
export type Group = z.infer<typeof groupSchema>;
export type KnockoutMatch = z.infer<typeof knockoutMatchSchema>;
export type Player = z.infer<typeof playerSchema>;

export type TournamentFormInput = z.infer<typeof tournamentFormSchema>;
export type CreateTournamentInput = TournamentFormInput;
export type UpdateTournamentInput = TournamentFormInput;
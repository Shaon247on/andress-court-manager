import { z } from "zod";

export const tournamentStatusEnum = z.enum(["upcoming", "ongoing", "completed"]);
export const tournamentCategoryEnum = z.enum([
  "open",
  "advanced",
  "intermediate",
  "beginners",
]);
export const teamTypeEnum = z.enum(["5v5", "6v6", "7v7", "8v8", "11v11"]);

export const tournamentSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortDescription: z.string(),
  category: tournamentCategoryEnum,
  teamType: teamTypeEnum,
  teamCount: z.number(),
  capacity: z.number(),
  entryFeePerTeam: z.number(),
  prizeMoney: z.number(),
  hasGroupStage: z.boolean(),
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
  scheduledAt: z.string().nullable(), // ISO datetime, e.g. "2026-09-15T18:00:00"
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
});

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(), // "Group A"
  tournamentId: z.string(),
  teamIds: z.array(z.string()),
  matches: z.array(matchSchema),
});



export const knockoutMatchSchema = z.object({
  id: z.string(),
  round: z.number(), // 0 = earliest round
  position: z.number(), // index within the round, used to keep bracket order stable
  homeTeamId: z.string().nullable(), // null until the previous round's winner is decided
  awayTeamId: z.string().nullable(),
  status: matchStatusEnum,
  scheduledAt: z.string().nullable(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
});


export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string().optional(),
});

export const teamCountOptions = [4, 8, 16, 32] as const;

export const additionalInfoItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const createTournamentSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    shortDescription: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Keep it under 200 characters"),
    prizeMoney: z.coerce.number().min(0, "Prize money can't be negative"),
    rulesAndRegulations: z.string().min(10, "Please add rules and regulations"),
    teamType: teamTypeEnum,
    category: tournamentCategoryEnum,
    teamCount: z.coerce.number(),
    entryFeePerTeam: z.coerce.number().min(0, "Entry fee can't be negative"),
    hasGroupStage: z.boolean(),
    additionalInfo: z.array(additionalInfoItemSchema).default([]),
  })
  .refine((data) => (teamCountOptions as readonly number[]).includes(data.teamCount), {
    message: "Select a valid number of teams",
    path: ["teamCount"],
  })
  .refine((data) => !data.hasGroupStage || data.teamCount >= 8, {
    message: "Group stage requires at least 8 teams",
    path: ["hasGroupStage"],
  });




export type Tournament = z.infer<typeof tournamentSchema>;
export type TournamentStatus = z.infer<typeof tournamentStatusEnum>;
export type TournamentCategory = z.infer<typeof tournamentCategoryEnum>;
export type TeamType = z.infer<typeof teamTypeEnum>;
export type Team = z.infer<typeof teamSchema>;
export type MatchStatus = z.infer<typeof matchStatusEnum>;
export type Match = z.infer<typeof matchSchema>;
export type Group = z.infer<typeof groupSchema>;
export type KnockoutMatch = z.infer<typeof knockoutMatchSchema>;
export type Player = z.infer<typeof playerSchema>;
export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
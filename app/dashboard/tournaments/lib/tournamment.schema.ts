import z from "zod";
import { currencyEnum, skillCategoryEnum, teamCountOptions, teamTypeEnum, tournamentFormatEnum } from "./tournament.types";

export const tournamentFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    format: tournamentFormatEnum,
    skill_category: skillCategoryEnum,
    team_type: teamTypeEnum,
    number_of_teams: z.coerce.number(),
    currency: currencyEnum.default("USD"),
    entry_fee_per_player: z.coerce
      .number()
      .min(0, "Entry fee can't be negative"),
    short_description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Keep it under 200 characters"),
    rules: z.string().min(10, "Please add rules and regulations"),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
  })
  .refine(
    (data) => (teamCountOptions as readonly number[]).includes(data.number_of_teams),
    { message: "Select a valid number of teams", path: ["number_of_teams"] }
  )
  .refine((data) => data.format !== "group_stage" || data.number_of_teams >= 8, {
    message: "Group stage requires at least 8 teams",
    path: ["format"],
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    { message: "End date must be after start date", path: ["end_date"] }
  );

  export const tournamentsQuerySchema = z.object({
  status: z.enum(["upcoming", "ongoing", "completed"]).optional(),
  skill_category: skillCategoryEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
});

export const createTournamentSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100),
    format: tournamentFormatEnum,
    skill_category: skillCategoryEnum,
    team_type: teamTypeEnum,
    number_of_teams: z.coerce.number(),
    currency: currencyEnum.default("USD"),
    entry_fee_per_player: z.coerce.number().min(0),
    short_description: z.string().min(10).max(200),
    rules: z.string().min(10),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
  })
  .refine(
    (data) => (teamCountOptions as readonly number[]).includes(data.number_of_teams),
    { message: "Select a valid number of teams", path: ["number_of_teams"] }
  )
  .refine((data) => data.format !== "group_stage" || data.number_of_teams >= 8, {
    message: "Group stage requires at least 8 teams",
    path: ["format"],
  });
  

export const updateTournamentSchema = createTournamentSchema;

export const createTournamentTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100),
  seed: z.coerce.number().int().positive(),
});

export const updateTournamentTeamSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    seed: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => data.name !== undefined || data.seed !== undefined, {
    message: "Provide a team name or seed to update",
  });

export const assignTournamentPlayerSchema = z.object({
  user_id: z.string().min(1, "Player is required"),
  is_captain: z.boolean(),
  is_paid: z.boolean(),
});

export const searchTournamentPlayersSchema = z.object({
  search: z.string().trim().min(1, "Search text is required"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;


export type TournamentFormInput = z.infer<typeof tournamentFormSchema>;
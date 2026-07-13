import { z } from "zod";

export const courtsQuerySchema = z.object({
  search: z.string().optional(),
  court_type: z.enum(["indoor", "outdoor", "both"]).optional(),
  status: z.enum(["active", "under_maintenance", "closed"]).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const createCourtSchema = z.object({
  name: z.string().min(1, "Court name is required"),
  description: z.string().optional(),
  court_type: z.enum(["indoor", "outdoor", "both"]),
  game_formats: z
    .array(z.string())
    .min(1, "At least one game format is required"),
  price_per_hour: z.string().min(1, "Price per hour is required"),
});

export const updateCourtSchema = z.object({
  name: z.string().min(1, "Court name is required"),
  description: z.string().optional(),
  court_type: z.enum(["indoor", "outdoor", "both"]),
  game_formats: z
    .array(z.string())
    .min(1, "At least one game format is required"),
  price_per_hour: z.string().min(1, "Price per hour is required"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["active", "under_maintenance", "closed"]),
});

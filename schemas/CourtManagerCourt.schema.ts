import { z } from "zod";

export const courtsQuerySchema = z.object({
  search: z.string().optional(),
  court_type: z.enum(["indoor", "outdoor", "both"]).optional(),
  status: z.enum(["active", "under_maintenance", "closed"]).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const createCourtSchema = z.object({
  name: z.string().min(1, "Court name is required"),
  court_type: z.enum(["indoor", "outdoor", "both"]),
  game_formats: z
    .array(z.string())
    .min(1, "At least one game format is required"),
  price_per_hour: z.string().min(1, "Price per hour is required"),
});

export const updateCourtSchema = z.object({
  name: z.string().min(1, "Court name is required"),
  court_type: z.enum(["indoor", "outdoor", "both"]),
  game_formats: z
    .array(z.string())
    .min(1, "At least one game format is required"),
  price_per_hour: z.string().min(1, "Price per hour is required"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["active", "under_maintenance", "closed"]),
});

export const mergedCourtsQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(["upcoming", "merged", "completed", "cancelled", "active"]).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const createMergedCourtSchema = z.object({
  court_ids: z.array(z.string()).min(2, "At least 2 courts are required to merge"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  price: z.number().min(0, "Price must be at least 0"),
});

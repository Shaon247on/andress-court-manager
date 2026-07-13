import { z } from "zod";

export const customersQuerySchema = z.object({
  search: z.string().optional(),
  filter: z.enum(["all", "benefits"]).default("all"),
  page: z.coerce.number().min(1).optional(),
});

export const createCustomerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  username: z.string().optional(),
});

export const editCustomerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  username: z.string().optional(),
});

export const addBenefitSchema = z.object({
  benefit_type: z.enum(["percentage", "fixed"]),
  value: z.string().min(1, "Value is required"),
  apply_on: z.enum(["split", "full", "all"]),
  usage_per_day: z.number().min(0),
  usage_per_month: z.number().min(0),
});

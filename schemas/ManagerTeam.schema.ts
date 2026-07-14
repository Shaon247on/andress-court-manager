import { z } from 'zod';

export const permissionsSchema = z.object({
  schedule: z.boolean().default(false),
  customers: z.boolean().default(false),
  bookings: z.boolean().default(false),
  tournaments: z.boolean().default(false),
  revenue: z.boolean().default(false),
  support: z.boolean().default(false),
  court_management: z.boolean().default(false),
});

export const createStaffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role_name: z.string().min(1, 'Role is required'),
  permissions: permissionsSchema,
});

export const editStaffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role_name: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'pending', 'inactive']),
  permissions: permissionsSchema,
});
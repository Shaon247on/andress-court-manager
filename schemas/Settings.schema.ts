// schemas/Settings.schema.ts

import { z } from 'zod';

export const dayScheduleSchema = z.object({
  is_open: z.boolean(),
  open: z.string().optional(),
  close: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const updateScheduleSchema = z.object({
  monday: dayScheduleSchema.optional(),
  tuesday: dayScheduleSchema.optional(),
  wednesday: dayScheduleSchema.optional(),
  thursday: dayScheduleSchema.optional(),
  friday: dayScheduleSchema.optional(),
  saturday: dayScheduleSchema.optional(),
  sunday: dayScheduleSchema.optional(),
  cancellation_hours: z.number().optional(),
});

export const updateCancellationSchema = z.object({
  cancellation_hours: z.number().min(0, 'Cancellation hours must be at least 0'),
});

// ── Venue Settings Schema ──

export const updateVenueSettingsSchema = z.object({
  club_name: z.string().min(1, 'Club name is required').optional(),
  street_address: z.string().min(1, 'Street address is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type ProfileFormValues = z.infer<typeof profileUpdateSchema>;
export type UpdateVenueSettingsFormValues = z.infer<typeof updateVenueSettingsSchema>;
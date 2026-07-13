// schemas/ManagerBooking.schema.ts

import { z } from 'zod';

export const participantSchema = z.object({
  team: z.enum(['a', 'b']),
  position_role: z.string().optional(),
  is_game_owner: z.boolean(),
  is_paid: z.boolean(),
  app_user_id: z.string().min(1, 'User ID is required'),
});

export const createBookingSchema = z.object({
  court_id: z.string().min(1, 'Court is required'),
  booking_type: z.enum(['regular', 'lesson', 'event']),
  date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  payment_type: z.enum(['single', 'split']),
  game_format: z.string().min(1, 'Game format is required'),
  repeat_type: z.enum(['none', 'weekly', 'monthly']).default('none'),
  visibility: z.enum(['private', 'public']).default('private'),
  participants: z.array(participantSchema).min(1, 'At least one participant is required'),
});

export const updateBookingSchema = z.object({
  court_id: z.string().min(1, 'Court is required'),
  booking_type: z.enum(['regular', 'lesson', 'event']),
  date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  payment_type: z.enum(['single', 'split']),
  game_format: z.string().min(1, 'Game format is required'),
  repeat_type: z.enum(['none', 'weekly', 'monthly']).default('none'),
  visibility: z.enum(['private', 'public']).default('private'),
  participants: z.array(participantSchema).min(1, 'At least one participant is required'),
});

export const searchUsersSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.number().default(20),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
export type UpdateBookingFormValues = z.infer<typeof updateBookingSchema>;
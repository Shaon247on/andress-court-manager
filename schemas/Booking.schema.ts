import { z } from 'zod';

export const bookingsTabQuerySchema = z.object({
  date: z.string().optional(),
  type: z.enum(['all', 'bookings', 'lessons', 'events']).default('all'),
  page: z.coerce.number().min(1).optional(),
});
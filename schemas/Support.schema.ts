import { z } from 'zod';

export const supportQuerySchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved']).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject is too long'),
  message: z.string().min(1, 'Message is required'),
  category: z.string().default('other'),
});

export const supportReplySchema = z.object({
  message: z.string().min(1, 'Message is required'),
});
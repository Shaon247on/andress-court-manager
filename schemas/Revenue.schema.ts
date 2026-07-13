import { z } from 'zod';

export const withdrawSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
});

export const addPayoutMethodSchema = z.object({
  account_type: z.string().min(1, 'Account type is required'),
  account_number: z.string().min(1, 'Account number is required'),
  account_holder: z.string().min(1, 'Account holder name is required'),
});
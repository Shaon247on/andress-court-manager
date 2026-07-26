import { z } from 'zod';

const timeStringSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)');

const dayScheduleSchema = z.object({
  is_open: z.boolean(),
  open: timeStringSchema,
  close: timeStringSchema,
});

export const registrationScheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

// The plain object, kept separate from the cross-field .refine() below so we
// can still reach individual field schemas via `.shape.<field>` for
// on-blur validation. `registrationPayloadSchema` (exported further down)
// behaves exactly as before — nothing about the server action changes.
export const registrationPayloadObjectSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  club_name: z.string().min(1, 'Club name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[0-9\s\-().]{7,20}$/, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
  website: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
      message: 'Enter a valid URL starting with http:// or https://',
    }),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  street_address: z.string().min(1, 'Street address is required'),
  state_province: z.string().min(1, 'State/Province is required'),
  zip_postal_code: z.string().min(1, 'ZIP/Postal code is required'),
  latitude: z.number(),
  longitude: z.number(),
  agreed_to_terms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
  schedule: registrationScheduleSchema,
  cancellation_hours: z.number().min(0, 'Cancellation hours must be at least 0'),
});

export const registrationPayloadSchema = registrationPayloadObjectSchema.refine(
  (data) => data.password === data.confirm_password,
  { message: "Passwords don't match", path: ['confirm_password'] }
);

export type RegistrationFormValues = z.infer<typeof registrationPayloadSchema>;

// ── Field-level validators, keyed by the camelCase names used in the form's
// local state, so Step 1/2 inputs can validate on blur against the exact
// same rules the server action ultimately enforces. ──
export const registrationFieldValidators = {
  firstName: registrationPayloadObjectSchema.shape.first_name,
  lastName: registrationPayloadObjectSchema.shape.last_name,
  clubName: registrationPayloadObjectSchema.shape.club_name,
  email: registrationPayloadObjectSchema.shape.email,
  phone: registrationPayloadObjectSchema.shape.phone_number,
  password: registrationPayloadObjectSchema.shape.password,
  confirmPassword: registrationPayloadObjectSchema.shape.confirm_password,
  website: registrationPayloadObjectSchema.shape.website,
  country: registrationPayloadObjectSchema.shape.country,
  city: registrationPayloadObjectSchema.shape.city,
  street: registrationPayloadObjectSchema.shape.street_address,
  state: registrationPayloadObjectSchema.shape.state_province,
  zip: registrationPayloadObjectSchema.shape.zip_postal_code,
} as const;

export type RegistrationField = keyof typeof registrationFieldValidators;

export { timeStringSchema };
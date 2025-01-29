import { z } from 'zod';

export const registerModel = z.object({
  email: z.string().email()
  .transform(val => val.toLowerCase().trim()),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['ADMIN', 'AGENT']).default('AGENT')
});

export const loginModel = z.object({
  email: z.string().email()
  .transform(val => val.toLowerCase().trim()),
  password: z.string()
});
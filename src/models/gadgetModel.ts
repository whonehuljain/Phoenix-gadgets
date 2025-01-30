import { z } from 'zod';

export const createGadgetModel = z.object({
  name: z.string().min(2).max(255)
});

export const updateGadgetModel = z.object({
  name: z.string().min(2).max(255).optional(),
  status: z.enum(['AVAILABLE', 'DEPLOYED', 'DESTROYED', 'DECOMMISSIONED']).optional()
});



export const selfDestructModel = z.object({
    confirmationCode: z.string().length(8).optional()
  });


export const filterGadgetsByStatusModel = z.object({
  status: z.string()
  .optional()
  .transform((value) => value?.toUpperCase())
  .refine((value) => value ? ['AVAILABLE', 'DEPLOYED', 'DESTROYED', 'DECOMMISSIONED'].includes(value) : true, {
    message: 'invalid status',
  }),
});
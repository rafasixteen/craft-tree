import { z } from 'zod';
import { nameSchema } from '@/domain/shared';

export const createItemFormSchema = z.object({
	name: nameSchema,
	tagNames: z.array(z.string()).default([]),
});

export type CreateItemFormValues = z.infer<typeof createItemFormSchema>;

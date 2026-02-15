import { z } from 'zod';
import { nameSchema } from '@/domain/shared';

export const updateItemFormSchema = z.object({
	name: nameSchema,
	tagNames: z.array(z.string()).default([]),
});

export type UpdateItemFormValues = z.infer<typeof updateItemFormSchema>;

import { z } from 'zod';
import { nameSchema } from '@/domain/shared';

export const addItemFormSchema = z.object({
	name: nameSchema,
	tagNames: z.array(z.string()).default([]),
});

export type AddItemFormValues = z.infer<typeof addItemFormSchema>;

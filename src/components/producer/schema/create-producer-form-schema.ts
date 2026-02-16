import { z } from 'zod';
import { nameSchema } from '@/domain/shared';

export const createProducerFormSchema = z.object({
	name: nameSchema,
	tagNames: z.array(z.string()).default([]),
});

export type CreateProducerFormValues = z.infer<typeof createProducerFormSchema>;

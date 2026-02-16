import { z } from 'zod';
import { nameSchema } from '@/domain/shared';

export const updateProducerFormSchema = z.object({
	name: nameSchema,
	tagNames: z.array(z.string()).default([]),
});

export type UpdateProducerFormValues = z.infer<typeof updateProducerFormSchema>;

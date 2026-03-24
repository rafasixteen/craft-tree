import z from 'zod';

export const ProducerTagSchema = z.object({
	producerId: z.string(),
	tagId: z.string(),
});

export type ProducerTag = z.infer<typeof ProducerTagSchema>;

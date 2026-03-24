import z from 'zod';

export const ProducerInputSchema = z.object({
	id: z.string(),
	itemId: z.string(),
	producerId: z.string(),
	quantity: z.number(),
});

export type ProducerInput = z.infer<typeof ProducerInputSchema>;

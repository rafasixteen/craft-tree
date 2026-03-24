import z from 'zod';

export const ProducerOutputSchema = z.object({
	id: z.string(),
	itemId: z.string(),
	producerId: z.string(),
	quantity: z.number(),
});

export type ProducerOutput = z.infer<typeof ProducerOutputSchema>;

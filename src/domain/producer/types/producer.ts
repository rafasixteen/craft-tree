import z from 'zod';

export const producerSchema = z.object({
	id: z.string(),
	name: z.string(),
	time: z.number().positive(),
	inventoryId: z.string(),
});

export type Producer = z.infer<typeof producerSchema>;

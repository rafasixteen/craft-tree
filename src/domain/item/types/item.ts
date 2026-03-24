import z from 'zod';

export const ItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	inventoryId: z.string(),
});

export type Item = z.infer<typeof ItemSchema>;

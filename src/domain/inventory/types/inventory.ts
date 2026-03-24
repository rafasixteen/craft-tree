import z from 'zod';

export const InventorySchema = z.object({
	id: z.string(),
	name: z.string(),
	userId: z.string(),
});

export type Inventory = z.infer<typeof InventorySchema>;

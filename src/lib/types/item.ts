import { z } from 'zod';

export const ItemSchema = z.object({
	id: z.uuid('Invalid item uuid'),
	name: z.string().min(1, 'Name is required'),
});

export const CreateItemSchema = ItemSchema.omit({ id: true });

export const UpdateItemSchema = ItemSchema.omit({ id: true });

export const GetItemsQuerySchema = z.object({
	page: z.coerce.number().int().nonnegative().default(0),
});

export type Item = z.infer<typeof ItemSchema>;

export type CreateItemParams = z.infer<typeof CreateItemSchema>;

export type UpdateItemParams = z.infer<typeof UpdateItemSchema>;

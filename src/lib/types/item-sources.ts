import { z } from 'zod';
import { IngredientSchema } from './ingredients';

export const ItemSourceSchema = z.object({
	id: z.uuid('Invalid item source uuid'),
	itemId: z.uuid('Invalid item uuid'),
	type: z.enum(['Gathered', 'Processed']),
	time: z.number().nonnegative(),
	ingredients: IngredientSchema.array().optional(),
});

export const CreateItemSourceSchema = ItemSourceSchema.omit({ id: true });

export const UpdateItemSourceSchema = ItemSourceSchema.omit({ id: true });

export type ItemSource = z.infer<typeof ItemSourceSchema>;

export type CreateItemSourceParams = z.infer<typeof CreateItemSourceSchema>;

export type UpdateItemSourceParams = z.infer<typeof UpdateItemSourceSchema>;

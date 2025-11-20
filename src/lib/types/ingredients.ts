import { z } from 'zod';

export const IngredientSchema = z.object({
	id: z.uuid('Invalid ingredient uuid'),
	itemId: z.uuid('Invalid item uuid'),
	quantity: z.number().positive('Quantity must be positive'),
});

export const IngredientCreateSchema = IngredientSchema.omit({ id: true }).array();

export type Ingredient = z.infer<typeof IngredientSchema>;

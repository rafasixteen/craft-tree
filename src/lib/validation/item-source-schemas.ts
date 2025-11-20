import { z } from 'zod';
import { UuidSchema } from './common-schemas';

export const ItemSourceIdSchema = z.object({
	id: UuidSchema,
});

export const ItemSourceTypeSchema = z.enum(['Gathered', 'Processed']);

export const IngredientsSchema = z.array(
	z.object({
		itemId: UuidSchema,
		quantity: z.number().positive(),
	}),
);

export const CreateItemSourceSchema = z.object({
	itemId: UuidSchema,
	type: ItemSourceTypeSchema,
	time: z.number().nonnegative(),
	ingredients: IngredientsSchema.optional(),
});

export const UpdateItemSourceSchema = z.object({
	itemId: UuidSchema,
	type: ItemSourceTypeSchema,
	time: z.number().nonnegative(),
	ingredients: IngredientsSchema.optional(),
});

export type ItemSourceId = z.infer<typeof ItemSourceIdSchema>;

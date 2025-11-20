import { z } from 'zod';
import { UuidSchema } from './common-schemas';

export const ItemIdSchema = z.object({
	id: UuidSchema,
});

export const CreateItemSchema = z.object({
	name: z.string().min(1, 'Name is required'),
});

export const PatchItemSchema = z.object({
	name: z.string().min(1, 'Name is required'),
});

export const GetItemsQuerySchema = z.object({
	page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
});

export type ItemId = z.infer<typeof ItemIdSchema>;

export type GetItemsQuery = z.infer<typeof GetItemsQuerySchema>;

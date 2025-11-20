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
	page: z.coerce.number().int().nonnegative().default(0),
});

export type ItemId = z.infer<typeof ItemIdSchema>;

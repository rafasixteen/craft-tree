import z from 'zod';

export const ItemTagSchema = z.object({
	itemId: z.string(),
	tagId: z.string(),
});

export type ItemTag = z.infer<typeof ItemTagSchema>;

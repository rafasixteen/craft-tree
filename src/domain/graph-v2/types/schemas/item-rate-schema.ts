import { z } from 'zod';

export const ProductionRateSchema = z.object({
	amount: z.number().nonnegative(),
	per: z.enum(['second', 'minute', 'hour']),
});

export const ItemRateSchema = ProductionRateSchema.extend({
	itemId: z.string(),
});

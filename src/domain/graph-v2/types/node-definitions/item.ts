import { defineNode, ItemRateSchema, ProductionRateSchema } from '@/domain/graph-v2';
import { z } from 'zod';

export const itemNodeDefinition = defineNode({
	outputs: {
		itemRate: ItemRateSchema.nullable(),
	},
	config: {
		itemId: z.string().nullable(),
		rate: ProductionRateSchema,
	},
	executor: (_, config) =>
	{
		const { itemId, rate } = config;

		if (!itemId)
		{
			return {
				itemRate: null,
			};
		}

		return {
			itemRate: {
				...rate,
				itemId: itemId,
			},
		};
	},
});

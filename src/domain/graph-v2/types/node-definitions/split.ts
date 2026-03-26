import { defineNode, ItemRateSchema, ProductionRateSchema } from '@/domain/graph-v2';
import { z } from 'zod';

export const splitNodeDefinition = defineNode({
	inputs: {
		rate: ItemRateSchema,
	},
	outputs: {
		rates: z.array(ItemRateSchema),
	},
	config: {
		productionRates: z.array(ProductionRateSchema),
	},
	executor: (input, config) =>
	{
		return {
			rates: config.productionRates.map((productionRate) => ({
				...productionRate,
				itemId: input.rate.itemId,
			})),
		};
	},
});

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
		productionRates: z.array(ProductionRateSchema).default([{ amount: 1, per: 'second' }]),
	},
	executor: (input, config) =>
	{
		const { rate } = input;
		const { productionRates } = config;

		return {
			rates: productionRates.map((productionRate) => ({
				...productionRate,
				itemId: rate.itemId,
			})),
		};
	},
});

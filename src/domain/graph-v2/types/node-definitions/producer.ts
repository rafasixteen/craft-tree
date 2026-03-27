import { defineNode, ItemRateSchema } from '@/domain/graph-v2';
import { z } from 'zod';

export const producerNodeDefinition = defineNode({
	inputs: {
		rates: z.array(ItemRateSchema),
	},
	outputs: {
		rates: z.array(ItemRateSchema),
	},
	config: {
		itemId: z.string(),
		producerId: z.string(),
		producerCount: z.number().default(1),
	},
	executor: (inputs, config) =>
	{
		return {
			rates: inputs.rates.map((rate) => ({
				...rate,
				amount: rate.amount * config.producerCount,
			})),
		};
	},
});

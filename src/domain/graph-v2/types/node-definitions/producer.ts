import { defineNode, ItemRateSchema } from '@/domain/graph-v2';
import { z } from 'zod';

export const producerNodeDefinition = defineNode({
	inputs: {
		rates: z.array(ItemRateSchema).nullable(),
	},
	outputs: {
		rates: z.array(ItemRateSchema).nullable(),
	},
	config: {
		itemId: z.string().nullable(),
		producerId: z.string().nullable(),
		producerCount: z.number().default(1),
	},
	executor: (inputs, config) =>
	{
		if (!inputs.rates)
		{
			return {
				rates: null,
			};
		}

		return {
			rates: inputs.rates.map((rate) => ({
				...rate,
				amount: rate.amount * config.producerCount,
			})),
		};
	},
});

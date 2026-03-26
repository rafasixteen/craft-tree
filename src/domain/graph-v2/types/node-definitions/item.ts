import { defineNode, ItemRateSchema } from '@/domain/graph-v2';

export const itemNodeDefinition = defineNode({
	outputs: {
		rate: ItemRateSchema,
	},
	config: {
		rate: ItemRateSchema,
	},
	executor: (_, config) =>
	{
		return {
			rate: config.rate,
		};
	},
});

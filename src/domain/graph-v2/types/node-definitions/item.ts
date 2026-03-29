import { defineNode, ItemRateSchema, ProductionRateSchema } from '@/domain/graph-v2';
import { z } from 'zod';

declare module '@/domain/graph-v2/registry'
{
	export interface NodeOutputRegistry
	{
		item: { itemRate: z.infer<typeof ItemRateSchema> | null };
	}
}

export const itemNodeDefinition = defineNode({
	outputs: {
		itemRate: ItemRateSchema.nullable(),
	},
	config: {
		itemId: z.string().nullable(),
		rate: ProductionRateSchema.default({ amount: 1, per: 'second' }),
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

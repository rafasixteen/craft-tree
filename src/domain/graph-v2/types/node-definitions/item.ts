import { defineNode } from '@/domain/graph-v2';
import { ItemRate, ProductionRate, TimeUnit } from '@/domain/graph';

declare module '@/domain/graph-v2/node-registry'
{
	export interface NodeRegistry
	{
		item: {
			output: {
				itemRate: ItemRate | null;
			};
			config: {
				itemId: string | null;
				rate: ProductionRate;
			};
		};
	}
}

defineNode({
	type: 'item',
	getDefaultConfig: () =>
	{
		return {
			itemId: null,
			rate: {
				amount: 1,
				per: 'second' as TimeUnit,
			},
		};
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

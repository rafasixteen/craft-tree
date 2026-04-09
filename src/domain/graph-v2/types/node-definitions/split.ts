import { convertItemRate, convertProductionRate, ItemRate, ProductionRate, TimeUnit } from '@/domain/graph';
import { defineNode } from '@/domain/graph-v2';

declare module '@/domain/graph-v2/node-registry'
{
	export interface NodeRegistry
	{
		split: {
			input: {
				itemRate: ItemRate | null;
			};
			output: {
				itemRates: ItemRate[] | null;
			};
			config: {
				productionRates: ProductionRate[];
			};
		};
	}
}

defineNode({
	type: 'split',
	getDefaultConfig: () =>
	{
		return {
			productionRates: [
				{
					amount: 1,
					per: 'second' as TimeUnit,
				},
			],
		};
	},
	executor: (input, config) =>
	{
		const { itemRate } = input;
		const { productionRates } = config;

		if (!itemRate)
		{
			return {
				itemRates: null,
			};
		}

		const totalInputPerSecond = convertItemRate(itemRate, 'second').amount;
		const totalOutputPerSecond = productionRates.reduce(
			(sum, rate) => sum + convertProductionRate(rate, 'second').amount,
			0,
		);

		return {
			itemRates: productionRates.map((rate) =>
			{
				const outputPerSecond = convertProductionRate(rate, 'second').amount;

				const proportion = totalOutputPerSecond > 0 ? outputPerSecond / totalOutputPerSecond : 0;
				const clampedAmount = Math.min(outputPerSecond, totalInputPerSecond * proportion);

				return {
					itemId: itemRate.itemId,
					amount: clampedAmount,
					per: 'second' as TimeUnit,
				};
			}),
		};
	},
});

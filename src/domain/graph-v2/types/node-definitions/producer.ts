import { AnyNodeOutput, defineNode, ItemRateSchema } from '@/domain/graph-v2';
import { z } from 'zod';

declare module '@/domain/graph-v2/registry'
{
	export interface NodeOutputRegistry
	{
		producer: { rates: z.infer<typeof ItemRateSchema>[] | null };
	}
}

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
	parseInputs: (upstreamOutputs) =>
	{
		const itemRates = upstreamOutputs
			.filter((o): o is Extract<AnyNodeOutput, { type: 'item' }> => o.type === 'item')
			.flatMap((o) => (o.itemRate ? [o.itemRate] : []));

		const splitRates = upstreamOutputs
			.filter((o): o is Extract<AnyNodeOutput, { type: 'split' }> => o.type === 'split')
			.flatMap((o) => o.rates ?? []);

		const rates = [...itemRates, ...splitRates];
		return { rates: rates.length > 0 ? rates : null };
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

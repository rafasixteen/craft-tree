import { convertProductionRate, ItemRate, TimeUnit } from '@/domain/graph';
import { NodeOutputs, defineNode } from '@/domain/graph-v2';
import { getProducerById, getProducerInputs, getProducerOutputs } from '@/domain/producer';

declare module '@/domain/graph-v2/node-registry'
{
	export interface NodeRegistry
	{
		producer: {
			input: {
				itemRates: ItemRate[] | null;
			};
			output: {
				itemRates: ItemRate[] | null;
			};
			config: {
				itemId: string | null;
				producerId: string | null;
				producerCount: number;
			};
		};
	}
}

defineNode({
	type: 'producer',
	getDefaultConfig: () =>
	{
		return {
			itemId: null,
			producerId: null,
			producerCount: 1,
		};
	},
	parseInputs: (upstreamOutputs) =>
	{
		const itemRates = upstreamOutputs
			.filter((o): o is Extract<NodeOutputs, { type: 'item' }> => o.type === 'item')
			.flatMap((o) => (o.itemRate ? [o.itemRate] : []));

		const splitRates = upstreamOutputs
			.filter((o): o is Extract<NodeOutputs, { type: 'split' }> => o.type === 'split')
			.flatMap((o) => o.itemRates ?? []);

		const producerRates = upstreamOutputs
			.filter((o): o is Extract<NodeOutputs, { type: 'producer' }> => o.type === 'producer')
			.flatMap((o) => o.itemRates ?? []);

		const rates = [...itemRates, ...splitRates, ...producerRates];
		return { itemRates: rates.length > 0 ? rates : null };
	},
	executor: async (input, config) =>
	{
		const { itemRates } = input;
		const { producerId, producerCount } = config;

		if (!itemRates || !producerId)
		{
			return {
				itemRates: null,
			};
		}

		// const [producer, inputs, outputs] = await Promise.all([
		// 	getProducerById({ producerId }),
		// 	getProducerInputs({ producerId }),
		// 	getProducerOutputs({ producerId }),
		// ]);

		const { producer, inputs, outputs } = await getProducerData(producerId);

		const normalizedItemRates: ItemRate[] = itemRates.map((itemRate) =>
		{
			const converted = convertProductionRate({ amount: itemRate.amount, per: itemRate.per }, 'second');
			return { itemId: itemRate.itemId, amount: converted.amount, per: converted.per };
		});

		let supplyLimitedCycles = Infinity;

		for (const input of inputs)
		{
			const rate = normalizedItemRates.find((r) => r.itemId === input.itemId);

			if (!rate)
			{
				supplyLimitedCycles = 0;
				break;
			}

			supplyLimitedCycles = Math.min(supplyLimitedCycles, rate.amount / input.quantity);
		}

		const producerLimitedCycles = producerCount * (1 / producer.time);
		const actualCycles = Math.min(supplyLimitedCycles, producerLimitedCycles);

		if (actualCycles <= 0 || actualCycles === Infinity)
		{
			return {
				itemRates: null,
			};
		}

		return {
			itemRates: outputs.map((output) => ({
				itemId: output.itemId,
				amount: output.quantity * actualCycles,
				per: 'second' as TimeUnit,
			})),
		};
	},
});

const cache = new Map<
	string,
	{
		producer: Awaited<ReturnType<typeof getProducerById>>;
		inputs: Awaited<ReturnType<typeof getProducerInputs>>;
		outputs: Awaited<ReturnType<typeof getProducerOutputs>>;
	}
>();

async function getProducerData(producerId: string)
{
	if (cache.has(producerId)) return cache.get(producerId)!;

	const [producer, inputs, outputs] = await Promise.all([
		getProducerById({ producerId }),
		getProducerInputs({ producerId }),
		getProducerOutputs({ producerId }),
	]);

	const data = { producer, inputs, outputs };
	cache.set(producerId, data);
	return data;
}

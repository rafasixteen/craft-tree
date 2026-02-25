'use client';

import { useNodeConnections, useNodesData } from '@xyflow/react';
import { ItemGraphNode, ProducerGraphNode, ProductionGraphNode, SplitGraphNode } from '@/components/production-graph/types';
import { ItemRate } from '@/domain/production-graph';
import { useMemo } from 'react';

// This is a version of useSupply hook but with multiple sources.
// TODO: Unify these hooks and make useSupply support multiple
// sources instead of having separate hooks for single vs multiple sources.

export function useProducerInputs(): ItemRate[]
{
	const connections = useNodeConnections({
		handleType: 'target',
	});

	const nodesData = useNodesData<ProductionGraphNode>(connections.map((c) => c.source));

	return useMemo(() =>
	{
		const producerNodes = nodesData.filter((n) => n.type === 'producer') as ProducerGraphNode[];
		const itemNodes = nodesData.filter((n) => n.type === 'item') as ItemGraphNode[];
		const splitNodes = nodesData.filter((n) => n.type === 'split') as SplitGraphNode[];

		const sourceHandleIds = connections.map((c) => c.sourceHandle);
		const newRates: ItemRate[] = [];

		for (const node of producerNodes)
		{
			const { outputRates } = node.data;

			if (outputRates)
			{
				for (const itemRate of outputRates)
				{
					if (sourceHandleIds.includes(itemRate.itemId))
					{
						newRates.push(itemRate);
					}
				}
			}
		}

		for (const node of itemNodes)
		{
			const { item, rate } = node.data;

			if (item)
			{
				newRates.push({
					itemId: item.id,
					amount: rate.amount,
					per: rate.per,
				});
			}
		}

		for (const node of splitNodes)
		{
			const { rates } = node.data;

			if (rates)
			{
				for (let i = 0; i < rates.length; i++)
				{
					const itemRate = rates[i];

					// For split nodes, the source handle id is the index as a string
					if (sourceHandleIds.includes(String(i)))
					{
						newRates.push(itemRate);
					}
				}
			}
		}

		return newRates;
	}, [connections, nodesData]);
}

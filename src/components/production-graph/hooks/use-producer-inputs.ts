'use client';

import { useNodeConnections, useNodesData } from '@xyflow/react';
import { ItemGraphNode, ProducerGraphNode, ProductionGraphNode } from '@/components/production-graph/types';
import { ItemRate } from '@/domain/production-graph';
import { useMemo } from 'react';

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

		return newRates;
	}, [connections, nodesData]);
}

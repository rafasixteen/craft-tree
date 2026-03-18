import { ProductionGraphNode } from '@/components/production-graph/flow/types';

import { ItemRate } from '@/domain/production-graph';
import { useProducerInputsV2, useProducerV2 } from '@/domain/producer';

import { useNodesData } from '@xyflow/react';

interface UseDemandParams
{
	targetNodeId?: string;
	targetHandleId?: string | null;
}

export function useDemand({ targetNodeId, targetHandleId }: UseDemandParams): ItemRate | null
{
	const node = useNodesData<ProductionGraphNode>(targetNodeId ?? '');
	const producerId = node?.type === 'producer' ? (node.data.producerId ?? undefined) : undefined;

	const inputs = useProducerInputsV2(producerId);
	const producer = useProducerV2(producerId);

	if (!node)
	{
		return null;
	}

	if (node.type === 'producer' && inputs && producer)
	{
		// The sourceHandleId corresponds to the itemId.
		const input = inputs.find((i) => i.itemId === targetHandleId);

		if (!input)
		{
			return null;
		}

		return {
			itemId: input.itemId,
			amount: (input.quantity / producer.time) * node.data.producerCount,
			per: 'second',
		};
	}

	if (node.type === 'split')
	{
		const { rates, itemId } = node.data;

		if (!itemId)
		{
			return null;
		}

		const amount = rates.map((rate) => rate.amount).reduce((sum, curr) => sum + curr, 0);

		return {
			amount: amount,
			per: 'second',
			itemId: itemId,
		};
	}

	return null;
}

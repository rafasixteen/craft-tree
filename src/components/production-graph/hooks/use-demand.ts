import { useNodes, useNodesData } from '@xyflow/react';
import { ProductionGraphNode } from '@/components/production-graph/types';
import { ItemRate } from '@/domain/production-graph';

interface UseDemandParams
{
	targetNodeId?: string;
	targetHandleId?: string | null;
}

export function useDemand({ targetNodeId, targetHandleId }: UseDemandParams): ItemRate | null
{
	const node = useNodesData<ProductionGraphNode>(targetNodeId ?? '');

	if (!node || node.type !== 'producer')
	{
		return null;
	}

	if (!node.data.producer || !node.data.inputs)
	{
		return null;
	}

	const input = node.data.inputs.find((i) => i.itemId === targetHandleId);

	if (!input)
	{
		return null;
	}

	return {
		itemId: input.itemId,
		rate: {
			amount: input.quantity / node.data.producer.time,
			per: 'second',
		},
	};
}

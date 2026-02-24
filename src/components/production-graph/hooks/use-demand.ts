import { useNodesData } from '@xyflow/react';
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

	const { producer, producerCount, inputs } = node.data;

	if (!producer || !inputs)
	{
		return null;
	}

	const input = inputs.find((i) => i.itemId === targetHandleId);

	if (!input)
	{
		return null;
	}

	return {
		itemId: input.itemId,
		rate: {
			amount: (input.quantity / producer.time) * producerCount,
			per: 'second',
		},
	};
}

import { useNodes } from '@xyflow/react';
import { ProductionGraphNode } from '@/components/production-graph/types';
import { ItemRate } from '@/domain/production-graph';

interface UseDemandParams
{
	targetNodeId?: string;
	targetHandleId?: string | null;
}

export function useDemand({ targetNodeId, targetHandleId }: UseDemandParams): ItemRate | null
{
	const nodes = useNodes<ProductionGraphNode>();
	const node = nodes.find((n) => n.id === targetNodeId);

	if (!node || node.type !== 'producer')
	{
		return null;
	}

	if (!node.data.producer || !node.data.inputs)
	{
		return null;
	}

	const input = node.data.inputs.find((i) => i.id === targetHandleId);

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

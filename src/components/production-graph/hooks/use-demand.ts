import { useNodesData } from '@xyflow/react';
import { ProductionGraphNode } from '@/components/production-graph/types';
import { ItemRate } from '@/domain/production-graph';
import { useProducerInputsV2, useProducerV2 } from '@/domain/producer';

interface UseDemandParams
{
	targetNodeId?: string;
	targetHandleId?: string | null;
}

export function useDemand({ targetNodeId, targetHandleId }: UseDemandParams): ItemRate | null
{
	const node = useNodesData<ProductionGraphNode>(targetNodeId ?? '');
	const producerId = node?.type === 'producer' ? (node.data.producerId ?? undefined) : undefined;

	const { inputs } = useProducerInputsV2(producerId);
	const { producer } = useProducerV2(producerId);

	if (!node || node.type !== 'producer')
	{
		return null;
	}

	if (!inputs || !producer)
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
			amount: (input.quantity / producer.time) * node.data.producerCount,
			per: 'second',
		},
	};
}

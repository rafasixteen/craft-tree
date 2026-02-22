import { useNodes } from '@xyflow/react';
import { ItemRate } from '@/domain/production-graph';
import { ProductionGraphNode } from '@/components/production-graph/types';
import { ProducerOutput } from '@/domain/producer';

interface UseSupplyParams
{
	sourceNodeId?: string;
	sourceHandleId?: string | null;
}

export function useSupply({ sourceNodeId, sourceHandleId }: UseSupplyParams): ItemRate | null
{
	const nodes = useNodes<ProductionGraphNode>();
	const node = nodes.find((n) => n.id === sourceNodeId);

	if (!node)
	{
		return null;
	}

	if (node.type === 'item')
	{
		const { item, rate } = node.data;

		if (!item)
		{
			return null;
		}

		return {
			itemId: item.id,
			rate: rate,
		};
	}

	if (node.type === 'producer')
	{
		const { producer, outputs } = node.data;

		if (!producer || !outputs)
		{
			return null;
		}

		if (!sourceHandleId)
		{
			throw new Error('Producer node supply must have sourceHandleId');
		}

		const output = outputs.find((o: ProducerOutput) => o.itemId === sourceHandleId);

		if (!output)
		{
			return null;
		}

		return {
			itemId: output.itemId,
			rate: {
				amount: output.quantity / producer.time,
				per: 'second',
			},
		};
	}

	return null;
}

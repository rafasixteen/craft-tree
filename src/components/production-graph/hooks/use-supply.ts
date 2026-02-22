import { useNodes } from '@xyflow/react';
import { ItemRate } from '@/domain/production-graph';
import { ProductionGraphNode } from '@/components/production-graph/types';

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
		const { outputRates } = node.data;

		if (!outputRates)
		{
			return null;
		}

		return outputRates.find((itemRate) => itemRate.itemId === sourceHandleId) ?? null;
	}

	return null;
}

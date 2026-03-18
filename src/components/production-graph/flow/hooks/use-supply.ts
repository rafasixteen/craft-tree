import { useNodesData } from '@xyflow/react';
import { ItemRate } from '@/domain/production-graph';
import { ProductionGraphNode } from '@/components/production-graph/flow/types';

interface UseSupplyParams
{
	sourceNodeId?: string;
	sourceHandleId?: string | null;
}

export function useSupply({
	sourceNodeId,
	sourceHandleId,
}: UseSupplyParams): ItemRate | null
{
	const node = useNodesData<ProductionGraphNode>(sourceNodeId ?? '');

	if (!node)
	{
		return null;
	}

	if (node.type === 'item')
	{
		const { itemId, rate } = node.data;

		if (!itemId)
		{
			return null;
		}

		return {
			...rate,
			itemId: itemId,
		};
	}

	if (node.type === 'producer')
	{
		const { outputRates } = node.data;

		if (!outputRates)
		{
			return null;
		}

		// The sourceHandleId corresponds to the itemId.
		return (
			outputRates.find((rate) => rate.itemId === sourceHandleId) ?? null
		);
	}

	if (node.type === 'split')
	{
		const { rates, itemId } = node.data;

		if (!rates || !itemId || !sourceHandleId)
		{
			return null;
		}

		// The sourceHandleId corresponds to the index.
		const rate = rates[Number(sourceHandleId)];

		return {
			...rate,
			itemId: itemId,
		};
	}

	return null;
}

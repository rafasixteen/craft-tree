import { useNodesData } from '@xyflow/react';
import { ItemRate } from '@/domain/production-graph';
import { ProductionGraphNode } from '@/components/production-graph/flow/types';

interface UseSupplyParams
{
	sourceNodeId?: string;
	sourceHandleId?: string | null;
}

export function useSupply({ sourceNodeId, sourceHandleId }: UseSupplyParams): ItemRate | null
{
	const node = useNodesData<ProductionGraphNode>(sourceNodeId ?? '');

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
			amount: rate.amount,
			per: rate.per,
		};
	}

	if (node.type === 'producer')
	{
		const { outputRates } = node.data;

		if (!outputRates)
		{
			return null;
		}

		// The sourceHandleId corresponds to the itemId of the output rate in the producer node.
		return outputRates.find((rate) => rate.itemId === sourceHandleId) ?? null;
	}

	if (node.type === 'split')
	{
		const { rates } = node.data;

		if (!rates || !sourceHandleId)
		{
			return null;
		}

		// The sourceHandleId corresponds to the index of the rate in the split node.
		return rates[Number(sourceHandleId)];
	}

	return null;
}

import { useNodes } from '@xyflow/react';
import { ItemGraphNode, ProductionGraphNode } from '@/components/production-graph/types/node-type';
import { ItemRate } from '@/components/production-graph/types/item-rate';
import { convertProductionRate } from '@/domain/production-graph/utils/production-rate-conversion';

export function useRequiredInput(nodeId?: string, handleId?: string | null): ItemRate | null
{
	const nodes = useNodes<ProductionGraphNode>();
	const node = nodes.find((n) => n.id === nodeId);

	if (!node || node.type !== 'producer')
	{
		return null;
	}

	if (!node.data.producer || !node.data.inputs)
	{
		return null;
	}

	const input = node.data.inputs.find((i) => i.id === handleId);

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

export function useSourceItemRate(nodeId?: string): ItemRate | null
{
	const nodes = useNodes<ItemGraphNode>();
	const node = nodes.find((n) => n.id === nodeId);

	if (!node || node.type !== 'item')
	{
		return null;
	}

	if (!node.data.item || !node.data.rate)
	{
		return null;
	}

	return {
		itemId: node.data.item.id,
		rate: node.data.rate,
	};
}

export function useEdgeStatus(sourceNodeId?: string, targetNodeId?: string, handleId?: string | null): 'valid' | 'insufficient' | 'invalid'
{
	const source = useSourceItemRate(sourceNodeId);
	const required = useRequiredInput(targetNodeId, handleId);

	if (!source || !required)
	{
		return 'invalid';
	}

	if (source.itemId !== required.itemId)
	{
		return 'invalid';
	}

	// Convert both rates to 'second' for comparison
	const supply = convertProductionRate(source.rate, 'second');
	const demand = convertProductionRate(required.rate, 'second');

	if (supply.amount < demand.amount)
	{
		return 'insufficient';
	}

	return 'valid';
}

import { ProductionGraphNode } from '@/components/production-graph/types';

export function getTargetItemId(node: ProductionGraphNode | undefined, handleId: string | null | undefined): string | undefined
{
	if (!node || !handleId)
	{
		return undefined;
	}

	if (node.type === 'producer')
	{
		return node.data.inputs.find((i) => i.id === handleId)?.itemId;
	}

	if (node.type === 'item')
	{
		return node.data.item.id;
	}

	return undefined;
}

import { isItemNode, isProducerNode } from '@/components/production-graph/utils';
import { ProductionGraphNode } from '@/components/production-graph/types';
import { ItemRate } from '@/domain/production-graph';

export function getSourceItemRate(node: ProductionGraphNode | null | undefined, sourceHandle: string | null | undefined): ItemRate | null
{
	if (!node)
	{
		return null;
	}

	if (isProducerNode(node))
	{
		if (!node.data.outputs || !node.data.producer)
		{
			return null;
		}

		const output = node.data.outputs.find((o) => o.id === sourceHandle);

		if (!output)
		{
			return null;
		}

		return {
			itemId: output.itemId,
			rate: {
				amount: output.quantity / node.data.producer.time,
				per: 'second',
			},
		};
	}

	if (isItemNode(node))
	{
		if (!node.data.item)
		{
			return null;
		}

		return {
			itemId: node.data.item.id,
			rate: node.data.rate,
		};
	}

	return null;
}

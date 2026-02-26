import { useRecipeTree } from './use-recipe-tree';
import { useMemo } from 'react';
import { getProducerThroughput } from '@/domain/recipe-tree';
import { ProductionRate } from '@/domain/production-graph';

export function useSelectedProducerThroughput(nodeId: string): ProductionRate
{
	const { recipeTree } = useRecipeTree();

	return useMemo(() =>
	{
		if (!recipeTree)
		{
			return { amount: 0, per: 'second' };
		}

		const node = recipeTree.nodes[nodeId];

		if (!node)
		{
			return { amount: 0, per: 'second' };
		}

		const selectedProducer = node.producers.find((p) => p.id === node.selectedProducerId);

		if (!selectedProducer)
		{
			return { amount: 0, per: 'second' };
		}

		// Find the output for this item from the selected producer
		const outputs = node.producerOutputs[selectedProducer.id] || [];
		const output = outputs.find((o) => o.itemId === node.item.id);

		if (!output)
		{
			return { amount: 0, per: 'second' };
		}

		return getProducerThroughput(selectedProducer, output, 'second');
	}, [recipeTree, nodeId]);
}

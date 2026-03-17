import { RecipeTreeState, getResolvedQuantity } from '@/domain/recipe-tree';

export function getLeftovers(state: RecipeTreeState, nodeId: string): number
{
	const node = state.nodes[nodeId];

	const selectedProducer = node.producers.find((p) => p.id === node.selectedProducerId);

	if (!selectedProducer)
	{
		return 0;
	}

	const outputs = node.producerOutputs[selectedProducer.id] || [];
	const output = outputs.find((o) => o.itemId === node.item.id);

	if (!output)
	{
		return 0;
	}

	const outputQuantity = output.quantity;
	const quantityNeeded = getResolvedQuantity(state, nodeId);

	const cyclesNeeded = Math.ceil(quantityNeeded / outputQuantity);
	const totalProduced = cyclesNeeded * outputQuantity;

	return totalProduced - quantityNeeded;
}

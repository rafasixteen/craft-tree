import { RecipeTreeState } from '@/domain/recipe-tree';

export function getResolvedQuantity(state: RecipeTreeState, nodeId: string): number
{
	const node = state.nodes[nodeId];

	if (!node.parentId)
	{
		const selectedProducer = node.producers.find((p) => p.id === node.selectedProducerId);

		if (!selectedProducer)
		{
			throw new Error(`Node with item "${node.item.name}" has no selected producer.`);
		}

		// Use output quantity from producerOutputs if available
		const outputs = node.producerOutputs[selectedProducer.id] || [];

		// Assume only one output per producer for this item
		const output = outputs.find((o) => o.itemId === node.item.id);

		return output ? output.quantity : 1;
	}

	const parent = state.nodes[node.parentId];
	const parentProducer = parent.producers.find((p) => p.id === parent.selectedProducerId);

	if (!parentProducer)
	{
		throw new Error(`Parent node with item "${parent.item.name}" has no selected producer.`);
	}

	// Find the input for this node's item in the parent producer
	const inputs = parent.producerInputs[parentProducer.id] || [];
	const input = inputs.find((i) => i.itemId === node.item.id);

	if (!input)
	{
		return 0;
	}

	return getResolvedQuantity(state, parent.id) * input.quantity;
}

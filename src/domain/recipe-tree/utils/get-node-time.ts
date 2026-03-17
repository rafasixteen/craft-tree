import { getResolvedQuantity, RecipeTreeState } from '@/domain/recipe-tree';

export function getNodeTime(state: RecipeTreeState, nodeId: string): number
{
	const quantity = getResolvedQuantity(state, nodeId);

	const node = state.nodes[nodeId];
	const currentProducer = node.producers.find((p) => p.id === node.selectedProducerId);

	if (!currentProducer)
	{
		throw new Error(`Node with item "${state.nodes[nodeId].item.name}" has no selected producer.`);
	}

	const producerOutputs = node.producerOutputs[currentProducer.id];
	const output = producerOutputs.find((o) => o.itemId === node.item.id);

	if (!output)
	{
		throw new Error(`Producer "${currentProducer.name}" does not produce item "${node.item.name}".`);
	}

	return (currentProducer.time * quantity) / output.quantity;
}

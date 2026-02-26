import { ProductionRate } from '@/domain/production-graph';
import { RecipeTreeState, getResolvedQuantity } from '@/domain/recipe-tree';

export function getNodeDemand(state: RecipeTreeState, nodeId: string): ProductionRate
{
	const root = state.nodes[state.rootNodeId];

	const selectedProducer = root.producers.find((p) => p.id === root.selectedProducerId);

	if (!selectedProducer)
	{
		throw new Error('Root node has no selected producer.');
	}

	const outputs = root.producerOutputs[selectedProducer.id] || [];
	const output = outputs.find((o) => o.itemId === root.item.id);

	const rootOutputQuantity = output ? output.quantity : 1;

	const requiredCount = getResolvedQuantity(state, nodeId);
	const ratio = requiredCount / rootOutputQuantity;

	return { amount: state.rate.amount * ratio, per: state.rate.per };
}

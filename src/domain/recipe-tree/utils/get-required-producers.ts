import { convertProductionRate } from '@/domain/production-graph';
import { getNodeDemand, RecipeTreeState } from '@/domain/recipe-tree';
import { getProducerThroughput } from './get-producer-troughput';

export function getRequiredProducers(state: RecipeTreeState, nodeId: string): number
{
	const node = state.nodes[nodeId];

	const selectedProducer = node.producers.find((p) => p.id === node.selectedProducerId);

	if (!selectedProducer)
	{
		throw new Error(`Node with id "${nodeId}" has no selected producer.`);
	}

	// Find the output for this item from the selected producer
	const outputs = node.producerOutputs[selectedProducer.id] || [];
	const output = outputs.find((o) => o.itemId === node.item.id);

	if (!output)
	{
		throw new Error(`Producer ${selectedProducer.id} does not output item ${node.item.id}.`);
	}

	const demand = getNodeDemand(state, nodeId);
	const demandPerSecond = convertProductionRate(demand, 'second').amount;
	const producerThroughput = getProducerThroughput(selectedProducer, output, 'second').amount;

	return demandPerSecond / producerThroughput;
}

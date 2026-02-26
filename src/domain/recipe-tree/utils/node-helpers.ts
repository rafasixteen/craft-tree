import { ProductionRate, TimeUnit, convertProductionRate } from '@/domain/production-graph';
import { RecipeTreeState } from '../types/recipe-tree-state';
import { Producer, ProducerOutput } from '@/domain/producer';

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

export function getProducerThroughput(producer: Producer, output: ProducerOutput, unit: TimeUnit): ProductionRate
{
	const quantityPerSecond = output.quantity / producer.time;
	const rate: ProductionRate = { amount: quantityPerSecond, per: 'second' };
	return convertProductionRate(rate, unit);
}

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

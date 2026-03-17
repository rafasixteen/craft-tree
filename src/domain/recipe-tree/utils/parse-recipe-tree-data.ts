import { RecipeTreeData } from '@/domain/recipe-tree/types/recipe-tree-data';
import { RecipeTreeNode, RecipeTreeState } from '@/domain/recipe-tree/types';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';

export function parseRecipeTreeData(data: RecipeTreeData): RecipeTreeState
{
	const { items, producers, producerInputs, producerOutputs } = data;

	if (items.length === 0)
	{
		throw new Error('No items found in recipe tree data.');
	}

	const itemsById = new Map(items.map((item) => [item.id, item]));
	const producersByOutputItemId = new Map<string, Producer[]>();
	const inputsByProducerId = new Map<string, ProducerInput[]>();
	const outputsByProducerId = new Map<string, ProducerOutput[]>();

	for (const producer of producers)
	{
		for (const output of producerOutputs.filter((o) => o.producerId === producer.id))
		{
			if (!producersByOutputItemId.has(output.itemId))
			{
				producersByOutputItemId.set(output.itemId, []);
			}

			producersByOutputItemId.get(output.itemId)!.push(producer);
		}
	}

	for (const input of producerInputs)
	{
		if (!inputsByProducerId.has(input.producerId))
		{
			inputsByProducerId.set(input.producerId, []);
		}

		inputsByProducerId.get(input.producerId)!.push(input);
	}

	for (const output of producerOutputs)
	{
		if (!outputsByProducerId.has(output.producerId))
		{
			outputsByProducerId.set(output.producerId, []);
		}

		outputsByProducerId.get(output.producerId)!.push(output);
	}

	const nodes: Record<string, RecipeTreeNode> = {};
	let nodeCounter = 0;

	function buildNode(itemId: string, parentId: string | null): RecipeTreeNode
	{
		const item = itemsById.get(itemId);

		if (!item)
		{
			throw new Error(`Item with id "${itemId}" not found.`);
		}

		const nodeId = `node-${++nodeCounter}`;
		const nodeProducers = producersByOutputItemId.get(itemId) ?? [];
		const nodeChildren: Record<string, string[]> = {};
		const producerInputs: Record<string, ProducerInput[]> = {};
		const producerOutputs: Record<string, ProducerOutput[]> = {};

		for (const producer of nodeProducers)
		{
			const inputs = inputsByProducerId.get(producer.id) ?? [];
			const outputs = outputsByProducerId.get(producer.id) ?? [];

			nodeChildren[producer.id] = [];
			producerInputs[producer.id] = inputs;
			producerOutputs[producer.id] = outputs;

			for (const input of inputs)
			{
				const childNode = buildNode(input.itemId, nodeId);
				nodeChildren[producer.id].push(childNode.id);
			}
		}

		const node: RecipeTreeNode = {
			id: nodeId,
			item,
			producers: nodeProducers,
			selectedProducerId: nodeProducers[0]?.id ?? null,
			parentId,
			children: nodeChildren,
			producerInputs,
			producerOutputs,
		};

		nodes[nodeId] = node;
		return node;
	}

	// Find root item: not an input to any producer.
	const inputItemIds = new Set(producerInputs.map((i) => i.itemId));
	const rootItem = items.find((item) => !inputItemIds.has(item.id));

	if (!rootItem)
	{
		throw new Error('Could not determine root item.');
	}

	const rootNode = buildNode(rootItem.id, null);

	return {
		rootNodeId: rootNode.id,
		nodes,
	};
}

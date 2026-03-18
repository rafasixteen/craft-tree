import { BillOfMaterials, dfs, getResolvedQuantity, RecipeTreeNode, RecipeTreeState } from '@/domain/recipe-tree';
import { Item } from '@/domain/item';

export function getLeftovers(state: RecipeTreeState): BillOfMaterials
{
	const quantityNeededMap = new Map<Item['id'], { item: Item; needed: number; outputQuantity: number }>();

	function getSelectedProducerChildren(node: RecipeTreeNode): string[]
	{
		if (!node.selectedProducerId)
		{
			return [];
		}

		return node.children[node.selectedProducerId] || [];
	}

	function visit(node: RecipeTreeNode)
	{
		if (node.id === state.rootNodeId)
		{
			return;
		}

		const selectedProducer = node.producers.find((p) => p.id === node.selectedProducerId);

		if (!selectedProducer)
		{
			return;
		}

		const outputs = node.producerOutputs[selectedProducer.id] || [];
		const output = outputs.find((o) => o.itemId === node.item.id);

		if (!output)
		{
			return;
		}

		const needed = Math.ceil(getResolvedQuantity(state, node.id));
		const existing = quantityNeededMap.get(node.item.id);

		if (existing)
		{
			existing.needed += needed;
		}
		else
		{
			const entry = {
				item: node.item,
				needed,
				outputQuantity: output.quantity,
			};

			quantityNeededMap.set(node.item.id, entry);
		}
	}

	dfs({
		state,
		startNodeId: state.rootNodeId,
		visit,
		getChildren: getSelectedProducerChildren,
		order: 'pre',
	});

	const leftovers: BillOfMaterials = [];

	for (const { item, needed, outputQuantity } of quantityNeededMap.values())
	{
		const cyclesNeeded = Math.ceil(needed / outputQuantity);
		const totalProduced = cyclesNeeded * outputQuantity;
		const leftover = totalProduced - needed;

		if (leftover > 0)
		{
			leftovers.push({ item, amount: Math.ceil(leftover) });
		}
	}

	return leftovers.sort((a, b) => b.amount - a.amount);
}

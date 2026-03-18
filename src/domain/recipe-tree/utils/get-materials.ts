import { Item } from '@/domain/item';
import {
	BillOfMaterials,
	BillOfMaterialsEntry,
	RecipeTreeNode,
	RecipeTreeState,
	dfs,
	getResolvedQuantity,
} from '@/domain/recipe-tree';

export function getMaterials(state: RecipeTreeState): BillOfMaterials
{
	const leafNodes: RecipeTreeNode[] = [];

	function getSelectedProducerChildren(node: RecipeTreeNode): string[]
	{
		if (!node.selectedProducerId)
		{
			return [];
		}

		return node.children[node.selectedProducerId] || [];
	}

	function collectLeaf(node: RecipeTreeNode)
	{
		if (getSelectedProducerChildren(node).length === 0)
		{
			leafNodes.push(node);
		}
	}

	dfs({
		state: state,
		startNodeId: state.rootNodeId,
		visit: collectLeaf,
		getChildren: getSelectedProducerChildren,
		order: 'pre',
	});

	const materials = new Map<Item['id'], BillOfMaterialsEntry>();

	for (const node of leafNodes)
	{
		// Skip root node if it's a leaf. This can happen if the node we are visualizing is a raw material.
		if (node.id === state.rootNodeId)
		{
			continue;
		}

		const quantity = getResolvedQuantity(state, node.id);

		if (materials.has(node.item.id))
		{
			const entry = materials.get(node.item.id)!;
			entry.amount += quantity;
		}
		else
		{
			const entry: BillOfMaterialsEntry = {
				item: node.item,
				amount: quantity,
			};

			materials.set(node.item.id, entry);
		}
	}

	return Array.from(materials.values())
		.map((entry) => ({ ...entry, amount: Math.ceil(entry.amount) }))
		.sort((a, b) => b.amount - a.amount);
}

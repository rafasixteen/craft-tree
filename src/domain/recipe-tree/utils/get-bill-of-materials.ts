import { RecipeTreeState, BillOfMaterials, RecipeTreeNode, BillOfMaterialsEntry, getNodeDemand, dfs } from '@/domain/recipe-tree';
import { Item } from '@/domain/item';

export function getBillOfMaterials(state: RecipeTreeState): BillOfMaterials
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

	const bom = new Map<Item['id'], BillOfMaterialsEntry>();

	for (const node of leafNodes)
	{
		// Skip root node if it's a leaf. This can happen if the node we are visualizing is a raw material.
		if (node.id === state.rootNodeId)
		{
			continue;
		}

		const demand = getNodeDemand(state, node.id);

		if (bom.has(node.item.id))
		{
			const entry = bom.get(node.item.id)!;
			entry.demand.amount += demand.amount;
		}
		else
		{
			bom.set(node.item.id, { item: node.item, demand: demand });
		}
	}

	return Array.from(bom.values()).sort((a, b) => a.item.name.localeCompare(b.item.name));
}

import { InventoryData, InventoryTreeNode, InventoryTreeState } from '@/domain/inventory';

export function parseInventoryData(data: InventoryData): InventoryTreeState
{
	const { collection, folders, items, recipes } = data;

	const nodes: Record<InventoryTreeNode['id'], InventoryTreeNode> = {};
	const nodeOrder: Record<InventoryTreeNode['id'], number> = {};

	// Create collection root
	nodes[collection.id] = {
		id: collection.id,
		name: collection.name,
		slug: collection.slug,
		type: 'collection',
		children: [],
	};

	// Create folder nodes
	for (const folder of folders)
	{
		nodeOrder[folder.id] = folder.order;

		nodes[folder.id] = {
			id: folder.id,
			name: folder.name,
			slug: folder.slug,
			type: 'folder',
			children: [],
		};
	}

	// Create item nodes
	for (const item of items)
	{
		nodeOrder[item.id] = item.order;

		nodes[item.id] = {
			id: item.id,
			name: item.name,
			slug: item.slug,
			type: 'item',
			children: [],
		};
	}

	// Create recipe nodes
	for (const recipe of recipes)
	{
		nodeOrder[recipe.id] = recipe.order;

		nodes[recipe.id] = {
			id: recipe.id,
			name: recipe.name,
			slug: recipe.slug,
			type: 'recipe',
			children: [],
		};
	}

	// Link children
	function linkChild(childId: string, parentId: string)
	{
		const parent = nodes[parentId];
		if (!parent.children) parent.children = [];
		parent.children.push(childId);
	}

	// folders → parentFolderId or collection
	for (const folder of folders)
	{
		const parentId = folder.parentFolderId ?? collection.id;
		linkChild(folder.id, parentId);
	}

	// items → folderId or collection
	for (const item of items)
	{
		const parentId = item.folderId ?? collection.id;
		linkChild(item.id, parentId);
	}

	// recipes → itemId
	for (const recipe of recipes)
	{
		if (recipe.itemId)
		{
			linkChild(recipe.id, recipe.itemId);
		}
	}

	// Sort children by order
	for (const node of Object.values(nodes))
	{
		if (node.children && node.children.length > 0)
		{
			node.children.sort((childA, childB) =>
			{
				const orderA = nodeOrder[childA] ?? 0;
				const orderB = nodeOrder[childB] ?? 0;
				return orderA - orderB;
			});
		}
	}

	return {
		rootNodeId: collection.id,
		nodes,
	};
}

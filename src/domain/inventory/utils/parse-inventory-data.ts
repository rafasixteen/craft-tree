import { InventoryData, InventoryTreeNode, InventoryTreeState } from '@/domain/inventory';

export function parseInventoryData(data: InventoryData): InventoryTreeState
{
	const { collection, folders, items, recipes } = data;

	const nodes: Record<InventoryTreeNode['id'], InventoryTreeNode> = {};

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

	return {
		rootNodeId: collection.id,
		nodes,
	};
}

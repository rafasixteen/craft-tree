import { Collection } from '@/domain/collection';
import { getTreeNodes, Node } from '@/domain/tree';

/**
 * Load tree nodes from database and build node hierarchy
 */
export async function loadTreeNodesData(collection: Collection): Promise<Record<string, Node>>
{
	try
	{
		const nodesFromDb = await getTreeNodes(collection.id);
		const nodes: Record<string, Node> = {};

		// Create collection node
		const collectionNode: Node = {
			id: collection.id,
			name: collection.name,
			slug: collection.slug,
			type: 'collection',
			children: [],
			collectionSlug: collection.slug,
			collectionId: collection.id,
		};

		nodes[collection.id] = collectionNode;

		// Create dummy root wrapper to show collection as a single top-level folder
		const dummyRootId = `dummy-${collection.id}`;
		const dummyRoot: Node = {
			id: dummyRootId,
			name: 'Root',
			slug: 'root',
			type: 'folder',
			children: [collection.id],
			collectionSlug: collection.slug,
			collectionId: collection.id,
		};

		nodes[dummyRootId] = dummyRoot;

		// First pass: create all folder nodes and record parent relationships
		const folderParentPairs: Array<{ parentId: string; childId: string }> = [];
		const seenFolderParentPair = new Set<string>();

		for (const row of nodesFromDb)
		{
			if (!nodes[row.folder_id])
			{
				nodes[row.folder_id] = {
					id: row.folder_id,
					name: row.folder_name,
					slug: row.folder_slug,
					collectionSlug: collection.slug,
					collectionId: collection.id,
					type: 'folder',
					children: [],
				};
			}

			if (row.parent_folder_id)
			{
				const key = `${row.parent_folder_id}->${row.folder_id}`;
				if (!seenFolderParentPair.has(key))
				{
					seenFolderParentPair.add(key);
					folderParentPairs.push({
						parentId: row.parent_folder_id,
						childId: row.folder_id,
					});
				}
			}
			else
			{
				// Top-level folder - add to collection node
				if (!collectionNode.children?.includes(row.folder_id))
				{
					collectionNode.children?.push(row.folder_id);
				}
			}
		}

		// Link folders to their parents after all folders exist
		for (const { parentId, childId } of folderParentPairs)
		{
			// Ensure parent exists (it should, but guard just in case)
			if (!nodes[parentId])
			{
				nodes[parentId] = {
					id: parentId,
					name: 'Folder',
					slug: 'folder',
					collectionSlug: collection.slug,
					collectionId: collection.id,
					type: 'folder',
					children: [],
				};
			}

			const parent = nodes[parentId];
			if (!parent.children)
			{
				parent.children = [];
			}
			if (!parent.children.includes(childId))
			{
				parent.children.push(childId);
			}
		}

		// Second pass: create items and recipes and link accordingly
		for (const row of nodesFromDb)
		{
			if (row.item_id && !nodes[row.item_id])
			{
				nodes[row.item_id] = {
					id: row.item_id,
					name: row.item_name!,
					slug: row.item_slug!,
					collectionSlug: collection.slug,
					collectionId: collection.id,
					type: 'item',
					children: [],
				};

				// Add item to folder if it has one, otherwise add to collection
				if (row.folder_id)
				{
					if (!nodes[row.folder_id].children?.includes(row.item_id))
					{
						nodes[row.folder_id].children!.push(row.item_id);
					}
				}
				else
				{
					// Top-level item - add to collection node
					if (!collectionNode.children?.includes(row.item_id))
					{
						collectionNode.children?.push(row.item_id);
					}
				}
			}

			if (row.recipe_id && !nodes[row.recipe_id])
			{
				nodes[row.recipe_id] = {
					id: row.recipe_id,
					name: row.recipe_name!,
					slug: row.recipe_slug!,
					collectionSlug: collection.slug,
					collectionId: collection.id,
					type: 'recipe',
				};

				if (row.item_id && nodes[row.item_id]?.children && !nodes[row.item_id].children!.includes(row.recipe_id))
				{
					nodes[row.item_id].children!.push(row.recipe_id);
				}
			}
		}

		return nodes;
	}
	catch (error)
	{
		console.error('Error loading tree nodes:', error);
		return {};
	}
}

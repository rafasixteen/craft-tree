import { getTreeNodes, Node, NodeType, NodeMap } from '@/domain/tree';
import { Collection } from '@/domain/collection';

export async function getNodeMap(collection: Collection): Promise<NodeMap>
{
	try
	{
		const rows = await getTreeNodes(collection.id);
		const nodes: NodeMap = {};
		const orderMap = new Map<string, number>();

		// Initialize root nodes
		const collectionNode = createNode(collection.id, collection.name, collection.slug, 'collection', collection);
		const dummyRoot = createNode(`dummy-${collection.id}`, 'Root', 'root', 'dummy', collection, [collection.id]);

		nodes[collection.id] = collectionNode;
		nodes[dummyRoot.id] = dummyRoot;

		// Track folder parent relationships to build hierarchy
		const folderParents = new Map<string, string>();
		const topLevelFolders: string[] = [];

		// Single pass to extract all structural data
		for (const row of rows)
		{
			// Create folder node if needed
			if (row.folder_id && !nodes[row.folder_id])
			{
				nodes[row.folder_id] = createNode(row.folder_id, row.folder_name, row.folder_slug, 'folder', collection);
				orderMap.set(row.folder_id, row.folder_order);
			}
			else if (row.folder_id && !orderMap.has(row.folder_id))
			{
				orderMap.set(row.folder_id, row.folder_order);
			}

			// Track folder hierarchy
			if (row.folder_id && row.parent_folder_id)
			{
				folderParents.set(row.folder_id, row.parent_folder_id);
			}
			else if (row.folder_id)
			{
				topLevelFolders.push(row.folder_id);
			}

			// Create item node if needed
			if (row.item_id && !nodes[row.item_id])
			{
				nodes[row.item_id] = createNode(row.item_id, row.item_name!, row.item_slug!, 'item', collection);
				if (row.item_order !== null)
				{
					orderMap.set(row.item_id, row.item_order);
				}
			}
			else if (row.item_id && row.item_order !== null && !orderMap.has(row.item_id))
			{
				orderMap.set(row.item_id, row.item_order);
			}

			// Create recipe node if needed
			if (row.recipe_id && !nodes[row.recipe_id])
			{
				nodes[row.recipe_id] = createNode(row.recipe_id, row.recipe_name!, row.recipe_slug!, 'recipe', collection);
				if (row.recipe_order !== null)
				{
					orderMap.set(row.recipe_id, row.recipe_order);
				}
			}
			else if (row.recipe_id && row.recipe_order !== null && !orderMap.has(row.recipe_id))
			{
				orderMap.set(row.recipe_id, row.recipe_order);
			}
		}

		// Link folders to their parents
		folderParents.forEach((parentId, childId) =>
		{
			const parent = nodes[parentId] || createNode(parentId, 'Folder', 'folder', 'folder', collection);

			if (!nodes[parentId])
			{
				nodes[parentId] = parent;
			}

			addChild(parent, childId);
		});

		// Add top-level folders to collection
		topLevelFolders.forEach((folderId) => addChild(collectionNode, folderId));

		// Link items to their parents (folders or collection)
		for (const row of rows)
		{
			if (!row.item_id) continue;

			const parent = row.folder_id ? nodes[row.folder_id] : collectionNode;
			if (parent) addChild(parent, row.item_id);
		}

		// Link recipes to their parent items
		for (const row of rows)
		{
			if (!row.recipe_id || !row.item_id) continue;

			const item = nodes[row.item_id];
			if (item) addChild(item, row.recipe_id);
		}

		const compareChildren = (a: string, b: string) =>
		{
			const orderA = orderMap.get(a);
			const orderB = orderMap.get(b);

			if (orderA !== undefined && orderB !== undefined && orderA !== orderB)
			{
				return orderA - orderB;
			}

			if (orderA === undefined && orderB !== undefined) return 1;
			if (orderA !== undefined && orderB === undefined) return -1;

			const nameA = nodes[a]?.name ?? '';
			const nameB = nodes[b]?.name ?? '';
			return nameA.localeCompare(nameB);
		};

		Object.values(nodes).forEach((node) =>
		{
			if (node.children && node.children.length > 1)
			{
				node.children.sort(compareChildren);
			}
		});

		return nodes;
	}
	catch (error)
	{
		console.error('Error loading tree nodes:', error);
		return {};
	}
}

function createNode(id: string, name: string, slug: string, type: NodeType, collection: Collection, children: string[] = []): Node
{
	return {
		id,
		name,
		slug,
		type,
		children,
		collectionSlug: collection.slug,
		collectionId: collection.id,
	};
}

function addChild(parent: Node, childId: string): void
{
	if (!parent.children)
	{
		parent.children = [];
	}

	if (!parent.children.includes(childId))
	{
		parent.children.push(childId);
	}
}

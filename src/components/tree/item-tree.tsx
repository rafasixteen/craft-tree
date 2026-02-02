'use client';

import { useTree } from '@headless-tree/react';
import { ItemTreeNode } from '@/components/tree';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { filterFeature, removeDefaultExpandFeature } from '@/components/tree/features';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { renameCollection } from '@/domain/collection';
import { renameFolder, moveAndReorderFolders } from '@/domain/folder';
import { nameSchema } from '@/domain/shared';
import { Node } from '@/domain/tree';
import { usePathname, useRouter } from 'next/navigation';
import { renameItem, moveAndReorderItems } from '@/domain/item';
import { reorderRecipes, updateRecipe } from '@/domain/recipe';
import { getItem, getItemChildren } from './item-tree.utils';
import { useCollectionsContext } from '@/providers/collections-context';
import { useTreeNodes } from '@/providers';
import { getNodePath } from '@/domain/tree';
import {
	expandAllFeature,
	hotkeysCoreFeature,
	searchFeature,
	selectionFeature,
	syncDataLoaderFeature,
	dragAndDropFeature,
	keyboardDragAndDropFeature,
	renamingFeature,
	createOnDropHandler,
	propMemoizationFeature,
	ItemInstance,
} from '@headless-tree/core';
import { useDebounceCallback } from '@/hooks/use-debounce-callback';

interface ItemTreeProps
{
	indent?: number;
}

export function ItemTree({ indent = 16 }: ItemTreeProps)
{
	const router = useRouter();
	const pathname = usePathname();

	const { activeCollection: collection } = useCollectionsContext();
	const { nodes, mutateNode, refresh } = useTreeNodes();

	const [expandedItems, setExpandedItems] = useLocalStorage<string[]>(`tree-expanded-items-${collection.id}`, []);

	// Track the previous nodes to detect slug changes
	const prevNodesRef = useRef<Record<string, Node>>({});

	const tree = useTree<Node>({
		state: {
			expandedItems: expandedItems,
		},
		setExpandedItems: setExpandedItems,
		dataLoader: {
			getItem: (id: string) => getItem(id, nodes),
			getChildren: (id: string) => getItemChildren(id, nodes),
		},
		features: [
			syncDataLoaderFeature,
			hotkeysCoreFeature,
			selectionFeature,
			searchFeature,
			filterFeature,
			expandAllFeature,
			dragAndDropFeature,
			keyboardDragAndDropFeature,
			renamingFeature,
			removeDefaultExpandFeature,
			propMemoizationFeature,
		],
		getItemName: (item) =>
		{
			const node = item.getItemData();
			return node.name;
		},
		isItemFolder: (item) =>
		{
			const node = item.getItemData();

			if (node.children && node.children.length > 0)
			{
				return true;
			}

			if (node.type === 'folder' || node.type === 'collection')
			{
				return true;
			}

			return false;
		},
		onItemCreated: (item, parent) =>
		{
			if (!parent.isExpanded())
			{
				parent.expand();
			}

			item.startRenaming();
		},
		isSearchMatchingItem: (search, item) =>
		{
			const itemName = item.getItemName().toLowerCase();
			return itemName.startsWith(search.toLowerCase());
		},
		canDrop(items, target)
		{
			const targetNode = target.item.getItemData();

			for (const item of items)
			{
				const itemNode = item.getItemData();

				if (itemNode.type === 'recipe' && targetNode.id !== item.getParent()?.getId())
				{
					return false;
				}

				if (itemNode.type === 'item' && targetNode.type === 'item')
				{
					return false;
				}

				if (itemNode.type === 'item' && targetNode.type === 'recipe')
				{
					return false;
				}
			}

			return true;
		},
		onDrop: createOnDropHandler((parentItem, newChildrenIds) =>
		{
			mutateNode(parentItem.getId(), { children: newChildrenIds }, { revalidate: false });

			const recipes: { id: string; order: number }[] = [];
			const items: { id: string; order: number }[] = [];
			const folders: { id: string; order: number }[] = [];

			for (let i = 0; i < newChildrenIds.length; i++)
			{
				const nodeId = newChildrenIds[i];
				const node = nodes[nodeId];

				switch (node.type)
				{
					case 'recipe':
						recipes.push({ id: node.id, order: i });
						break;
					case 'item':
						items.push({ id: node.id, order: i });
						break;
					case 'folder':
						folders.push({ id: node.id, order: i });
						break;
					default:
						throw new Error(`Cannot move node of type '${node.type}'`);
				}
			}

			const parentNode = parentItem.getItemData();
			const parentNodeId = parentNode.type === 'collection' ? null : parentNode.id;

			Promise.all([
				recipes.length ? reorderRecipes({ itemId: parentNode.id, recipeOrders: recipes }) : null,
				items.length ? moveAndReorderItems({ newFolderId: parentNodeId, itemOrders: items }) : null,
				folders.length ? moveAndReorderFolders({ newParentFolderId: parentNodeId, folderOrders: folders }) : null,
			]).then(() =>
			{
				refresh();
			});
		}),
		onRename: async (item, newName) =>
		{
			const parsedName = await nameSchema.parseAsync(newName);
			const node = item.getItemData();

			// Optimistic UI update
			mutateNode(node.id, { name: parsedName }, { revalidate: false });

			// Rename based on node type
			const renamed = await (async () =>
			{
				switch (node.type)
				{
					case 'collection':
						return renameCollection({ collectionId: node.id, newName: parsedName });
					case 'folder':
						return renameFolder({ folderId: node.id, newName: parsedName });
					case 'item':
						return renameItem({ itemId: node.id, newName: parsedName });
					case 'recipe':
						return updateRecipe({ id: node.id, data: { name: parsedName } });
					default:
						return null;
				}
			})();

			// Update with actual values from server
			if (renamed)
			{
				mutateNode(node.id, { name: renamed.name, slug: renamed.slug }, { revalidate: false });
			}
		},
		rootItemId: `dummy-${collection.id}`,
		indent,
	});

	const { setSearch, expandAll } = tree;

	const [localSearchValue, setLocalSearchValue] = useState('');

	useEffect(() =>
	{
		tree.rebuildTree();
	}, [nodes]);

	useEffect(() =>
	{
		// Only run when we're viewing a specific path (not just the collection root)
		if (!pathname.includes('/collections/')) return;

		const pathParts = pathname.split('/').filter(Boolean);
		const collectionsIndex = pathParts.indexOf('collections');

		if (collectionsIndex === -1) return;

		// Extract the path segments from URL
		const urlSegments = pathParts.slice(collectionsIndex + 1);

		if (urlSegments.length === 0) return;

		// Check if any nodes have been deleted
		const deletedNodeIds = Object.keys(prevNodesRef.current).filter((nodeId) => prevNodesRef.current[nodeId] && !nodes[nodeId]);

		// Check if any nodes have changed slugs
		let nodeWithChangedSlug: Node | null = null;

		for (const nodeId in nodes)
		{
			const currentNode = nodes[nodeId];
			const previousNode = prevNodesRef.current[nodeId];

			// If this node's slug has changed
			if (previousNode && currentNode && previousNode.slug !== currentNode.slug)
			{
				// Check if this node or any ancestor is in the current path
				const currentPath = getNodePath(nodes, currentNode.id);

				// If any part of the current path matches a segment that changed, we need to update
				let isInCurrentPath = false;
				for (let i = 0; i < Math.min(currentPath.length, urlSegments.length); i++)
				{
					if (currentPath[i] === currentNode.slug && urlSegments[i] === previousNode.slug)
					{
						isInCurrentPath = true;
						break;
					}
				}

				if (isInCurrentPath)
				{
					nodeWithChangedSlug = currentNode;
					break;
				}
			}
		}

		// Handle deletions first
		if (deletedNodeIds.length > 0)
		{
			// Try to find the current node using URL segments
			let currentNode: Node | null = null;
			const pathToCurrentNode: Node[] = []; // Track the path for finding parent

			for (let i = 0; i < urlSegments.length; i++)
			{
				const segment = urlSegments[i];
				let nextNode: Node | null = null;

				if (currentNode)
				{
					const children: string[] = currentNode.children || [];
					for (const childId of children)
					{
						const childNode: Node | undefined = nodes[childId];
						if (childNode && childNode.slug === segment)
						{
							nextNode = childNode;
							break;
						}
					}
				}
				else
				{
					// At root level, look for collection
					for (const n of Object.values(nodes))
					{
						if (n.type === 'collection' && n.slug === segment)
						{
							nextNode = n;
							break;
						}
					}
				}

				if (!nextNode)
				{
					// Node not found - check if it was deleted
					const wasDeleted = deletedNodeIds.some((deletedId) =>
					{
						const deletedNode = prevNodesRef.current[deletedId];
						return deletedNode && deletedNode.slug === segment;
					});

					if (wasDeleted)
					{
						// Find a redirect target
						let redirectTarget: Node | null = null;

						// Try to find a sibling (if we have a parent)
						if (currentNode && currentNode.children)
						{
							const siblings = currentNode.children.map((childId) => nodes[childId]).filter((n): n is Node => n !== undefined);

							if (siblings.length > 0)
							{
								// Redirect to first sibling
								redirectTarget = siblings[0];
							}
						}

						// If no siblings, traverse up to parent, grandparent, etc.
						if (!redirectTarget)
						{
							// Start from the last valid node in the path
							for (let j = pathToCurrentNode.length - 1; j >= 0; j--)
							{
								const ancestor = pathToCurrentNode[j];
								if (ancestor && nodes[ancestor.id])
								{
									redirectTarget = ancestor;
									break;
								}
							}
						}

						// If still no target, go to collection root
						if (!redirectTarget)
						{
							redirectTarget = nodes[collection.id];
						}

						if (redirectTarget)
						{
							const newPath = getNodePath(nodes, redirectTarget.id);
							const newPathname = `/collections/${newPath.join('/')}`;
							router.replace(newPathname);
							// Update previous nodes and exit early
							prevNodesRef.current = { ...nodes };
							return;
						}
					}
					break;
				}

				if (nextNode)
				{
					pathToCurrentNode.push(nextNode);
					currentNode = nextNode;
				}
			}
		}

		// Handle renames if we detected a slug change in the current path
		if (nodeWithChangedSlug)
		{
			// Try to find the node we're currently viewing by reconstructing the path
			// We'll traverse using the OLD slugs (from URL) as much as possible,
			// then use node IDs when we hit the renamed node
			let currentNode: Node | null = null;

			for (let i = 0; i < urlSegments.length; i++)
			{
				const segment = urlSegments[i];
				let nextNode: Node | null = null;

				if (currentNode)
				{
					const children: string[] = currentNode.children || [];
					// Try to find by current slug first
					for (const childId of children)
					{
						const childNode: Node | undefined = nodes[childId];
						if (childNode && childNode.slug === segment)
						{
							nextNode = childNode;
							break;
						}
					}

					// If not found by slug, check if any child's previous slug matches
					if (!nextNode)
					{
						for (const childId of children)
						{
							const childNode: Node | undefined = nodes[childId];
							const prevChild: Node | undefined = prevNodesRef.current[childId];
							if (childNode && prevChild && prevChild.slug === segment)
							{
								nextNode = childNode;
								break;
							}
						}
					}
				}
				else
				{
					// At root level, look for collection
					for (const n of Object.values(nodes))
					{
						if (n.type === 'collection' && n.slug === segment)
						{
							nextNode = n;
							break;
						}
					}

					// Try with previous slug
					if (!nextNode)
					{
						for (const n of Object.values(nodes))
						{
							const prevNode = prevNodesRef.current[n.id];
							if (n.type === 'collection' && prevNode && prevNode.slug === segment)
							{
								nextNode = n;
								break;
							}
						}
					}
				}

				if (!nextNode) break;
				currentNode = nextNode;
			}

			// If we found the node, redirect to its current path
			if (currentNode)
			{
				const actualPath = getNodePath(nodes, currentNode.id);
				const newPathname = `/collections/${actualPath.join('/')}`;

				if (newPathname !== pathname)
				{
					router.replace(newPathname);
				}
			}
		}

		// Update the previous nodes reference
		prevNodesRef.current = { ...nodes };
	}, [nodes, pathname, router, collection.id]);

	const performSearch = useCallback(
		(searchValue: string) =>
		{
			setSearch(searchValue);

			if (searchValue.length > 0)
			{
				expandAll();
			}
		},
		[setSearch, expandAll],
	);

	const debouncedSearch = useDebounceCallback(performSearch, 500);

	const onSearchChanged = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
		{
			const value = e.target.value;
			setLocalSearchValue(value);
			debouncedSearch(value);
		},
		[debouncedSearch],
	);

	return (
		<div className="flex h-full min-h-0 flex-col gap-2">
			<div className="flex gap-2">
				{/* Search Bar */}
				<div className="relative flex-1">
					<Input className="peer ps-9" value={localSearchValue} onChange={onSearchChanged} type="search" placeholder="Filter items..." />
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<FilterIcon className="size-4" />
					</div>
				</div>
			</div>

			{/* Tree */}
			<Tree indent={indent} tree={tree} className="no-scrollbar h-full min-h-0 overflow-y-auto">
				<TreeNodes searchValue={tree.getSearchValue()} items={tree.getFilteredItems()} />
				<TreeDragLine />
			</Tree>
		</div>
	);
}

interface TreeNodesProps
{
	searchValue: string;
	items: ItemInstance<Node>[];
}

function TreeNodes({ searchValue, items }: TreeNodesProps)
{
	if (searchValue && items.length === 0)
	{
		return <p className="px-3 py-4 text-center text-sm">No items found for &quot;{searchValue}&quot;</p>;
	}

	return items.map((item) =>
	{
		return <ItemTreeNode key={item.getId()} item={item} />;
	});
}

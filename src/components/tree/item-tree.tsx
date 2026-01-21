'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { ItemTreeNode } from '@/components/tree';
import { useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { removeDefaultExpandFeature } from '@/components/tree/features';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { renameCollection } from '@/domain/collection';
import { renameFolder } from '@/domain/folder';
import { nameSchema } from '@/domain/shared';
import { Node } from '@/domain/tree';
import { usePathname, useRouter } from 'next/navigation';
import { renameItem } from '@/domain/item';
import { updateRecipe } from '@/domain/recipe';
import { getItem, getItemChildren, getItemName, isItemFolder } from './item-tree.utils';
import { getVisibleItems, shouldShowItem } from './item-tree.search';
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
} from '@headless-tree/core';

export function ItemTree({ indent = 16 }: { indent?: number })
{
	const router = useRouter();
	const pathname = usePathname();

	const { activeCollection: collection } = useCollectionsContext();
	const { nodes, mutateNodes } = useTreeNodes();

	const [expandedItems, setExpandedItems] = useLocalStorage<string[]>(`tree-expanded-items-${collection.id}`, []);

	// Track the previous nodes to detect slug changes
	const prevNodesRef = useRef<Record<string, Node>>({});

	const updateNode = ({ nodeId, name, slug, children }: { nodeId: string; name?: string; slug?: string; children?: string[] }) =>
	{
		mutateNodes(
			(prevNodes) =>
			{
				if (!prevNodes) return prevNodes;
				return {
					...prevNodes,
					[nodeId]: {
						...prevNodes[nodeId],
						...(name !== undefined && { name }),
						...(slug !== undefined && { slug }),
						...(children !== undefined && { children }),
					},
				};
			},
			{ revalidate: false },
		);
	};

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
			expandAllFeature,
			dragAndDropFeature,
			keyboardDragAndDropFeature,
			renamingFeature,
			removeDefaultExpandFeature,
			propMemoizationFeature,
		],
		getItemName: (item) => getItemName(item.getItemData()),
		isItemFolder: (item) => isItemFolder(item.getItemData()),
		isSearchMatchingItem: (search, item) =>
		{
			const itemName = item.getItemName().toLowerCase();
			return itemName.includes(search.toLowerCase());
		},
		onDrop: createOnDropHandler((parentItem, newChildrenIds) =>
		{
			updateNode({ nodeId: parentItem.getId(), children: newChildrenIds });
		}),
		onRename: async (item, newName) =>
		{
			const parsedName = await nameSchema.parseAsync(newName);

			const node = item.getItemData();

			// Optimistic UI update
			updateNode({ nodeId: node.id, name: parsedName });

			switch (node.type)
			{
				case 'collection':
				{
					const renamedCollection = await renameCollection({
						collectionId: node.id,
						newName: parsedName,
					});

					updateNode({
						nodeId: node.id,
						name: renamedCollection.name,
						slug: renamedCollection.slug,
					});

					break;
				}
				case 'folder':
				{
					const renamedFolder = await renameFolder({
						folderId: node.id,
						newName: parsedName,
					});

					updateNode({
						nodeId: node.id,
						name: renamedFolder.name,
						slug: renamedFolder.slug,
					});

					break;
				}
				case 'item':
				{
					const renamedItem = await renameItem({
						itemId: node.id,
						newName: parsedName,
					});

					updateNode({
						nodeId: node.id,
						name: renamedItem.name,
						slug: renamedItem.slug,
					});

					break;
				}
				case 'recipe':
				{
					const renamedRecipe = await updateRecipe({
						id: node.id,
						data: {
							name: parsedName,
						},
					});

					updateNode({
						nodeId: node.id,
						name: renamedRecipe.name,
						slug: renamedRecipe.slug,
					});

					break;
				}
				default:
					break;
			}
		},
		rootItemId: `dummy-${collection.id}`,
		indent,
	});

	const searchValue = tree.getSearchValue();
	const matchingItems = tree.getSearchMatchingItems();
	const visibleItems = getVisibleItems(searchValue || '', matchingItems, tree, nodes);

	useEffect(() =>
	{
		if (searchValue && searchValue.length > 0)
		{
			tree.expandAll();
		}
	}, [searchValue]);

	useEffect(() =>
	{
		tree.rebuildTree();
	}, [nodes]);

	// Synchronize pathname with current node slugs after renames and deletions
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
				const currentPath = getNodePath(nodes, currentNode);

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
							const newPath = getNodePath(nodes, redirectTarget);
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
				const actualPath = getNodePath(nodes, currentNode);
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

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		const value = e.target.value;
		tree.setSearch(value || null);
	};

	const displayNodes = () =>
	{
		if (searchValue && visibleItems.size === 0)
		{
			return <p className="px-3 py-4 text-center text-sm">No items found for &quot;{searchValue}&quot;</p>;
		}

		return tree.getItems().map((item) =>
		{
			const isVisible = shouldShowItem(item.getId(), searchValue || '', visibleItems);
			return <ItemTreeNode key={item.getId()} item={item} visible={isVisible} />;
		});
	};

	return (
		<div className="flex h-full flex-col gap-2">
			<div className="flex gap-2">
				{/* Search Bar */}
				<div className="relative flex-1">
					<Input className="peer ps-9" value={tree.getSearchValue() || ''} onChange={handleSearchChange} type="search" placeholder="Filter items..." />
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<FilterIcon className="size-4" />
					</div>
				</div>
			</div>

			{/* Tree */}
			<Tree indent={indent} tree={tree}>
				<AssistiveTreeDescription tree={tree} />
				{displayNodes()}
				<TreeDragLine />
			</Tree>
		</div>
	);
}

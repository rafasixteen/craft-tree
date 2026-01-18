'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { ItemTreeNode } from '@/components/tree';
import { useCallback, useEffect, useState } from 'react';
import { doubleClickExpandFeature, onChangeFeature, nodeDropdownsFeature } from '@/components/tree/features';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { FilterIcon, PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collection, renameCollection } from '@/domain/collection';
import { getTreeNodes, Node } from '@/domain/tree';
import { createFolder, getTopLevelFolders, renameFolder } from '@/domain/folder';
import { nameSchema } from '@/domain/shared';
import { usePathname, useRouter } from 'next/navigation';
import { renameItem } from '@/domain/item';
import { renameRecipe } from '@/domain/recipe';
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
} from '@headless-tree/core';

interface ItemTreeProps
{
	collection: Collection;
	indent?: number;
}

export function ItemTree({ collection, indent = 16 }: ItemTreeProps)
{
	const router = useRouter();
	const pathname = usePathname();

	const [nodes, setNodes] = useState<Record<string, Node>>({});

	const loadNodes = useCallback(async () =>
	{
		try
		{
			const nodesFromDb = await getTreeNodes(collection.id);
			const nodes: Record<string, Node> = {};

			// const topLevelFolders = await getTopLevelFolders(collection.id);

			// Create collection node
			const collectionNode: Node = {
				id: collection.id,
				name: collection.name,
				slug: collection.slug,
				type: 'collection',
				// children: topLevelFolders.map((folder) => folder.id),
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
						folderParentPairs.push({ parentId: row.parent_folder_id, childId: row.folder_id });
					}
				}
				else
				{
					// Top-level folder - add to collection node
					if (!collectionNode.children.includes(row.folder_id))
					{
						collectionNode.children.push(row.folder_id);
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
							collectionNode.children.push(row.item_id);
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

			setNodes(nodes);
		}
		catch (error)
		{
			console.error('Error loading tree nodes:', error);
		}
	}, [collection]);

	function getItem(id: string): Node
	{
		return nodes[id] || { name: 'Loading...', children: [] };
	}

	function getItemChildren(id: string): string[]
	{
		const node = nodes[id];

		if (!node)
		{
			return [];
		}

		if (node.type === 'recipe')
		{
			return [];
		}

		return node.children || [];
	}

	function isItemFolder(item: Node): boolean
	{
		if (item.type === 'folder' || item.type === 'collection')
		{
			return true;
		}

		if (item.type === 'item' && item.children && item.children.length > 0)
		{
			return true;
		}

		return false;
	}

	function getItemName(item: Node): string
	{
		return item.name;
	}

	const tree = useTree<Node>({
		dataLoader: {
			getItem: getItem,
			getChildren: getItemChildren,
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
			doubleClickExpandFeature,
			onChangeFeature,
			nodeDropdownsFeature,
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
			setNodes((prevNodes) => ({
				...prevNodes,
				[parentItem.getId()]: {
					...prevNodes[parentItem.getId()],
					children: newChildrenIds,
				},
			}));
		}),
		onRename: async (item, newName) =>
		{
			const parsedName = await nameSchema.parseAsync(newName);

			const node = item.getItemData();

			setNodes((prevNodes) => ({
				...prevNodes,
				[node.id]: {
					...prevNodes[node.id],
					name: parsedName,
				},
			}));

			switch (node.type)
			{
				case 'collection':
				{
					const renamedCollection = await renameCollection({ collectionId: node.id, newName: parsedName });
					const nextPath = replaceSegment(pathname, 'collections', renamedCollection.slug);
					router.replace(nextPath);
					break;
				}
				case 'folder':
				{
					const renamedFolder = await renameFolder({ folderId: node.id, newName: parsedName });
					const nextPath = replaceSegment(pathname, 'folders', renamedFolder.slug);
					router.replace(nextPath);
					break;
				}
				case 'item':
				{
					const renamedItem = await renameItem({ itemId: node.id, newName: parsedName });
					const nextPath = replaceSegment(pathname, 'items', renamedItem.slug);
					router.replace(nextPath);
					break;
				}
				case 'recipe':
				{
					const renamedRecipe = await renameRecipe({ recipeId: node.id, newName: parsedName });
					const nextPath = replaceSegment(pathname, 'recipes', renamedRecipe.slug);
					router.replace(nextPath);
					break;
				}
				default:
					break;
			}
		},
		rootItemId: `dummy-${collection.id}`,
		indent,
		onChange: loadNodes,
	});

	const searchValue = tree.getSearchValue();

	// Calculate which items should be visible based on search
	const getVisibleItems = () =>
	{
		if (!searchValue || searchValue.length === 0)
		{
			return new Set<string>();
		}

		// Get matching items using the searchFeature's built-in matching
		const matchingItems = tree.getSearchMatchingItems();
		const directMatches = matchingItems.map((item) => item.getId());
		const visibleIds = new Set<string>(directMatches);

		// Add all parent IDs of matching items
		for (const matchId of directMatches)
		{
			let item = tree.getItems().find((i) => i.getId() === matchId);

			while (item?.getParent?.())
			{
				const parent = item.getParent();
				if (parent)
				{
					visibleIds.add(parent.getId());
					item = parent;
				}
				else
				{
					break;
				}
			}
		}

		// Add all children of matching items
		for (const matchId of directMatches)
		{
			const item = tree.getItems().find((i) => i.getId() === matchId);

			if (item?.isFolder())
			{
				const getDescendants = (itemId: string) =>
				{
					const children = nodes[itemId]?.children || [];

					for (const childId of children)
					{
						visibleIds.add(childId);

						if (nodes[childId]?.children?.length)
						{
							getDescendants(childId);
						}
					}
				};

				getDescendants(item.getId());
			}
		}

		return visibleIds;
	};

	const visibleItems = getVisibleItems();

	const shouldShowItem = (itemId: string) =>
	{
		if (!searchValue || searchValue.length === 0) return true;
		return visibleItems.has(itemId);
	};

	useEffect(() =>
	{
		if (searchValue && searchValue.length > 0)
		{
			tree.expandAll();
		}
	}, [searchValue, tree]);

	useEffect(() =>
	{
		// Force an initial onChange to load data.
		tree.getConfig().onChange?.();
	}, [tree]);

	useEffect(() =>
	{
		tree.rebuildTree();
	}, [nodes, tree]);

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
			const isVisible = shouldShowItem(item.getId());
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

				{/* Plus Icon */}
				<Button
					variant="ghost"
					size="icon"
					onClick={() =>
					{
						createFolder({ name: 'New Folder', collectionId: collection.id, parentFolderId: null });
						tree.getConfig().onChange?.();
					}}
				>
					<PlusIcon className="size-4" />
				</Button>
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

function replaceSegment(pathname: string, segmentKey: 'collections' | 'folders' | 'items' | 'recipes', newSlug: string)
{
	const parts = pathname.split('/');

	const index = parts.indexOf(segmentKey);
	if (index === -1) return pathname;

	// Replace the slug right after the segment key
	parts[index + 1] = newSlug;

	return parts.join('/');
}

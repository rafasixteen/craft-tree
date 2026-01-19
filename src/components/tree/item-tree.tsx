'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { ItemTreeNode } from '@/components/tree';
import { useCallback, useEffect, useState } from 'react';
import { doubleClickExpandFeature, onChangeFeature, nodeDropdownsFeature } from '@/components/tree/features';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { renameCollection } from '@/domain/collection';
import { Node } from '@/domain/tree';
import { renameFolder } from '@/domain/folder';
import { nameSchema } from '@/domain/shared';
import { usePathname, useRouter } from 'next/navigation';
import { renameItem } from '@/domain/item';
import { renameRecipe } from '@/domain/recipe';
import { loadTreeNodesData } from './item-tree.loader';
import { getItem, getItemChildren, getItemName, isItemFolder, replaceSegment } from './item-tree.utils';
import { getVisibleItems, shouldShowItem } from './item-tree.search';
import { useCollectionContext } from '@/providers/collection-context';
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

export function ItemTree({ indent = 16 }: { indent?: number })
{
	const router = useRouter();
	const pathname = usePathname();

	const { activeCollection: collection } = useCollectionContext();
	const [nodes, setNodes] = useState<Record<string, Node>>({});

	const loadNodes = useCallback(async () =>
	{
		const loadedNodes = await loadTreeNodesData(collection);
		setNodes(loadedNodes);
	}, [collection, setNodes]);

	const tree = useTree<Node>({
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
	const matchingItems = tree.getSearchMatchingItems();
	const visibleItems = getVisibleItems(searchValue || '', matchingItems, tree, nodes);

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

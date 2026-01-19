'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { ItemTreeNode } from '@/components/tree';
import { useEffect } from 'react';
import { doubleClickExpandFeature, nodeDropdownsFeature } from '@/components/tree/features';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { renameCollection } from '@/domain/collection';
import { renameFolder } from '@/domain/folder';
import { nameSchema } from '@/domain/shared';
import { Node } from '@/domain/tree';
import { usePathname, useRouter } from 'next/navigation';
import { renameItem } from '@/domain/item';
import { renameRecipe } from '@/domain/recipe';
import { getItem, getItemChildren, getItemName, isItemFolder, replaceSegment } from './item-tree.utils';
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
} from '@headless-tree/core';

export function ItemTree({ indent = 16 }: { indent?: number })
{
	const router = useRouter();
	const pathname = usePathname();

	const { activeCollection: collection } = useCollectionsContext();
	const { nodes, mutateNodes } = useTreeNodes();

	const updateNode = ({ nodeId, name, slug, children }: { nodeId: string; name?: string; slug?: string; children?: string[] }) =>
	{
		mutateNodes(
			(prevNodes) => ({
				...prevNodes,
				[nodeId]: {
					...prevNodes[nodeId],
					...(name !== undefined && { name }),
					...(slug !== undefined && { slug }),
					...(children !== undefined && { children }),
				},
			}),
			{ revalidate: false },
		);
	};

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
			updateNode({ nodeId: parentItem.getId(), children: newChildrenIds });
		}),
		onRename: async (item, newName) =>
		{
			const parsedName = await nameSchema.parseAsync(newName);

			const node = item.getItemData();
			const oldNodePath = getNodePath(nodes, node);
			console.log('Old node path:', oldNodePath);

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

					// Replace the collection slug (first segment after /collections/)
					const pathParts = pathname.split('/').filter(Boolean);
					const collectionIndex = pathParts.indexOf('collections') + 1;
					pathParts[collectionIndex] = renamedCollection.slug;
					const nextPath = '/' + pathParts.join('/');

					router.replace(nextPath);
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

					const newNodePath = getNodePath(nodes, { ...node, name: renamedFolder.name, slug: renamedFolder.slug });
					console.log('New node path:', newNodePath);

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
					const renamedRecipe = await renameRecipe({
						recipeId: node.id,
						newName: parsedName,
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
	}, [searchValue, tree]);

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

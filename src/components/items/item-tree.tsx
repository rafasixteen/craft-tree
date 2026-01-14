'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { ItemTreeNode } from '@/components/items';
import { useEffect, useState } from 'react';
import { doubleClickExpandFeature, testFeature } from '@/components/items/features';
import { Tree, TreeDragLine } from '@/components/ui/tree';
import { FilterIcon, PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFoldersFromCollection } from '@/domain/folder';
import { TreeItemNode } from '@/components/items';
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
import { Collection } from '@/domain/collection';

const initialItems: Record<string, TreeItemNode> = {
	apis: { name: 'APIs' },
	backend: { children: ['apis', 'infrastructure'], name: 'Backend' },
	company: {
		children: ['engineering', 'marketing', 'operations'],
		name: 'Company',
	},
	components: { name: 'Components' },
	content: { name: 'Content' },
	'design-system': {
		children: ['components', 'tokens', 'guidelines'],
		name: 'Design System',
	},
	engineering: {
		children: ['frontend', 'backend', 'platform-team'],
		name: 'Engineering',
	},
	finance: { name: 'Finance' },
	frontend: { children: ['design-system', 'web-platform'], name: 'Frontend' },
	guidelines: { name: 'Guidelines' },
	hr: { name: 'HR' },
	infrastructure: { name: 'Infrastructure' },
	marketing: { children: ['content', 'seo'], name: 'Marketing' },
	operations: { children: ['hr', 'finance'], name: 'Operations' },
	'platform-team': { name: 'Platform Team' },
	seo: { name: 'SEO' },
	tokens: { name: 'Tokens' },
	'web-platform': { name: 'Web Platform' },
};

interface ItemTreeProps
{
	collection: Collection;
	indent?: number;
}

export function ItemTree({ collection, indent = 16 }: ItemTreeProps)
{
	const [nodes, setNodes] = useState<Record<string, TreeItemNode>>({});

	function getItem(id: string): TreeItemNode
	{
		const node = nodes[id];

		if (!node)
		{
			return {
				name: 'Unknown',
				children: [],
			};
		}

		return node;
	}

	function getItemChildren(id: string): string[]
	{
		const node = nodes[id];
		return node?.children || [];
	}

	const tree = useTree<TreeItemNode>({
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
			testFeature,
		],
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
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
		onRename: (item, newName) =>
		{
			// Update the item name in our state
			const itemId = item.getId();
			setNodes((prevNodes) => ({
				...prevNodes,
				[itemId]: {
					...prevNodes[itemId],
					name: newName,
				},
			}));

			// TODO: If we are in the item href link (e.g., /collections/new-collection/items/{item-name}),
			// we should also update the URL to reflect the new name.
		},
		rootItemId: collection.id,
		indent,
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
		getFoldersFromCollection(collection.id)
			.then((folders) =>
			{
				console.log('Loaded folders:', folders);

				const root: TreeItemNode = {
					name: 'Root',
					children: folders.map((folder) => folder.id),
				};

				const loadedItems: Record<string, TreeItemNode> = {
					[collection.id]: root,
				};

				for (const folder of folders)
				{
					loadedItems[folder.id] = {
						name: folder.name,
						children: [],
					};
				}

				console.log('Setting items:', loadedItems);
				setNodes(loadedItems);

				// Notify the tree to refresh with new data
				tree.rebuildTree();
			})
			.catch((error) =>
			{
				console.error('Error loading folders:', error);
			});
	}, [collection.id, tree]);

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
			console.log(`Item ${item.getId()} visibility: ${isVisible}`);
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
						tree.createFolder('Test Folder', collection.id, null);
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

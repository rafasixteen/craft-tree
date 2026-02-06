'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInventory, InventoryTreeNode } from '@/domain/inventory';
import { useTree } from '@headless-tree/react';
import { InventoryTreeNodeComp, filterFeature, toggleFeature } from '@/components/inventory-tree';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
	syncDataLoaderFeature,
	selectionFeature,
	hotkeysCoreFeature,
	propMemoizationFeature,
	dragAndDropFeature,
	keyboardDragAndDropFeature,
	renamingFeature,
	searchFeature,
	expandAllFeature,
	TreeInstance,
	createOnDropHandler,
} from '@headless-tree/core';

export function InventoryTree()
{
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { inventory, setChildren, renameNode } = useInventory();

	const headlessTreeData = useMemo(() =>
	{
		const dummyNode: InventoryTreeNode = {
			id: `dummy-${inventory.rootNodeId}`,
			name: 'Inventory',
			slug: 'dummy-root',
			type: 'dummy',
			children: [inventory.rootNodeId],
		};

		return {
			...inventory,
			rootNodeId: dummyNode.id,
			nodes: { ...inventory.nodes, [dummyNode.id]: dummyNode },
		};
	}, [inventory]);

	const [expandedItems, setExpandedItems] = useLocalStorage<string[]>(`tree-expanded-items-${inventory.rootNodeId}`, []);

	const [searchValue, setSearchValue] = useState<string>(searchParams.get('search') ?? '');
	const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

	const headlessTree = useTree<InventoryTreeNode>({
		state: {
			expandedItems: expandedItems,
		},
		setExpandedItems: setExpandedItems,
		rootItemId: headlessTreeData.rootNodeId,
		canReorder: true,
		indent: 20,
		dataLoader: {
			getItem(id)
			{
				return headlessTreeData.nodes[id] || { name: '', children: [] };
			},
			getChildren(itemId)
			{
				return headlessTreeData.nodes[itemId]?.children || [];
			},
		},
		features: [
			syncDataLoaderFeature,
			selectionFeature,
			hotkeysCoreFeature,
			propMemoizationFeature,
			dragAndDropFeature,
			keyboardDragAndDropFeature,
			renamingFeature,
			searchFeature,
			filterFeature,
			toggleFeature,
			expandAllFeature,
		],
		getItemName(item)
		{
			const node = item.getItemData();
			return node.name;
		},
		isItemFolder(item)
		{
			const node = item.getItemData();
			return ['collection', 'folder', 'item'].includes(node.type);
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
			setChildren(parentItem.getId(), newChildrenIds);
		}),
		onRename(item, value)
		{
			renameNode(item.getItemData(), value);
		},
	});

	useEffect(() =>
	{
		const id = setTimeout(() =>
		{
			setDebouncedSearch(searchValue);
		}, 300);

		return () => clearTimeout(id);
	}, [searchValue]);

	useEffect(() =>
	{
		headlessTree.expandAll();
		headlessTree.setSearch(debouncedSearch);

		const params = new URLSearchParams();

		if (debouncedSearch)
		{
			params.set('search', debouncedSearch);
		}

		const queryString = params.toString();

		router.replace(queryString ? `${pathname}?${queryString}` : pathname);
	}, [debouncedSearch, headlessTree, pathname, router]);

	useEffect(() =>
	{
		headlessTree.rebuildTree();
	}, [headlessTreeData, headlessTree]);

	return (
		<>
			{/* Search Bar */}
			<div className="flex">
				<div className="relative flex-1">
					<Input className="peer ps-9" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="search" placeholder="Filter items..." />
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<FilterIcon className="size-4" />
					</div>
				</div>
			</div>

			{/* Tree */}
			<div {...headlessTree.getContainerProps()} className="no-scrollbar flex flex-col overflow-y-auto">
				<InventoryTreeNodes tree={headlessTree} />
				<div
					style={headlessTree.getDragLineStyle()}
					className="
						absolute z-30 -mt-px h-0.5
						bg-primary
						before:absolute before:-top-0.75 before:left-0
						before:size-2 before:rounded-full before:border-2
						before:border-primary before:bg-background
					"
				/>
			</div>
		</>
	);
}

interface InventoryTreeNodesProps
{
	tree: TreeInstance<InventoryTreeNode>;
}

function InventoryTreeNodes({ tree }: InventoryTreeNodesProps)
{
	const searchValue = tree.getSearchValue();
	const items = tree.getFilteredItems();

	if (searchValue && items.length === 0)
	{
		return <p className="px-3 py-4 text-center text-sm">No items found for &quot;{searchValue}&quot;</p>;
	}

	return items.map((item) =>
	{
		return <InventoryTreeNodeComp key={item.getId()} item={item} />;
	});
}

'use client';

import {
	createOnDropHandler,
	dragAndDropFeature,
	expandAllFeature,
	hotkeysCoreFeature,
	keyboardDragAndDropFeature,
	searchFeature,
	selectionFeature,
	syncDataLoaderFeature,
	type TreeState,
} from '@headless-tree/core';
import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { CircleXIcon, FilterIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from '@/components/ui/tree';

interface Item
{
	name: string;
	children?: string[];
}

const initialItems: Record<string, Item> = {
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

const indent = 20;

interface ItemTreeV2Props
{
	searchValue: string;
}

export default function ItemTreeV2({ searchValue }: ItemTreeV2Props)
{
	const initialExpandedItems = ['engineering', 'frontend', 'design-system'];

	const [items, setItems] = useState(initialItems);
	const [state, setState] = useState<Partial<TreeState<Item>>>({});
	const [filteredItems, setFilteredItems] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const tree = useTree<Item>({
		canReorder: true,
		dataLoader: {
			getChildren: (id) => items[id].children ?? [],
			getItem: (id) => items[id],
		},
		features: [syncDataLoaderFeature, selectionFeature, searchFeature, expandAllFeature, hotkeysCoreFeature, dragAndDropFeature, keyboardDragAndDropFeature],
		getItemName: (i) => i.getItemData().name,
		indent,
		isItemFolder: (i) => (i.getItemData()?.children?.length ?? 0) > 0,
		initialState: {
			expandedItems: initialExpandedItems,
			selectedItems: ['components'],
		},
		rootItemId: 'company',
		state,
		setState,
		onDrop: createOnDropHandler((parent, newChildren) =>
		{
			setItems((prev) => ({
				...prev,
				[parent.getId()]: {
					...prev[parent.getId()],
					children: newChildren,
				},
			}));
		}),
	});

	const shouldShowItem = (id: string) =>
	{
		if (!searchValue) return true;
		return filteredItems.includes(id);
	};

	useEffect(() =>
	{
		if (!searchValue)
		{
			setFilteredItems([]);
			return;
		}

		const all = tree.getItems();

		const directMatches = all.filter((item) => item.getItemName().toLowerCase().includes(searchValue.toLowerCase())).map((item) => item.getId());

		const parentMatches = new Set<string>();
		for (const id of directMatches)
		{
			let item = all.find((i) => i.getId() === id);
			while (item?.getParent?.())
			{
				const parent = item.getParent();
				if (!parent) break;
				parentMatches.add(parent.getId());
				item = parent;
			}
		}

		const childrenMatches = new Set<string>();
		const getDesc = (id: string) =>
		{
			const c = items[id]?.children ?? [];
			for (const child of c)
			{
				childrenMatches.add(child);
				if (items[child]?.children?.length) getDesc(child);
			}
		};
		directMatches.forEach(getDesc);

		setFilteredItems([...directMatches, ...Array.from(parentMatches), ...Array.from(childrenMatches)]);

		const folders = all.filter((i) => i.isFolder()).map((i) => i.getId());

		setState((prev) => ({
			...prev,
			expandedItems: folders,
		}));
	}, [searchValue, tree, items]);

	return (
		<div className="flex h-full flex-col gap-2 *:first:grow">
			<Tree indent={indent} tree={tree}>
				<AssistiveTreeDescription tree={tree} />

				{searchValue && filteredItems.length === 0 ? (
					<p className="px-3 py-4 text-center text-sm">No items found for &quot;{searchValue}&quot;</p>
				) : (
					tree.getItems().map((item) =>
						{
						const visible = shouldShowItem(item.getId());

						return (
							<TreeItem key={item.getId()} item={item} className="data-[visible=false]:hidden" data-visible={visible}>
								<TreeItemLabel>
									<span className="flex items-center gap-2">
										{item.isFolder() &&
											(item.isExpanded() ? (
												<FolderOpenIcon className="size-4 text-muted-foreground" />
											) : (
												<FolderIcon className="size-4 text-muted-foreground" />
											))}
										{item.getItemName()}
									</span>
								</TreeItemLabel>
							</TreeItem>
						);
					})
				)}

				<TreeDragLine />
			</Tree>
		</div>
	);
}

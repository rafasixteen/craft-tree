'use client';

import { AssistiveTreeDescription, useTree } from '@headless-tree/react';
import { Item } from '@/components/items';
import { ItemTreeNode, SearchBar } from '@/components/items';
import { useEffect, useRef, useState } from 'react';
import { CircleXIcon, FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { doubleClickExpandFeature } from '@/components/items/features';
import { Tree, TreeDragLine } from '@/components/ui/tree';
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
	TreeState,
} from '@headless-tree/core';

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

export function ItemTree()
{
	const initialExpandedItems = ['engineering', 'frontend', 'design-system'];
	const [items, setItems] = useState(initialItems);
	const [state, setState] = useState<Partial<TreeState<Item>>>({});
	const [searchValue, setSearchValue] = useState('');
	const [filteredItems, setFilteredItems] = useState<string[]>([]);

	const tree = useTree<Item>({
		dataLoader: {
			getChildren: (itemId) => items[itemId].children ?? [],
			getItem: (itemId) => items[itemId],
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
		],
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
		onDrop: createOnDropHandler((parentItem, newChildrenIds) =>
		{
			setItems((prevItems) => ({
				...prevItems,
				[parentItem.getId()]: {
					...prevItems[parentItem.getId()],
					children: newChildrenIds,
				},
			}));
		}),
		onRename: (item, newName) =>
		{
			// Update the item name in our state
			const itemId = item.getId();
			setItems((prevItems) => ({
				...prevItems,
				[itemId]: {
					...prevItems[itemId],
					name: newName,
				},
			}));

			// TODO: If we are in the item href link (e.g., /collections/new-collection/items/{item-name}),
			// we should also update the URL to reflect the new name.
		},
		initialState: {
			expandedItems: ['engineering', 'frontend', 'design-system'],
			selectedItems: ['components'],
		},
		setState: setState,
		state: state,
		rootItemId: 'company',
		indent,
	});

	// This function determines if an item should be visible based on our custom filtering
	function shouldShowItem(itemId: string)
	{
		if (!searchValue || searchValue.length === 0) return true;
		return filteredItems.includes(itemId);
	}

	// Update filtered items when search value changes
	useEffect(() =>
	{
		if (!searchValue || searchValue.length === 0)
		{
			setFilteredItems([]);
			return;
		}

		// Get all items
		const allItems = tree.getItems();

		// First, find direct matches
		const directMatches = allItems
			.filter((item) =>
			{
				const name = item.getItemName().toLowerCase();
				return name.includes(searchValue.toLowerCase());
			})
			.map((item) => item.getId());

		// Then, find all parent IDs of matching items
		const parentIds = new Set<string>();
		for (const matchId of directMatches)
		{
			let item = tree.getItems().find((i) => i.getId() === matchId);

			while (item?.getParent?.())
			{
				const parent = item.getParent();
				if (parent)
				{
					parentIds.add(parent.getId());
					item = parent;
				}
				else
				{
					break;
				}
			}
		}

		// Find all children of matching items
		const childrenIds = new Set<string>();
		for (const matchId of directMatches)
		{
			const item = tree.getItems().find((i) => i.getId() === matchId);

			if (item?.isFolder())
			{
				const getDescendants = (itemId: string) =>
				{
					const children = items[itemId]?.children || [];

					for (const childId of children)
					{
						childrenIds.add(childId);

						if (items[childId]?.children?.length)
						{
							getDescendants(childId);
						}
					}
				};

				getDescendants(item.getId());
			}
		}

		// Combine direct matches, parents, and children
		setFilteredItems([...directMatches, ...Array.from(parentIds), ...Array.from(childrenIds)]);

		// Keep all folders expanded during search to ensure all matches are visible
		// Store current expanded state first
		const currentExpandedItems = tree.getState().expandedItems || [];

		// Get all folder IDs that need to be expanded to show matches
		const folderIdsToExpand = allItems.filter((item) => item.isFolder()).map((item) => item.getId());

		// Update expanded items in the tree state
		setState((prevState) => ({
			...prevState,
			expandedItems: [...new Set([...currentExpandedItems, ...folderIdsToExpand])],
		}));
	}, [searchValue, tree]);

	return (
		<div className="flex h-full flex-col gap-2 *:first:grow">
			<SearchBar
				className="peer ps-9"
				onBlur={(e) =>
				{
					// Prevent default blur behavior
					e.preventDefault();

					// Re-apply the search to ensure it stays active
					if (searchValue && searchValue.length > 0)
					{
						const searchProps = tree.getSearchInputElementProps();
						if (searchProps.onChange)
						{
							const syntheticEvent = {
								target: { value: searchValue },
							} as React.ChangeEvent<HTMLInputElement>;
							searchProps.onChange(syntheticEvent);
						}
					}
				}}
				onChange={(e) =>
				{
					const value = e.target.value;
					setSearchValue(value);

					// Apply the search to the tree's internal state as well
					const searchProps = tree.getSearchInputElementProps();
					if (searchProps.onChange)
					{
						searchProps.onChange(e);
					}

					if (value.length > 0)
					{
						// If input has at least one character, expand all items
						tree.expandAll();
					}
					else
					{
						// If input is cleared, reset to initial expanded state
						setState((prevState) => ({
							...prevState,
							expandedItems: initialExpandedItems,
						}));
						setFilteredItems([]);
					}
				}}
				placeholder="Filter items..."
				type="search"
				value={searchValue}
			/>

			<Tree indent={indent} tree={tree}>
				<AssistiveTreeDescription tree={tree} />
				{searchValue && filteredItems.length === 0 ? (
					<p className="px-3 py-4 text-center text-sm">No items found for "{searchValue}"</p>
				) : (
					tree.getItems().map((item) =>
						{
						const isVisible = shouldShowItem(item.getId());
						return <ItemTreeNode key={item.getId()} item={item} visible={isVisible} />;
					})
				)}
				<TreeDragLine />
			</Tree>
		</div>
	);
}

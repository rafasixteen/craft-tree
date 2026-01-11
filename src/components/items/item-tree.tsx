'use client';

import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { cn } from '@/lib/utils';
import { ItemTreeNode } from './item-tree-node';
import { TreeNode } from './types';

interface ItemTreeProps extends React.HTMLAttributes<HTMLDivElement>
{
	collectionId: string;
	collectionName: string;
	items: Array<{ id: string; name: string; slug: string }>;
	recipes: Array<{ id: string; name: string; slug: string; itemId: string }>;
}

export function ItemTree({ collectionId, collectionName, items, recipes, ...props }: ItemTreeProps)
{
	// Build the data map for the tree
	const dataMap = new Map<string, TreeNode>();

	// Root node (collection)
	dataMap.set(collectionId, {
		id: collectionId,
		name: collectionName,
		type: 'collection',
	});

	// Add items
	items.forEach((item) =>
	{
		dataMap.set(item.id, {
			id: item.id,
			name: item.name,
			slug: item.slug,
			type: 'item',
		});
	});

	// Add recipes
	recipes.forEach((recipe) =>
	{
		dataMap.set(recipe.id, {
			id: recipe.id,
			name: recipe.name,
			slug: recipe.slug,
			type: 'recipe',
		});
	});

	const tree = useTree<TreeNode>({
		initialState: { expandedItems: [collectionId] },
		rootItemId: collectionId,
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => item.getItemData().type !== 'recipe',
		dataLoader: {
			getItem: (itemId) => dataMap.get(itemId)!,
			getChildren: (itemId) =>
			{
				const node = dataMap.get(itemId);
				if (!node) return [];

				if (node.type === 'collection')
				{
					return items.map((item) => item.id);
				}
				if (node.type === 'item')
				{
					return recipes.filter((recipe) => recipe.itemId === itemId).map((recipe) => recipe.id);
				}
				return [];
			},
		},
		indent: 16,
		features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
	});

	return (
		<div {...tree.getContainerProps()} className={cn('w-full', props.className)} {...props}>
			{tree.getItems().map((item) => (
				<ItemTreeNode key={item.getId()} item={item} />
			))}
		</div>
	);
}

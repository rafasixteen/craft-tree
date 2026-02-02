import { FeatureImplementation, ItemInstance, TreeInstance } from '@headless-tree/core';
import { Node } from '@/domain/tree';

declare module '@headless-tree/core'
{
	export interface TreeInstance<T extends Node>
	{
		expandAll: () => void;
		collapseAll: () => void;
		expand: (nodeType: Node['type']) => void;
		collapse: (nodeType: Node['type']) => void;
	}
}

export const expandFeature: FeatureImplementation<Node> = {
	treeInstance: {
		expandAll: ({ tree }) =>
		{
			updateExpandedItems(tree, (expanded) =>
			{
				traverseAndApply(tree.getItems(), (item) =>
				{
					if (item.getChildren().length > 0)
					{
						expanded.add(item.getId());
					}
				});
			});
		},
		collapseAll: ({ tree }) =>
		{
			updateExpandedItems(tree, (expanded) =>
			{
				traverseAndApply(tree.getItems(), (item, node) =>
				{
					if (node.type !== 'collection' && item.getChildren().length > 0)
					{
						expanded.delete(item.getId());
					}
				});
			});
		},
		expand: ({ tree }, nodeType) =>
		{
			updateExpandedItems(tree, (expanded) =>
			{
				traverseAndApply(tree.getItems(), (item, node) =>
				{
					if (node.type === nodeType)
					{
						expanded.add(item.getId());
					}
				});
			});
		},
		collapse: ({ tree }, nodeType) =>
		{
			updateExpandedItems(tree, (expanded) =>
			{
				traverseAndApply(tree.getItems(), (item, node) =>
				{
					if (node.type === nodeType)
					{
						expanded.delete(item.getId());
					}
				});
			});
		},
	},
};

function updateExpandedItems<T extends Node>(tree: TreeInstance<T>, mutate: (expanded: Set<string>) => void): void
{
	const state = tree.getState();
	const expanded = new Set(state.expandedItems);

	mutate(expanded);

	tree.applySubStateUpdate('expandedItems', Array.from(expanded));
	tree.rebuildTree();
}

function traverseAndApply<T extends Node>(items: ItemInstance<T>[], apply: (item: ItemInstance<T>, node: T) => void): void
{
	for (const item of items)
	{
		const node = item.getItemData();
		apply(item, node);

		const children = item.getChildren();

		if (children.length)
		{
			traverseAndApply(children, apply);
		}
	}
}

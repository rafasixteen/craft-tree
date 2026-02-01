import { FeatureImplementation, ItemInstance } from '@headless-tree/core';

declare module '@headless-tree/core'
{
	export interface TreeInstance<T>
	{
		getFilteredItems: () => ItemInstance<T>[];
	}
}

export const filterFeature: FeatureImplementation = {
	treeInstance: {
		getFilteredItems: (opts) =>
		{
			const { tree } = opts;

			const allItems = tree.getItems();
			const directMatches = tree.getSearchMatchingItems();

			// If no search value, return all items
			if (tree.getSearchValue().trim().length === 0)
			{
				return allItems;
			}

			// If no search matches, return no items
			if (directMatches.length === 0)
			{
				return [];
			}

			const visibleItemIds = new Set<string>();

			// Build parent -> children map once
			const childrenMap = new Map<string, ItemInstance<any>[]>();

			for (const item of allItems)
			{
				const parentId = item.getParent()?.getId();
				if (!parentId) continue;

				if (!childrenMap.has(parentId))
				{
					childrenMap.set(parentId, []);
				}

				childrenMap.get(parentId)!.push(item);
			}

			// Add direct matches + ancestors
			for (const match of directMatches)
			{
				let current: ItemInstance<any> | undefined = match;

				while (current)
				{
					visibleItemIds.add(current.getId());
					current = current.getParent();
				}
			}

			// Add descendants using DFS
			const addDescendants = (item: ItemInstance<any>) =>
			{
				const children = childrenMap.get(item.getId());
				if (!children) return;

				for (const child of children)
				{
					if (!visibleItemIds.has(child.getId()))
					{
						visibleItemIds.add(child.getId());
						addDescendants(child);
					}
				}
			};

			for (const match of directMatches)
			{
				addDescendants(match);
			}

			return allItems.filter((item) => visibleItemIds.has(item.getId()));
		},
	},
};

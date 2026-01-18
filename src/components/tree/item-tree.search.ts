import { Node } from '@/domain/tree';

/**
 * Calculate visible items based on search value
 * Returns a set of item IDs that should be visible (matches + parents + children)
 */
export function getVisibleItems(searchValue: string, matchingItems: any[], tree: any, nodes: Record<string, Node>): Set<string>
{
	if (!searchValue || searchValue.length === 0)
	{
		return new Set<string>();
	}

	const directMatches = matchingItems.map((item) => item.getId());
	const visibleIds = new Set<string>(directMatches);

	// Add all parent IDs of matching items
	for (const matchId of directMatches)
	{
		let item = tree.getItems().find((i: any) => i.getId() === matchId);

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
		const item = tree.getItems().find((i: any) => i.getId() === matchId);

		if (item?.isFolder?.())
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
}

/**
 * Determine if an item should be shown based on search filter
 */
export function shouldShowItem(itemId: string, searchValue: string, visibleItems: Set<string>): boolean
{
	if (!searchValue || searchValue.length === 0) return true;
	return visibleItems.has(itemId);
}

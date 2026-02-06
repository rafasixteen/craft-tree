import { FeatureImplementation } from '@headless-tree/core';

declare module '@headless-tree/core'
{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export interface ItemInstance<T>
	{
		getToggleProps: () => {
			onClick: (e: React.MouseEvent) => void;
		};
	}
}

export const toggleFeature: FeatureImplementation = {
	itemInstance: {
		getProps: ({ tree, item, prev }) => ({
			...prev?.(),
			onClick: (e: React.MouseEvent) =>
			{
				if (e.shiftKey)
				{
					item.selectUpTo(e.ctrlKey || e.metaKey);
				}
				else if (e.ctrlKey || e.metaKey)
				{
					item.toggleSelect();
				}
				else
				{
					tree.setSelectedItems([item.getItemMeta().itemId]);
				}

				item.setFocused();
			},
		}),
		getToggleProps: ({ item, prev }) => ({
			...prev?.(),
			onClick: (e: React.MouseEvent) =>
			{
				e.preventDefault();
				e.stopPropagation();

				if (!item.isFolder())
				{
					return;
				}

				if (item.isExpanded())
				{
					item.collapse();
				}
				else
				{
					item.expand();
				}
			},
		}),
	},
};

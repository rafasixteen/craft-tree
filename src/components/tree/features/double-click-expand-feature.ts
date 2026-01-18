import { FeatureImplementation } from '@headless-tree/core';

export const doubleClickExpandFeature: FeatureImplementation = {
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
			onDoubleClick: () =>
			{
				item.primaryAction();

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

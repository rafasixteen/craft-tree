import { FeatureImplementation } from '@headless-tree/core';

export const removeDefaultExpandFeature: FeatureImplementation = {
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
	},
};

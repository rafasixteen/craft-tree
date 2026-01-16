import { FeatureImplementation, ItemInstance } from '@headless-tree/core';
import { FolderDropdown, ItemDropdown, RecipeDropdown } from '@/components/items/dropdowns';
import { Node } from '@/components/items';
import { ComponentType } from 'react';

export interface DropdownContentProps
{
	item: ItemInstance<Node>;
}

declare module '@headless-tree/core'
{
	export interface ItemInstance<T>
	{
		getDropdownContent: () => ComponentType<DropdownContentProps> | null;
	}
}

export const nodeActions: FeatureImplementation = {
	itemInstance: {
		getDropdownContent: ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();

			switch (node.type)
			{
				case 'folder':
					return FolderDropdown;
				case 'item':
					return ItemDropdown;
				case 'recipe':
					return RecipeDropdown;
				default:
					return null;
			}
		},
	},
};

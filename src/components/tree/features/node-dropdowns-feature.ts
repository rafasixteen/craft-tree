import { FeatureImplementation, ItemInstance } from '@headless-tree/core';
import { FolderDropdown, ItemDropdown, RecipeDropdown, CollectionDropdown } from '@/components/tree/dropdowns';
import { Node } from '@/domain/tree';
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
		getHref: () => string;
	}
}

export const nodeDropdownsFeature: FeatureImplementation = {
	itemInstance: {
		getDropdownContent: ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();

			switch (node.type)
			{
				case 'collection':
					return CollectionDropdown;
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
		getHref: ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();

			switch (node.type)
			{
				case 'folder':
					return `/collections/${node.collectionSlug}/folders/${node.slug}`;
				case 'item':
					return `/collections/${node.collectionSlug}/items/${node.slug}`;
				case 'recipe':
					return `/collections/${node.collectionSlug}/recipes/${node.slug}`;
				default:
					return '#';
			}
		},
	},
};

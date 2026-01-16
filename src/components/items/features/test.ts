import { FeatureImplementation, ItemInstance } from '@headless-tree/core';
import { createItem } from '@/domain/item';
import { createFolder } from '@/domain/folder';
import { Node } from '@/components/items';

declare module '@headless-tree/core'
{
	export interface TreeConfig<T>
	{
		onChange?: () => void;
	}

	export interface TreeInstance<T>
	{
		createFolder: (name: string, collectionId: string, parentFolderId: string | null) => void;
		createItem: (name: string, folderId: string | null) => void;
		createRecipe: (name: string, collectionId: string, itemId: string) => void;
	}

	export interface ItemInstance<T>
	{
		getHref: () => string;
	}
}

export const testFeature: FeatureImplementation = {
	treeInstance: {
		createFolder: async (opts, name: string, collectionId: string, parentFolderId: string | null) =>
		{
			const folder = await createFolder({ name, collectionId, parentFolderId });
			opts.tree.getConfig().onChange?.();
			return folder;
		},
		createItem: async (opts, name: string, folderId: string | null) =>
		{
			const item = await createItem({ name, folderId });
			opts.tree.getConfig().onChange?.();
			return item;
		},
	},
	itemInstance: {
		getHref: ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();

			switch (node.type)
			{
				case 'folder':
					return `/collections/${node.collectionSlug}/items/${node.slug}`;
				case 'item':
					return `/collections/${node.collectionSlug}/items/${node.slug}`;
				case 'recipe':
					return `/collections/${node.collectionSlug}/recipes/${node.slug}`;
			}
		},
	},
};

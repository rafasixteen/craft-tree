import { FeatureImplementation } from '@headless-tree/core';
import { createItem } from '@/domain/item';
import { createFolder } from '@/domain/folder';

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
}

export const mutationFeature: FeatureImplementation = {
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
};

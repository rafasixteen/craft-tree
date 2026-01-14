import { FeatureImplementation } from '@headless-tree/core';
import { createItem } from '@/domain/item';
import { createFolder } from '@/domain/folder';

declare module '@headless-tree/core'
{
	export interface TreeInstance<T>
	{
		createFolder: (name: string, collectionId: string, parentFolderId: string | null) => void;
		createItem: (name: string, collectionId: string, parentFolderId: string | null) => void;
		createRecipe: (name: string, collectionId: string, itemId: string) => void;
	}
}

export const testFeature: FeatureImplementation = {
	treeInstance: {
		createFolder: async (opts, name: string, collectionId: string, parentFolderId: string | null) =>
		{
			return await createFolder({ name, collectionId, parentFolderId });
		},
		createItem: async (opts, name: string, collectionId: string, parentFolderId: string | null) =>
		{
			return await createItem({ name, folderId: collectionId });
		},
	},
};

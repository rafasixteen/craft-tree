import { FeatureImplementation } from '@headless-tree/core';
import { createItem } from '@/domain/item';

declare module '@headless-tree/core'
{
	export interface TreeInstance<T>
	{
		createFolder: (name: string, collectionId: string, parentFolderId?: string) => void;
		createItem: (name: string, collectionId: string, parentFolderId: string) => void;
		createRecipe: (name: string, collectionId: string, itemId: string) => void;
	}
}

export const testFeature: FeatureImplementation = {
	treeInstance: {
		createFolder: async (opts, name: string, collectionId: string, parentFolderId?: string) =>
		{
			// Implementation for creating a folder can be added here
		},
		createItem: async (opts, name: string, collectionId: string, parentFolderId: string) =>
		{
			return await createItem({ name, collectionId });
		},
	},
};

import { FeatureImplementation, ItemInstance } from '@headless-tree/core';
import { createNode, deleteNode, updateNode } from '@/lib/graphql/nodes';
import { createItem } from '@/lib/graphql/items';
import { Node } from '@generated/graphql/types';
import { createRecipe } from '@/lib/graphql/recipes';

declare module '@headless-tree/core'
{
	export interface ItemInstance<T>
	{
		createChild: () => void;
		createFolder: () => void;
		deleteItem: () => void;
		renameItem: (newName: string) => void;
		getHref: () => string;
	}

	export interface TreeInstance<T>
	{
		onChange?: () => void;
	}
}

export const nodeActionsFeature: FeatureImplementation = {
	itemInstance: {
		createChild: async ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();
			const tree = item.getTree();

			if (node.type === 'recipe')
			{
				throw new Error('Cannot create child under recipe nodes');
			}

			if (node.type === 'folder')
			{
				await createItemNode(node);
			}
			else if (node.type === 'item')
			{
				await createRecipeNode(node);
			}

			tree.onChange?.();
		},
		createFolder: async ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();
			const tree = item.getTree();

			if (node.type !== 'folder')
			{
				throw new Error('Can only create folder under folder nodes');
			}

			await createFolderNode(node);
			tree.onChange?.();
		},
		deleteItem: async ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();
			const tree = item.getTree();

			await deleteNode({ id: node.id }, { id: true });
			tree.onChange?.();
		},
		renameItem: async ({ item }: { item: ItemInstance<Node> }, newName: string) =>
		{
			const node = item.getItemData();
			const tree = item.getTree();

			await updateNode(
				{
					id: node.id,
					data: {
						name: newName,
					},
				},
				{
					id: true,
				},
			);

			tree.onChange?.();
		},
		getHref: ({ item }: { item: ItemInstance<Node> }) =>
		{
			const node = item.getItemData();

			if (node.type === 'item')
			{
				return `/items/${node.item?.slug}`;
			}
			else if (node.type === 'recipe')
			{
				return `/recipes/${node.recipe?.slug}`;
			}

			return undefined;
		},
	},
};

async function createFolderNode(parent: Node)
{
	if (parent.type !== 'folder')
	{
		throw new Error('Cannot create folder: parent node is not of type folder');
	}

	await createNode(
		{
			data: {
				name: 'New Folder',
				type: 'folder',
				parentId: parent.id,
			},
		},
		{
			id: true,
		},
	);
}

async function createItemNode(parent: Node)
{
	if (parent.type !== 'folder')
	{
		throw new Error('Cannot create item: parent node is not of type folder');
	}

	const newItem = await createItem(
		{
			data: {
				name: 'New Item',
			},
		},
		{
			id: true,
			name: true,
		},
	);

	const newNode = await createNode(
		{
			data: {
				name: newItem.name,
				type: 'item',
				itemId: newItem.id,
				parentId: parent.id,
			},
		},
		{
			id: true,
			name: true,
		},
	);
}

async function createRecipeNode(parent: Node)
{
	if (parent.type !== 'item')
	{
		throw new Error('Cannot create recipe: parent node is not of type item');
	}

	if (!parent.item)
	{
		throw new Error('Cannot create recipe: parent node has no associated item');
	}

	const newRecipe = await createRecipe(
		{
			data: {
				name: 'New Recipe',
				itemId: parent.item.id,
				quantity: 1,
				time: 1,
			},
		},
		{
			id: true,
			name: true,
		},
	);

	const newNode = await createNode(
		{
			data: {
				name: newRecipe.name,
				type: 'recipe',
				recipeId: newRecipe.id,
				parentId: parent.id,
			},
		},
		{
			id: true,
		},
	);
}

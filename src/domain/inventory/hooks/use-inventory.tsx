'use client';

import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { InventoryData, InventoryTreeState, InventoryTreeNode, parseInventoryData } from '@/domain/inventory';
import * as InventoryActions from '@/domain/inventory/utils/inventory-actions';
import { createItem, deleteItem, moveAndReorderItems, renameItem } from '@/domain/item';
import { createFolder, deleteFolder, moveAndReorderFolders, renameFolder } from '@/domain/folder';
import { createRecipe, deleteRecipe, reorderRecipes, updateRecipe } from '@/domain/recipe';
import { deleteCollection, renameCollection } from '@/domain/collection';

interface InventoryContext
{
	inventory: InventoryTreeState;
	addNode: (parentNode: InventoryTreeNode, name: string, type: InventoryTreeNode['type']) => Promise<void>;
	renameNode: (node: InventoryTreeNode, newName: string) => Promise<void>;
	deleteNode: (node: InventoryTreeNode) => Promise<void>;
	setChildren: (parentNodeId: InventoryTreeNode['id'], childIds: InventoryTreeNode['id'][]) => Promise<void>;
	getNodePath: (node: InventoryTreeNode) => string[];
}

const InventoryContext = createContext<InventoryContext | undefined>(undefined);

interface InventoryProviderProps
{
	data: InventoryData;
	children: React.ReactNode;
}

export function InventoryProvider({ children, data }: InventoryProviderProps)
{
	const [inventory, setInventory] = useState<InventoryTreeState>(() => parseInventoryData(data));

	const addNode = useCallback(
		async function addNode(parentNode: InventoryTreeNode, name: string, type: InventoryTreeNode['type'])
		{
			try
			{
				let node: InventoryTreeNode;

				switch (type)
				{
					case 'item':
					{
						// This is a quick hack to make the API work with items added to the root.
						// TODO: A refactor is needed to cleanly separate items from nodes.
						const folderId = inventory.rootNodeId === parentNode.id ? null : parentNode.id;

						const newItem = await createItem({
							name,
							collectionId: inventory.rootNodeId,
							folderId: folderId,
						});

						node = {
							id: newItem.id,
							name: newItem.name,
							slug: newItem.slug,
							type: 'item',
						};

						break;
					}
					case 'folder':
					{
						// This is a quick hack to make the API work with folders added to the root.
						// TODO: A refactor is needed to cleanly separate folders from nodes.
						const parentFolderId = inventory.rootNodeId === parentNode.id ? null : parentNode.id;

						const newFolder = await createFolder({
							name,
							collectionId: inventory.rootNodeId,
							parentFolderId: parentFolderId,
						});

						node = {
							id: newFolder.id,
							name: newFolder.name,
							slug: newFolder.slug,
							type: 'folder',
						};

						break;
					}
					case 'recipe':
					{
						const newRecipe = await createRecipe({
							name,
							itemId: parentNode.id,
							quantity: 1,
							time: 1,
						});

						node = {
							id: newRecipe.id,
							name: newRecipe.name,
							slug: newRecipe.slug,
							type: 'recipe',
						};

						break;
					}
					default:
						throw new Error(`Can't add node of type: '${type}'`);
				}

				// Add the node to state.
				setInventory((prev) =>
				{
					return InventoryActions.addNode(prev, parentNode.id, node);
				});
			}
			catch (error)
			{
				console.error('Failed to add node:', error);
			}
		},
		[inventory.rootNodeId],
	);

	const deleteNode = useCallback(async function deleteNode(node: InventoryTreeNode)
	{
		try
		{
			switch (node.type)
			{
				case 'collection':
					await deleteCollection(node.id);
					break;
				case 'item':
					await deleteItem(node.id);
					break;
				case 'folder':
					await deleteFolder(node.id);
					break;
				case 'recipe':
					await deleteRecipe(node.id);
					break;
				default:
					throw new Error(`Can't delete node of type: '${node.type}'`);
			}

			setInventory((prev) => InventoryActions.deleteNode(prev, node.id));
		}
		catch (error: unknown)
		{
			console.error('Failed to delete node:', error);
		}
	}, []);

	const renameNode = useCallback(async function renameNode(node: InventoryTreeNode, newName: string)
	{
		try
		{
			const renamed = await (async () =>
			{
				switch (node.type)
				{
					case 'collection':
						return renameCollection({ collectionId: node.id, newName: newName });
					case 'folder':
						return renameFolder({ folderId: node.id, newName: newName });
					case 'item':
						return renameItem({ itemId: node.id, newName: newName });
					case 'recipe':
						return updateRecipe({ id: node.id, data: { name: newName } });
					default:
						throw new Error(`Can't rename node of type: '${node.type}'`);
				}
			})();

			setInventory((prev) => InventoryActions.renameNode(prev, node.id, renamed.name));
		}
		catch (error: unknown)
		{
			console.error('Failed to rename node:', error);
		}
	}, []);

	const setChildren = useCallback(async function setChildren(parentNodeId: InventoryTreeNode['id'], childIds: InventoryTreeNode['id'][])
	{
		try
		{
			setInventory((prev) =>
			{
				return InventoryActions.setChildren(prev, parentNodeId, childIds);
			});

			const recipes: { id: string; order: number }[] = [];
			const items: { id: string; order: number }[] = [];
			const folders: { id: string; order: number }[] = [];

			for (let i = 0; i < childIds.length; i++)
			{
				const nodeId = childIds[i];
				const node = inventory.nodes[nodeId];

				if (!node)
				{
					console.warn(`Node with id '${nodeId}' not found in inventory.`);
					continue;
				}

				switch (node.type)
				{
					case 'recipe':
						recipes.push({ id: node.id, order: i });
						break;
					case 'item':
						items.push({ id: node.id, order: i });
						break;
					case 'folder':
						folders.push({ id: node.id, order: i });
						break;
					default:
						throw new Error(`Cannot move node of type '${node.type}'`);
				}
			}

			const parentNode = inventory.nodes[parentNodeId];

			// This is a quick hack to make the API work with nodes moved to the root.
			// TODO: A refactor is needed to cleanly separate nodes from the collection.
			const parentId = parentNode.type === 'collection' ? null : parentNode.id;

			await Promise.all([
				recipes.length ? reorderRecipes({ itemId: parentNode.id, recipeOrders: recipes }) : null,
				items.length ? moveAndReorderItems({ newFolderId: parentId, itemOrders: items }) : null,
				folders.length ? moveAndReorderFolders({ newParentFolderId: parentId, folderOrders: folders }) : null,
			]);
		}
		catch (error: unknown)
		{
			console.error('Failed to set children:', error);
		}
	}, []);

	const getNodePath = useCallback(
		function getNodePath(node: InventoryTreeNode): string[]
		{
			return InventoryActions.getNodePath(inventory, node.id);
		},
		[inventory],
	);

	const value = useMemo(() => ({ inventory, addNode, renameNode, deleteNode, setChildren, getNodePath }), [inventory, addNode, renameNode, deleteNode, setChildren, getNodePath]);

	return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContext
{
	const context = useContext(InventoryContext);

	if (!context)
	{
		throw new Error('useInventory must be used within an InventoryProvider');
	}

	return context;
}

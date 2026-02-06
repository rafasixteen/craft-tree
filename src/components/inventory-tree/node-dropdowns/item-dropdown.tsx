'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PencilIcon, FilesIcon, TrashIcon, CookingPotIcon } from 'lucide-react';
import { InventoryTreeNode, useInventory } from '@/domain/inventory';
import { ItemInstance } from '@headless-tree/core';
import { useCallback } from 'react';

interface ItemDropdownProps
{
	item: ItemInstance<InventoryTreeNode>;
}

export function ItemDropdown({ item }: ItemDropdownProps)
{
	const { addNode, deleteNode } = useInventory();

	const addRecipe = useCallback(
		function addRecipe(e: React.MouseEvent)
		{
			e.stopPropagation();

			addNode(item.getItemData(), 'New Recipe', 'recipe');

			if (!item.isExpanded())
			{
				item.expand();
			}
		},
		[addNode, item],
	);

	const renameItem = useCallback(
		function renameItem(e: React.MouseEvent)
		{
			e.stopPropagation();
			item.startRenaming();
		},
		[item],
	);

	const duplicateItem = useCallback(function duplicateItem(e: React.MouseEvent)
	{
		e.stopPropagation();
		console.log('Duplicate item');
	}, []);

	const deleteItem = useCallback(
		function deleteItem(e: React.MouseEvent)
		{
			e.stopPropagation();
			deleteNode(item.getItemData());
		},
		[deleteNode, item],
	);

	return (
		<>
			<DropdownMenuItem onClick={addRecipe}>
				<CookingPotIcon className="size-4" />
				Add Recipe
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={renameItem}>
				<PencilIcon className="size-4" />
				Rename
			</DropdownMenuItem>
			<DropdownMenuItem onClick={duplicateItem}>
				<FilesIcon className="size-4" />
				Duplicate
			</DropdownMenuItem>
			<DropdownMenuItem onClick={deleteItem} variant="destructive">
				<TrashIcon className="size-4" />
				Delete
			</DropdownMenuItem>
		</>
	);
}

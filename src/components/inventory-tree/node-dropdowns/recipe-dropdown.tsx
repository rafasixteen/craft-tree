'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PencilIcon, FilesIcon, TrashIcon } from 'lucide-react';
import { ItemInstance } from '@headless-tree/core';
import { InventoryTreeNode, useInventory } from '@/domain/inventory';
import { useCallback } from 'react';

interface RecipeDropdownProps
{
	item: ItemInstance<InventoryTreeNode>;
}

export function RecipeDropdown({ item }: RecipeDropdownProps)
{
	const { deleteNode } = useInventory();

	const renameRecipe = useCallback(
		function renameRecipe(e: React.MouseEvent)
		{
			e.stopPropagation();
			item.startRenaming();
		},
		[item],
	);

	const duplicateRecipe = useCallback(function duplicateRecipe(e: React.MouseEvent)
	{
		e.stopPropagation();
		console.log('Duplicate recipe');
	}, []);

	const deleteRecipe = useCallback(
		function deleteRecipe(e: React.MouseEvent)
		{
			e.stopPropagation();
			deleteNode(item.getItemData());
		},
		[deleteNode, item],
	);

	return (
		<>
			<DropdownMenuItem onClick={renameRecipe}>
				<PencilIcon className="size-4" />
				Rename
			</DropdownMenuItem>
			<DropdownMenuItem onClick={duplicateRecipe}>
				<FilesIcon className="size-4" />
				Duplicate
			</DropdownMenuItem>
			<DropdownMenuItem onClick={deleteRecipe} variant="destructive">
				<TrashIcon className="size-4" />
				Delete
			</DropdownMenuItem>
		</>
	);
}

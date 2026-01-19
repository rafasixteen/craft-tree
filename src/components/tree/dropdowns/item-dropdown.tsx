'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '../features/node-dropdowns-feature';
import { PencilIcon, FilesIcon, TrashIcon, CookingPotIcon } from 'lucide-react';
import { createRecipe } from '@/domain/recipe';
import { deleteItem } from '@/domain/item';
import { useTreeNodes } from '@/providers';

export function ItemDropdown({ item }: DropdownContentProps)
{
	const node = item.getItemData();
	const { refresh } = useTreeNodes();

	const handleAddRecipe = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		await createRecipe({ name: 'New Recipe', itemId: node.id, quantity: 1, time: 1 });
		await refresh();
	};

	const handleRename = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		item.startRenaming();
	};

	const handleDuplicate = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		console.log('Duplicate item', item.getItemData());
	};

	const handleDelete = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		await deleteItem(node.id);
		await refresh();
	};

	return (
		<>
			<DropdownMenuItem onClick={handleAddRecipe}>
				<CookingPotIcon className="size-4" />
				Add Recipe
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={handleRename}>
				<PencilIcon className="size-4" />
				Rename
			</DropdownMenuItem>
			<DropdownMenuItem onClick={handleDuplicate}>
				<FilesIcon className="size-4" />
				Duplicate
			</DropdownMenuItem>
			<DropdownMenuItem onClick={handleDelete} variant="destructive">
				<TrashIcon className="size-4" />
				Delete
			</DropdownMenuItem>
		</>
	);
}

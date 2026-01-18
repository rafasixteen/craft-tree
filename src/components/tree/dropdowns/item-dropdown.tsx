'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '../features/node-dropdowns-feature';
import { PencilIcon, FilesIcon, TrashIcon, CookingPotIcon } from 'lucide-react';
import { createRecipe } from '@/domain/recipe';
import { deleteItem } from '@/domain/item';

export function ItemDropdown({ item }: DropdownContentProps)
{
	const node = item.getItemData();
	const tree = item.getTree();

	const handleAddRecipe = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		createRecipe({ name: 'New Recipe', itemId: node.id, quantity: 1, time: 1 });
		tree.getConfig().onChange?.();
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

	const handleDelete = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		deleteItem(node.id);
		tree.getConfig().onChange?.();
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

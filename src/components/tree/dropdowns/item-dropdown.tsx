'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PencilIcon, FilesIcon, TrashIcon, CookingPotIcon } from 'lucide-react';
import { createRecipe } from '@/domain/recipe';
import { deleteItem } from '@/domain/item';
import { useTreeNodes } from '@/providers';
import { Node } from '@/domain/tree';
import { ItemInstance } from '@headless-tree/core';

interface ItemDropdownProps
{
	item: ItemInstance<Node>;
}

export function ItemDropdown({ item }: ItemDropdownProps)
{
	const node = item.getItemData();
	const tree = item.getTree();
	const treeConfig = tree.getConfig();

	const { refresh } = useTreeNodes();

	const handleAddRecipe = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		const newRecipe = await createRecipe({ name: 'New Recipe', itemId: node.id, quantity: 1, time: 1 });
		await refresh();

		const newInstance = tree.getItemInstance(newRecipe.id);
		treeConfig.onItemCreated?.(newInstance, item);
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

'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '@/components/tree/features';
import { PencilIcon, FilesIcon, TrashIcon } from 'lucide-react';
import { deleteRecipe } from '@/domain/recipe';
import { useTreeNodes } from '@/providers';

export function RecipeDropdown({ item }: DropdownContentProps)
{
	const node = item.getItemData();
	const { refresh } = useTreeNodes();

	const handleRename = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		item.startRenaming();
	};

	const handleDuplicate = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		console.log('Duplicate recipe', item.getItemData());
	};

	const handleDelete = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		await deleteRecipe(node.id);
		await refresh();
	};

	return (
		<>
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

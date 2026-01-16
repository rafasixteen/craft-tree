import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '../features/node-dropdowns-feature';
import { PencilIcon, FilesIcon, TrashIcon, PackagePlus } from 'lucide-react';

export function ItemDropdown({ item }: DropdownContentProps)
{
	const handleAddToRecipe = () =>
	{
		console.log('Add to recipe', item.getItemData());
	};

	const handleRename = () =>
	{
		item.startRenaming();
	};

	const handleDuplicate = () =>
	{
		console.log('Duplicate item', item.getItemData());
	};

	const handleDelete = () =>
	{
		console.log('Delete item', item.getItemData());
	};

	return (
		<>
			<DropdownMenuItem onClick={handleAddToRecipe}>
				<PackagePlus className="size-4" />
				Add to Recipe
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
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={handleDelete} variant="destructive">
				<TrashIcon className="size-4" />
				Delete
			</DropdownMenuItem>
		</>
	);
}

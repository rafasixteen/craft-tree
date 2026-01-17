import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '@/components/items/features';
import { PencilIcon, FilesIcon, TrashIcon } from 'lucide-react';

export function RecipeDropdown({ item }: DropdownContentProps)
{
	const handleRename = () =>
	{
		item.startRenaming();
	};

	const handleDuplicate = () =>
	{
		console.log('Duplicate recipe', item.getItemData());
	};

	const handleDelete = () =>
	{
		console.log('Delete recipe', item.getItemData());
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

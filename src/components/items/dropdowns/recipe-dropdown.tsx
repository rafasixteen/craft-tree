import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '../features/node-dropdowns-feature';
import { PencilIcon, FilesIcon, TrashIcon, Share2, BookOpen } from 'lucide-react';

export function RecipeDropdown({ item }: DropdownContentProps)
{
	const handleViewRecipe = () =>
	{
		console.log('View recipe', item.getItemData());
	};

	const handleShare = () =>
	{
		console.log('Share recipe', item.getItemData());
	};

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
			<DropdownMenuLabel>Recipe Actions</DropdownMenuLabel>
			<DropdownMenuItem onClick={handleViewRecipe}>
				<BookOpen className="size-4" />
				View Recipe
			</DropdownMenuItem>
			<DropdownMenuItem onClick={handleShare}>
				<Share2 className="size-4" />
				Share
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

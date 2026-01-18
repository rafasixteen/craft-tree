import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '@/components/tree/features';
import { PencilIcon, FilesIcon, TrashIcon } from 'lucide-react';
import { deleteRecipe } from '@/domain/recipe';

export function RecipeDropdown({ item }: DropdownContentProps)
{
	const node = item.getItemData();
	const tree = item.getTree();

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
		deleteRecipe(node.id);
		tree.getConfig().onChange?.();
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

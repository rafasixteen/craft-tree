import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '../features/node-dropdowns-feature';
import { FolderPlus, PencilIcon, FilesIcon, TrashIcon } from 'lucide-react';

export function FolderDropdown({ item }: DropdownContentProps)
{
	const node = item.getItemData();
	const tree = item.getTree();

	const handleAddItem = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		tree.createItem('New Item', node.id);
	};

	const handleRename = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		console.log('Rename folder', item.getItemData());
	};

	const handleDuplicate = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		console.log('Duplicate folder', item.getItemData());
	};

	const handleDelete = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		console.log('Delete folder', item.getItemData());
	};

	return (
		<>
			<DropdownMenuItem onClick={handleAddItem}>
				<FolderPlus className="size-4" />
				Add Item
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

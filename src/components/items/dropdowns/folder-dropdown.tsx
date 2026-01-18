import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '../features/node-dropdowns-feature';
import { FolderPlus, PencilIcon, FilesIcon, TrashIcon, FilePlusCornerIcon } from 'lucide-react';
import { createFolder, deleteFolder } from '@/domain/folder';
import { Node } from '@/domain/tree';

export function FolderDropdown({ item }: DropdownContentProps)
{
	const node = item.getItemData() as Node;
	const tree = item.getTree();

	const handleAddItem = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		tree.createItem('New Item', node.id);
	};

	const handleAddFolder = (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		createFolder({ name: 'New Folder', collectionId: node.collectionId, parentFolderId: node.id });
		tree.getConfig().onChange?.();
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
		deleteFolder(node.id);
		tree.getConfig().onChange?.();
	};

	return (
		<>
			<DropdownMenuItem onClick={handleAddItem}>
				<FilePlusCornerIcon className="size-4" />
				Add Item
			</DropdownMenuItem>
			<DropdownMenuItem onClick={handleAddFolder}>
				<FolderPlus className="size-4" />
				Add Folder
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

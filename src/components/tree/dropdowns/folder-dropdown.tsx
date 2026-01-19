'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownContentProps } from '../features/node-dropdowns-feature';
import { PencilIcon, FilesIcon, TrashIcon, CuboidIcon, FolderIcon } from 'lucide-react';
import { createFolder, deleteFolder } from '@/domain/folder';
import { createItem } from '@/domain/item';
import { useTreeNodes } from '@/providers';

export function FolderDropdown({ item }: DropdownContentProps)
{
	const node = item.getItemData();
	const { refresh } = useTreeNodes();

	const handleAddItem = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		await createItem({ name: 'New Item', collectionId: node.collectionId, folderId: node.id });
		await refresh();
	};

	const handleAddFolder = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		await createFolder({ name: 'New Folder', collectionId: node.collectionId, parentFolderId: node.id });
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
		console.log('Duplicate folder', item.getItemData());
	};

	const handleDelete = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		await deleteFolder(node.id);
		await refresh();
	};

	return (
		<>
			<DropdownMenuItem onClick={handleAddItem}>
				<CuboidIcon className="size-4" />
				Add Item
			</DropdownMenuItem>
			<DropdownMenuItem onClick={handleAddFolder}>
				<FolderIcon className="size-4" />
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

'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PencilIcon, FilesIcon, TrashIcon, CuboidIcon, FolderIcon } from 'lucide-react';
import { createFolder, deleteFolder } from '@/domain/folder';
import { createItem } from '@/domain/item';
import { useTreeNodesContext } from '@/providers';
import { Node } from '@/domain/tree';
import { ItemInstance } from '@headless-tree/core';

interface FolderDropdownProps
{
	item: ItemInstance<Node>;
}

export function FolderDropdown({ item }: FolderDropdownProps)
{
	const node = item.getItemData();
	const tree = item.getTree();
	const treeConfig = tree.getConfig();

	const { refresh } = useTreeNodesContext();

	const handleAddItem = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		const newItem = await createItem({ name: 'New Item', collectionId: node.collectionId, folderId: node.id });
		await refresh();

		const newInstance = tree.getItemInstance(newItem.id);
		treeConfig.onItemCreated?.(newInstance, item);
	};

	const handleAddFolder = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		const newFolder = await createFolder({ name: 'New Folder', collectionId: node.collectionId, parentFolderId: node.id });
		await refresh();

		const newInstance = tree.getItemInstance(newFolder.id);
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

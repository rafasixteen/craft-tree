'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PencilIcon, FilesIcon, TrashIcon, CuboidIcon, FolderIcon } from 'lucide-react';
import { createFolder } from '@/domain/folder';
import { createItem } from '@/domain/item';
import { deleteCollection } from '@/domain/collection';
import { useTreeNodes } from '@/providers';
import { redirect } from 'next/navigation';
import { Node } from '@/domain/tree';
import { ItemInstance } from '@headless-tree/core';

interface CollectionDropdownProps
{
	item: ItemInstance<Node>;
}

export function CollectionDropdown({ item }: CollectionDropdownProps)
{
	const node = item.getItemData();
	const tree = item.getTree();
	const treeConfig = tree.getConfig();

	const { refresh } = useTreeNodes();

	const handleAddItem = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		const newItem = await createItem({ name: 'New Item', collectionId: node.id, folderId: null });
		await refresh();

		const newInstance = tree.getItemInstance(newItem.id);
		treeConfig.onItemCreated?.(newInstance, item);
	};

	const handleAddFolder = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		const newFolder = await createFolder({ name: 'New Folder', collectionId: node.id, parentFolderId: null });
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
		console.log('Duplicate collection', item.getItemData());
	};

	const handleDelete = async (e: React.MouseEvent) =>
	{
		e.stopPropagation();
		await deleteCollection(node.id);

		// Clean up localStorage for this collection
		if (typeof window !== 'undefined')
		{
			localStorage.removeItem(`tree-expanded-items-${node.id}`);
		}

		redirect('/collections');
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

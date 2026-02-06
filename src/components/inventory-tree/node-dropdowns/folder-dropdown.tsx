'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PencilIcon, FilesIcon, TrashIcon, CuboidIcon, FolderIcon } from 'lucide-react';
import { InventoryTreeNode, useInventory } from '@/domain/inventory';
import { ItemInstance } from '@headless-tree/core';
import { useCallback } from 'react';

interface FolderDropdownProps
{
	item: ItemInstance<InventoryTreeNode>;
}

export function FolderDropdown({ item }: FolderDropdownProps)
{
	const { addNode, deleteNode } = useInventory();

	const addItem = useCallback(
		function addItem(e: React.MouseEvent)
		{
			e.stopPropagation();

			addNode(item.getItemData(), 'New Item', 'item');

			if (!item.isExpanded())
			{
				item.expand();
			}
		},
		[addNode, item],
	);

	const addFolder = useCallback(
		function addFolder(e: React.MouseEvent)
		{
			e.stopPropagation();

			addNode(item.getItemData(), 'New Folder', 'folder');

			if (!item.isExpanded())
			{
				item.expand();
			}
		},
		[addNode, item],
	);

	const renameFolder = useCallback(
		function renameFolder(e: React.MouseEvent)
		{
			e.stopPropagation();
			item.startRenaming();
		},
		[item],
	);

	const duplicateFolder = useCallback(function duplicateFolder(e: React.MouseEvent)
	{
		e.stopPropagation();
		console.log('Duplicate folder');
	}, []);

	const deleteFolder = useCallback(
		function deleteFolder(e: React.MouseEvent)
		{
			e.stopPropagation();
			deleteNode(item.getItemData());
		},
		[deleteNode, item],
	);

	return (
		<>
			<DropdownMenuItem onClick={addItem}>
				<CuboidIcon className="size-4" />
				Add Item
			</DropdownMenuItem>
			<DropdownMenuItem onClick={addFolder}>
				<FolderIcon className="size-4" />
				Add Folder
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={renameFolder}>
				<PencilIcon className="size-4" />
				Rename
			</DropdownMenuItem>
			<DropdownMenuItem onClick={duplicateFolder}>
				<FilesIcon className="size-4" />
				Duplicate
			</DropdownMenuItem>
			<DropdownMenuItem onClick={deleteFolder} variant="destructive">
				<TrashIcon className="size-4" />
				Delete
			</DropdownMenuItem>
		</>
	);
}

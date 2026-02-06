'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PencilIcon, FilesIcon, TrashIcon, CuboidIcon, FolderIcon } from 'lucide-react';
import { InventoryTreeNode, useInventory } from '@/domain/inventory';
import { ItemInstance } from '@headless-tree/core';
import { useCallback } from 'react';
import { redirect } from 'next/navigation';

interface CollectionDropdownProps
{
	item: ItemInstance<InventoryTreeNode>;
}

export function CollectionDropdown({ item }: CollectionDropdownProps)
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

	const renameCollection = useCallback(
		function renameCollection(e: React.MouseEvent)
		{
			e.stopPropagation();
			item.startRenaming();
		},
		[item],
	);

	const duplicateCollection = useCallback(function duplicateCollection(e: React.MouseEvent)
	{
		e.stopPropagation();
		console.log('Duplicate collection');
	}, []);

	const deleteCollection = useCallback(
		function deleteCollection(e: React.MouseEvent)
		{
			e.stopPropagation();

			deleteNode(item.getItemData());

			// Clean up localStorage for this collection
			if (typeof window !== 'undefined')
			{
				localStorage.removeItem(`tree-expanded-items-${item.getId()}`);
			}

			redirect('/collections');
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
			<DropdownMenuItem onClick={renameCollection}>
				<PencilIcon className="size-4" />
				Rename
			</DropdownMenuItem>
			<DropdownMenuItem onClick={duplicateCollection}>
				<FilesIcon className="size-4" />
				Duplicate
			</DropdownMenuItem>
			<DropdownMenuItem onClick={deleteCollection} variant="destructive">
				<TrashIcon className="size-4" />
				Delete
			</DropdownMenuItem>
		</>
	);
}

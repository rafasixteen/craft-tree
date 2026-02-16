import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ClipboardPasteIcon, CopyIcon, PencilIcon, ScissorsIcon, TrashIcon } from 'lucide-react';
import { useActiveInventory } from '@/components/inventory';
import { Item, useItems } from '@/domain/item';
import { useItemGridGeneric } from '@/components/grid';
import { useCallback } from 'react';

interface ItemContextMenuProps
{
	children: React.ReactNode;
	item: Item;
}

export function ItemContextMenu({ children, item }: ItemContextMenuProps)
{
	const inventory = useActiveInventory();
	const { deleteItem } = useItems(inventory.id);

	const { startEditingItem } = useItemGridGeneric<Item>();

	const onDelete = useCallback(
		function onDelete()
		{
			deleteItem({ itemId: item.id });
		},
		[deleteItem, item.id],
	);

	const onEdit = useCallback(
		function onEdit()
		{
			startEditingItem(item);
		},
		[startEditingItem, item],
	);

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger>{children}</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuGroup>
						<ContextMenuItem>
							<CopyIcon />
							Copy
						</ContextMenuItem>
						<ContextMenuItem>
							<ScissorsIcon />
							Cut
						</ContextMenuItem>
						<ContextMenuItem>
							<ClipboardPasteIcon />
							Paste
						</ContextMenuItem>
						<ContextMenuItem onSelect={onEdit}>
							<PencilIcon />
							Edit
						</ContextMenuItem>
					</ContextMenuGroup>
					<ContextMenuSeparator />
					<ContextMenuGroup>
						<ContextMenuItem variant="destructive" onSelect={onDelete}>
							<TrashIcon />
							Delete
						</ContextMenuItem>
					</ContextMenuGroup>
				</ContextMenuContent>
			</ContextMenu>
		</>
	);
}

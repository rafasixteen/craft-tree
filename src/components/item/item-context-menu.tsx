import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ClipboardPasteIcon, CopyIcon, PencilIcon, ScissorsIcon, TrashIcon } from 'lucide-react';
import { useActiveInventory } from '@/components/inventory';
import { Item, useItems } from '@/domain/item';
import { useCallback } from 'react';
import Link from 'next/link';

interface ItemContextMenuProps
{
	children: React.ReactNode;
	item: Item;
}

export function ItemContextMenu({ children, item }: ItemContextMenuProps)
{
	const inventory = useActiveInventory();
	const { deleteItem } = useItems({ inventoryId: inventory.id });

	const onDelete = useCallback(
		function onDelete()
		{
			deleteItem(item.id);
		},
		[deleteItem, item.id],
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
						<ContextMenuItem asChild>
							<Link href={`items/${item.id}/edit`}>
								<PencilIcon />
								Edit
							</Link>
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

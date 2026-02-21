import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ClipboardPasteIcon, CopyIcon, PencilIcon, ScissorsIcon, TrashIcon } from 'lucide-react';
import { useActiveInventory } from '@/components/inventory';
import { Tag, useTags } from '@/domain/tag';
import { useCallback } from 'react';
import Link from 'next/link';

interface TagContextMenuProps
{
	children: React.ReactNode;
	tag: Tag;
}

export function TagContextMenu({ children, tag }: TagContextMenuProps)
{
	const inventory = useActiveInventory();
	const { deleteTag } = useTags({ inventoryId: inventory.id });

	const onDelete = useCallback(
		function onDelete()
		{
			deleteTag(tag.id);
		},
		[deleteTag, tag.id],
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
							<Link href={`tags/${tag.id}/edit`}>
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

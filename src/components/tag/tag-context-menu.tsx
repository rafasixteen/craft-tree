import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ClipboardPasteIcon, CopyIcon, PencilIcon, ScissorsIcon, Trash2Icon, TrashIcon } from 'lucide-react';
import { useActiveInventory } from '@/components/inventory';
import { Tag, useTags, useTagUsage } from '@/domain/tag';
import { useCallback } from 'react';
import Link from 'next/link';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TagContextMenuProps
{
	children: React.ReactNode;
	tag: Tag;
}

export function TagContextMenu({ children, tag }: TagContextMenuProps)
{
	const inventory = useActiveInventory();

	const { deleteTag } = useTags({ inventoryId: inventory.id });
	const usage = useTagUsage(tag.id);

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
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<ContextMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
									<TrashIcon />
									Delete
								</ContextMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent size="sm">
								<AlertDialogHeader>
									<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
										<Trash2Icon />
									</AlertDialogMedia>
									<AlertDialogTitle>Delete tag?</AlertDialogTitle>
									<AlertDialogDescription>
										{usage && usage.total > 0 ? (
											<>
												This tag is currently used in <b>{usage.total}</b> {usage.total === 1 ? 'item' : 'items'}.
											</>
										) : (
											<>This action cannot be undone. This will permanently delete the tag &quot;{tag.name}&quot;.</>
										)}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
									<AlertDialogAction variant="destructive" onClick={onDelete}>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</ContextMenuGroup>
				</ContextMenuContent>
			</ContextMenu>
		</>
	);
}

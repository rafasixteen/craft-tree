import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ClipboardPasteIcon, CopyIcon, PencilIcon, ScissorsIcon, TrashIcon } from 'lucide-react';
import { useActiveInventory } from '@/components/inventory';
import { Producer, useProducers } from '@/domain/producer';
import { useCallback } from 'react';
import Link from 'next/link';

interface ProducerContextMenuProps
{
	children: React.ReactNode;
	producer: Producer;
}

export function ProducerContextMenu({ children, producer }: ProducerContextMenuProps)
{
	const inventory = useActiveInventory();
	const { deleteProducer } = useProducers({ inventoryId: inventory.id });

	const onDelete = useCallback(
		function onDelete()
		{
			deleteProducer(producer.id);
		},
		[deleteProducer, producer.id],
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
							<Link href={`producers/${producer.id}/edit`}>
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

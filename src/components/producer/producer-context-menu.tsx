import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ClipboardPasteIcon, CopyIcon, PencilIcon, ScissorsIcon, TrashIcon } from 'lucide-react';
import { useActiveInventory } from '@/components/inventory';
import { Producer, useProducers } from '@/domain/producer';
import { useGrid } from '@/components/grid';
import { useCallback } from 'react';

interface ProducerContextMenuProps
{
	children: React.ReactNode;
	producer: Producer;
}

export function ProducerContextMenu({ children, producer }: ProducerContextMenuProps)
{
	const inventory = useActiveInventory();
	const { deleteProducer } = useProducers(inventory.id);

	const { startEditingCell } = useGrid<Producer>();

	const onDelete = useCallback(
		function onDelete()
		{
			deleteProducer({ producerId: producer.id });
		},
		[deleteProducer, producer.id],
	);

	const onEdit = useCallback(
		function onEdit()
		{
			startEditingCell(producer);
		},
		[startEditingCell, producer],
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

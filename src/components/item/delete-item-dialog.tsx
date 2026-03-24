'use client';

import { Button } from '@/components/ui/button';
import {
	buildItemReferences,
	DeleteConfirmationDialog,
	DeleteTarget,
	ResourceMetaInfo,
} from '@/components/confirmation-dialog';
import { Item, deleteItem, useItemProducerInputUsage, useItemProducerOutputUsage } from '@/domain/item';
import { TrashIcon } from 'lucide-react';

interface DeleteItemDialogProps
{
	item: Item;
}

export function DeleteItemDialog({ item }: DeleteItemDialogProps)
{
	const { count: inputUsage } = useItemProducerInputUsage({ itemId: item.id });
	const { count: outputUsage } = useItemProducerOutputUsage({ itemId: item.id });

	// TODO: Add how many graphs are using this item.
	// TODO: Add loading and validating states to the dialog, and disable the confirm button while loading/validating.

	const target: DeleteTarget = {
		resourceType: 'item',
		resourceName: item.name,
		references: buildItemReferences({
			producerInputsCount: inputUsage ?? 0,
			producerOutputsCount: outputUsage ?? 0,
		}),
	};

	async function onConfirm()
	{
		await deleteItem({ itemId: item.id });
	}

	const meta: ResourceMetaInfo = {
		icon: '◈',
		color: '#d4a843',
		description: (name) => `"${name}" may be used as an input or output in producer pipelines.`,
		warningThreshold: 1,
	};

	return (
		<DeleteConfirmationDialog
			trigger={
				<Button variant="destructive" size="icon-sm">
					<TrashIcon className="size-3" />
				</Button>
			}
			meta={meta}
			target={target}
			onConfirm={onConfirm}
		/>
	);
}

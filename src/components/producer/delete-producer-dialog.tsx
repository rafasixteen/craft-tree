'use client';

import { Button } from '@/components/ui/button';
import {
	buildProducerReferences,
	DeleteConfirmationDialog,
	DeleteTarget,
	ResourceMetaInfo,
} from '@/components/confirmation-dialog';
import { Producer, deleteProducer } from '@/domain/producer';
import { TrashIcon } from 'lucide-react';

interface DeleteProducerDialogProps
{
	producer: Producer;
}

export function DeleteProducerDialog({ producer }: DeleteProducerDialogProps)
{
	// TODO: Add how many producer graphs are using this producer.

	const target: DeleteTarget = {
		resourceType: 'producer',
		resourceName: producer.name,
		references: buildProducerReferences({
			inputsCount: 0,
			outputsCount: 0,
		}),
	};

	async function onConfirm()
	{
		await deleteProducer({ producerId: producer.id });
	}

	const meta: ResourceMetaInfo = {
		icon: '⬡',
		color: '#5b9cf6',
		description: (name) => `"${name}" has inputs and outputs linked to items in the inventory.`,
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

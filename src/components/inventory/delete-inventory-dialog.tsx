'use client';

import { Button } from '@/components/ui/button';
import {
	buildInventoryReferences,
	DeleteConfirmationDialog,
	DeleteTarget,
	ResourceMetaInfo,
} from '@/components/confirmation-dialog';
import { Inventory, deleteInventory } from '@/domain/inventory';
import { useItems, useProducers, useTags, useGraphs } from '@/domain/inventory';
import { TrashIcon } from 'lucide-react';

interface DeleteInventoryDialogProps
{
	inventory: Inventory;
}

export function DeleteInventoryDialog({ inventory }: DeleteInventoryDialogProps)
{
	const { items } = useItems({ inventoryId: inventory.id });
	const { producers } = useProducers({ inventoryId: inventory.id });
	const { tags } = useTags({ inventoryId: inventory.id });
	const { graphs } = useGraphs({ inventoryId: inventory.id });

	// TODO: Add loading and validating states to the dialog, and disable the confirm button while loading/validating.

	const target: DeleteTarget = {
		resourceType: 'inventory',
		resourceName: inventory.name,
		references: buildInventoryReferences({
			itemsCount: items?.length ?? 0,
			producersCount: producers?.length ?? 0,
			tagsCount: tags?.length ?? 0,
			graphsCount: graphs?.length ?? 0,
		}),
	};

	async function onConfirm()
	{
		await deleteInventory({ inventoryId: inventory.id });
	}

	const meta: ResourceMetaInfo = {
		icon: '©',
		color: '#3cb87a',
		description: (name) => `Graph "${name}" stores complex graph data (jsonb) tied to this inventory.`,
		warningThreshold: 1,
	};

	return (
		<DeleteConfirmationDialog
			trigger={
				<Button variant="destructive" size="icon-sm">
					<TrashIcon className="size-3" />
				</Button>
			}
			target={target}
			meta={meta}
			onConfirm={onConfirm}
		/>
	);
}

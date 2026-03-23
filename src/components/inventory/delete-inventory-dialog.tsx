'use client';

import { Button } from '@/components/ui/button';
import {
	buildInventoryReferences,
	DeleteConfirmationDialog,
	DeleteTarget,
	ResourceMetaInfo,
} from '@/components/confirmation-dialog';
import { Inventory, deleteInventory } from '@/domain/inventory';
import { useItems } from '@/domain/item';
import { useProducers } from '@/domain/producer';
import { useTags } from '@/domain/tag';
import { useProductionGraphs } from '@/domain/production-graph';
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
	const { productionGraphs } = useProductionGraphs({ inventoryId: inventory.id });

	const target: DeleteTarget = {
		resourceType: 'inventory',
		resourceName: inventory.name,
		references: buildInventoryReferences({
			itemsCount: items.length,
			producersCount: producers.length,
			tagsCount: tags.length,
			graphsCount: productionGraphs.length,
		}),
	};

	async function onConfirm()
	{
		await deleteInventory(inventory.id);
	}

	const meta: ResourceMetaInfo = {
		icon: '©',
		color: '#3cb87a',
		description: (name) => `Production graph "${name}" stores complex graph data (jsonb) tied to this inventory.`,
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

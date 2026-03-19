'use client';

import { DataTableColumnHeader } from '@/components/data-table';

import { Button } from '@/components/ui/button';

import { Inventory, deleteInventory, exportInventory } from '@/domain/inventory';

import { downloadJSON } from '@/lib/download-json';

import Link from 'next/link';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DownloadIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { getInventoryHref } from '@/lib/navigation';
import { buildInventoryReferences, DeleteConfirmationDialog, DeleteTarget } from '../confirmation-dialog';
import { useItems } from '@/domain/item';
import { useProducers } from '@/domain/producer/hooks/use-producers';
import { useTags } from '@/domain/tag/hooks/use-tags';
import { useProductionGraphs } from '@/domain/production-graph/hooks/use-production-graphs';
import { useRouter } from 'next/navigation';

export type InventoryColumnData = Inventory;

export const inventoryColumnns: ColumnDef<InventoryColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			const name = row.original.name;
			const href = `/inventories/${row.original.id}/items`;

			return (
				<Link href={href} className="ml-3 truncate font-medium hover:underline">
					{name}
				</Link>
			);
		},
	},
	{
		id: 'actions',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" className="text-center" />,
		cell: ({ row }) => <Actions row={row} />,
		enableSorting: false,
		enableHiding: false,
	},
];

interface ActionsProps
{
	row: Row<InventoryColumnData>;
}

function Actions({ row }: ActionsProps)
{
	async function onExport(inventory: Inventory)
	{
		const json = await exportInventory(inventory.id);
		downloadJSON(json, `${inventory.name.toLowerCase().replace(/\s+/g, '_')}.json`);
	}

	return (
		<div className="flex items-center justify-center gap-2">
			<Button variant="outline" size="icon-sm" onClick={() => onExport(row.original)}>
				<DownloadIcon className="size-3" />
			</Button>
			<Link href={getInventoryHref(row.original, 'edit')}>
				<PencilIcon className="size-3" />
			</Link>
			<DeleteInventoryDialog inventory={row.original} />
		</div>
	);
}

interface DeleteInventoryDialogProps
{
	inventory: Inventory;
}

function DeleteInventoryDialog({ inventory }: DeleteInventoryDialogProps)
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

	return (
		<DeleteConfirmationDialog
			trigger={
				<Button variant="destructive" size="icon-sm">
					<TrashIcon className="size-3" />
				</Button>
			}
			target={target}
			onConfirm={onConfirm}
		/>
	);
}

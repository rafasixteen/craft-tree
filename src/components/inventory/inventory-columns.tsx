'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { exportInventory, Inventory, useInventories } from '@/domain/inventory';
import { DataTableColumnHeader } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { downloadJSON } from '@/lib/download-json';
import Link from 'next/link';

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
	const id = row.original.id;

	const { deleteInventory } = useInventories();

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
			<Link href={`/inventories/${id}/edit`}>
				<PencilIcon className="size-3" />
			</Link>
			<Button variant="destructive" size="icon-sm" onClick={() => deleteInventory(id)}>
				<TrashIcon className="size-3" />
			</Button>
		</div>
	);
}

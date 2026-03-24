'use client';

import { DataTableColumnHeader } from '@/components/data-table';
import { DeleteInventoryDialog } from '@/components/inventory';

import { Button } from '@/components/ui/button';

import { Inventory, exportInventory } from '@/domain/inventory';

import { downloadJSON } from '@/lib/download-json';

import Link from 'next/link';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DownloadIcon, PencilIcon } from 'lucide-react';
import { getInventoryHref } from '@/lib/navigation';

export type InventoryColumnData = Inventory;

export const inventoryColumnns: ColumnDef<InventoryColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			return (
				<Link
					href={getInventoryHref(row.original, ['items'])}
					className="ml-3 truncate font-medium hover:underline"
				>
					{row.original.name}
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
			<Link href={getInventoryHref(row.original, ['edit'])}>
				<PencilIcon className="size-3" />
			</Link>
			<DeleteInventoryDialog inventory={row.original} />
		</div>
	);
}

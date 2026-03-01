'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Inventory } from '@/domain/inventory';
import { DataTableColumnHeader } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

export type InventoryColumnData = Inventory;

export const productionGraphColumnns: ColumnDef<InventoryColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			const name = row.original.name;
			const id = row.original.id;
			const href = `/inventories/${row.original.id}/production-graphs/${id}`;

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

	// TODO: Add useProductionGraphs hook.
	// const { deleteInventory } = useInventories();

	return (
		<div className="flex justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link href={`/inventories/${id}/edit`}>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<Button variant="destructive" size="icon-sm">
				<TrashIcon className="size-3" />
			</Button>
		</div>
	);
}

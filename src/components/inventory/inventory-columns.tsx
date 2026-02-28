'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Inventory, useInventories } from '@/domain/inventory';
import { DataTableColumnHeader } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
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
	const inventoryId = row.original.id;

	const { deleteInventory } = useInventories();

	return (
		<div className="flex justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link href={`/inventories/${inventoryId}/inventorys/${id}/edit`}>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<Button variant="destructive" size="icon-sm" onClick={() => deleteInventory(id)}>
				<TrashIcon className="size-3" />
			</Button>
		</div>
	);
}

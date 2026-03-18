'use client';

import { DataTableColumnHeader } from '@/components/data-table';

import { Button } from '@/components/ui/button';

import { ProductionGraph, useProductionGraphs } from '@/domain/production-graph';

import Link from 'next/link';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';

export type ProductionGraphColumnData = ProductionGraph;

export const productionGraphColumnns: ColumnDef<ProductionGraphColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			const name = row.original.name;
			const id = row.original.id;
			const inventoryId = row.original.inventoryId;

			const href = `/inventories/${inventoryId}/production-graphs/${id}`;

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
	row: Row<ProductionGraphColumnData>;
}

function Actions({ row }: ActionsProps)
{
	const id = row.original.id;
	const inventoryId = row.original.inventoryId;

	const { deleteProductionGraph } = useProductionGraphs({ inventoryId });

	return (
		<div className="flex justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link href={`/inventories/${inventoryId}/production-graphs/${id}/edit`}>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<Button variant="destructive" size="icon-sm" onClick={() => deleteProductionGraph(id)}>
				<TrashIcon className="size-3" />
			</Button>
		</div>
	);
}

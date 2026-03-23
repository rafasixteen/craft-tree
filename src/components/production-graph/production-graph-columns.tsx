'use client';

import { DataTableColumnHeader } from '@/components/data-table';

import { Button } from '@/components/ui/button';

import { ProductionGraph } from '@/domain/production-graph';

import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { getProductionGraphHref } from '@/lib/navigation';
import { DeleteProductionGraphDialog } from '@/components/production-graph';

export type ProductionGraphColumnData = ProductionGraph;

export const productionGraphColumnns: ColumnDef<ProductionGraphColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			return (
				<Link href={getProductionGraphHref(row.original)} className="ml-3 truncate font-medium hover:underline">
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
	row: Row<ProductionGraphColumnData>;
}

function Actions({ row }: ActionsProps)
{
	return (
		<div className="flex items-center justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link href={getProductionGraphHref(row.original, 'edit')}>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<DeleteProductionGraphDialog productionGraph={row.original} />
		</div>
	);
}

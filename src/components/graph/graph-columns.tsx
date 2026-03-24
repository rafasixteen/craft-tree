'use client';

import { DataTableColumnHeader } from '@/components/data-table';

import { Button } from '@/components/ui/button';

import { Graph } from '@/domain/graph';

import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { getGraphHref } from '@/lib/navigation';
import { DeleteGraphDialog } from '@/components/graph';

export type GraphColumnData = Graph;

export const graphColumnns: ColumnDef<GraphColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			return (
				<Link href={getGraphHref(row.original)} className="ml-3 truncate font-medium hover:underline">
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
	row: Row<GraphColumnData>;
}

function Actions({ row }: ActionsProps)
{
	return (
		<div className="flex items-center justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link href={getGraphHref(row.original, 'edit')}>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<DeleteGraphDialog graph={row.original} />
		</div>
	);
}

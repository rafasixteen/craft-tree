'use client';

import { DataTableColumnHeader } from '@/components/data-table';

import { Button } from '@/components/ui/button';

import { Producer } from '@/domain/producer';

import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DeleteProducerDialog } from '@/components/producer';
import { getProducerHref } from '@/lib/navigation';

export type ProducerColumnData = Producer & { tags: string[] };

export const producerColumnns: ColumnDef<ProducerColumnData>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) =>
		{
			return (
				<Link
					href={getProducerHref({ inventoryId: row.original.inventoryId, producerId: row.original.id })}
					className="ml-3 truncate font-medium hover:underline"
				>
					{row.original.name}
				</Link>
			);
		},
	},
	{
		accessorKey: 'tags',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
		cell: ({ row }) =>
		{
			const tags = row.original.tags;
			const sortedTags = [...tags].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

			return (
				<div className="flex flex-wrap gap-1">
					{sortedTags.length > 0 ? (
						sortedTags.map((tag, index) => (
							<span key={index} className="rounded-md bg-muted px-2 py-1 text-xs">
								{tag}
							</span>
						))
					) : (
						<span className="text-xs text-muted-foreground">No tags</span>
					)}
				</div>
			);
		},
		filterFn: (row, id, value: string[]) =>
		{
			// Every selected tag must exist in the row
			return value.every((tag) => row.original.tags.includes(tag));
		},
		enableSorting: false,
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
	row: Row<ProducerColumnData>;
}

function Actions({ row }: ActionsProps)
{
	return (
		<div className="flex items-center justify-center gap-2">
			<Button variant="outline" size="icon-sm">
				<Link
					href={getProducerHref({
						inventoryId: row.original.inventoryId,
						producerId: row.original.id,
						path: ['edit'],
					})}
				>
					<PencilIcon className="size-3" />
				</Link>
			</Button>
			<DeleteProducerDialog producer={row.original} />
		</div>
	);
}
